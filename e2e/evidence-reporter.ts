import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import type {
	FullConfig,
	FullResult,
	Reporter,
	Suite,
	TestCase,
	TestResult,
} from "@playwright/test/reporter";

type Coverage = {
	route: string;
	viewport: string;
	state: string;
};

type Accessibility = {
	state: string;
	violations: string[];
};

type TestSummary = {
	status: TestResult["status"];
	coverage: Coverage[];
	accessibility: Accessibility[];
};

type Manifest = {
	schemaVersion: 1;
	command: string;
	baseUrl: string;
	environment: {
		node: string;
		pnpm: string;
		commit: string;
		dirtyWorktree: boolean;
	};
	timestamps: {
		startedAtUtc: string;
		finishedAtUtc: string;
	};
	totals: {
		tests: number;
		passed: number;
		failed: number;
		skipped: number;
	};
	failedTestIds: string[];
	coverage: {
		routes: string[];
		viewports: string[];
		states: string[];
	};
	accessibility: {
		scans: number;
		violations: string[];
	};
	artifacts: {
		playwrightConfigSha256: string;
		e2eSpecSha256: string;
		manifest: string;
	};
};

function readVersion(command: string, args: string[]): string {
	try {
		return execFileSync(command, args, { encoding: "utf8" }).trim();
	} catch {
		return "unavailable";
	}
}

function readGitState(): { commit: string; dirtyWorktree: boolean } {
	try {
		const environment = { ...process.env, GIT_MASTER: "1" };
		const commit = execFileSync("git", ["rev-parse", "HEAD"], {
			encoding: "utf8",
			env: environment,
		}).trim();
		const status = execFileSync("git", ["status", "--porcelain"], {
			encoding: "utf8",
			env: environment,
		});
		return { commit, dirtyWorktree: status.length > 0 };
	} catch {
		return { commit: "unavailable", dirtyWorktree: true };
	}
}

function hashFile(path: string): string {
	const content = readFileSync(resolve(path));
	return createHash("sha256").update(content).digest("hex");
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null;
}

function parseJsonAnnotation(
	annotation: { type: string; description?: string },
): unknown {
	if (annotation.description === undefined) return null;
	try {
		return JSON.parse(annotation.description) as unknown;
	} catch {
		return null;
	}
}

function readAnnotations(test: TestCase): {
	coverage: Coverage[];
	accessibility: Accessibility[];
} {
	const coverage: Coverage[] = [];
	const accessibility: Accessibility[] = [];
	for (const annotation of test.annotations) {
		const value = parseJsonAnnotation(annotation);
		if (!isRecord(value)) continue;
		if (
			annotation.type === "coverage" &&
			typeof value.route === "string" &&
			typeof value.viewport === "string" &&
			typeof value.state === "string"
		) {
			coverage.push({
				route: value.route,
				viewport: value.viewport,
				state: value.state,
			});
		}
		if (
			annotation.type === "accessibility" &&
			typeof value.state === "string" &&
			Array.isArray(value.violations) &&
			value.violations.every((item): item is string => typeof item === "string")
		) {
			accessibility.push({ state: value.state, violations: value.violations });
		}
	}
	return { coverage, accessibility };
}

function unique(values: string[]): string[] {
	return [...new Set(values)].sort();
}

export default class EvidenceReporter implements Reporter {
	private readonly summaries = new Map<string, TestSummary>();
	private startedAtUtc = new Date().toISOString();
	private testCount = 0;

	onBegin(config: FullConfig, suite: Suite): void {
		void config;
		this.startedAtUtc = new Date().toISOString();
		this.testCount = suite.allTests().length;
	}

	onTestEnd(test: TestCase, result: TestResult): void {
		const annotations = readAnnotations(test);
		this.summaries.set(test.id, {
			status: result.status,
			coverage: annotations.coverage,
			accessibility: annotations.accessibility,
		});
	}

	onEnd(result: FullResult): void {
		const summaries = [...this.summaries.values()];
		const coverage = summaries.flatMap((summary) => summary.coverage);
		const accessibility = summaries.flatMap((summary) => summary.accessibility);
		const git = readGitState();
		const manifest: Manifest = {
			schemaVersion: 1,
			command: "pnpm test:e2e:evidence",
			baseUrl: process.env.E2E_BASE_URL ?? "http://127.0.0.1:3000",
			environment: {
				node: process.version,
				pnpm: readVersion("corepack", ["pnpm", "--version"]),
				commit: git.commit,
				dirtyWorktree: git.dirtyWorktree,
			},
			timestamps: {
				startedAtUtc: this.startedAtUtc,
				finishedAtUtc: new Date().toISOString(),
			},
			totals: {
				tests: this.testCount,
				passed: summaries.filter((summary) => summary.status === "passed").length,
				failed: summaries.filter(
					(summary) => summary.status === "failed" || summary.status === "timedOut",
				).length,
				skipped: summaries.filter((summary) => summary.status === "skipped").length,
			},
			failedTestIds: [...this.summaries.entries()]
				.filter(([, summary]) => summary.status === "failed" || summary.status === "timedOut")
				.map(([id]) => id),
			coverage: {
				routes: unique(coverage.map((item) => item.route)),
				viewports: unique(coverage.map((item) => item.viewport)),
				states: unique(coverage.map((item) => item.state)),
			},
			accessibility: {
				scans: accessibility.length,
				violations: unique(accessibility.flatMap((item) => item.violations)),
			},
			artifacts: {
				playwrightConfigSha256: hashFile("playwright.config.ts"),
				e2eSpecSha256: hashFile("e2e/echogpt.spec.ts"),
				manifest: "e2e/evidence/latest-run.json",
			},
		};
		const output = resolve("e2e/evidence/latest-run.json");
		mkdirSync(dirname(output), { recursive: true });
		writeFileSync(output, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
		void result;
	}
}
