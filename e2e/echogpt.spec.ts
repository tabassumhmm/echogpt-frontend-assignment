import AxeBuilder from "@axe-core/playwright";
import { expect, type Page, test } from "@playwright/test";

const routeEvidence = [
	{ name: "landing", path: "/" },
	{ name: "workspace", path: "/workspace" },
	{ name: "extension", path: "/extension" },
] as const;

const viewportEvidence = [
	{ label: "mobile", width: 360, height: 800, capture: true },
	{ label: "tablet", width: 768, height: 1024, capture: false },
	{ label: "laptop", width: 1024, height: 768, capture: false },
	{ label: "desktop", width: 1440, height: 900, capture: true },
] as const;

const workspaceImportPayload = {
	kind: "echogpt-workspace-history",
	version: 1,
	conversations: [
		{
			id: "imported-roadmap",
			modelId: "gpt-4",
			title: "Imported roadmap",
			createdAt: "2026-01-10T09:00:00.000Z",
			updatedAt: "2026-01-10T09:05:00.000Z",
			pinned: false,
			messages: [
				{
					id: "imported-roadmap-user",
					role: "user",
					content: "What should I verify first?",
					createdAt: "2026-01-10T09:00:00.000Z",
					modelId: "gpt-4",
					status: "complete",
				},
				{
					id: "imported-roadmap-assistant",
					role: "assistant",
					content: "Imported local response.",
					createdAt: "2026-01-10T09:00:01.000Z",
					modelId: "gpt-4",
					status: "complete",
				},
			],
		},
		{
			id: "imported-notes",
			modelId: "claude-sonnet",
			title: "Imported notes",
			createdAt: "2026-01-10T09:06:00.000Z",
			updatedAt: "2026-01-10T09:07:00.000Z",
			pinned: false,
			messages: [
				{
					id: "imported-notes-user",
					role: "user",
					content: "Turn these launch notes into a calm announcement.",
					createdAt: "2026-01-10T09:06:00.000Z",
					modelId: "claude-sonnet",
					status: "complete",
				},
				{
					id: "imported-notes-assistant",
					role: "assistant",
					content: "Imported Claude response.",
					createdAt: "2026-01-10T09:06:01.000Z",
					modelId: "claude-sonnet",
					status: "complete",
				},
			],
		},
	],
};

test.beforeEach(async ({ page }) => {
	await page.emulateMedia({ reducedMotion: "reduce" });
});

async function expectNoHorizontalOverflow(page: Page) {
	await expect
		.poll(() =>
			page.evaluate(
				() => document.documentElement.scrollWidth <= window.innerWidth,
			),
		)
		.toBe(true);
}

async function expectNoSeriousViolations(page: Page, state: string) {
	await page.locator("main").waitFor();
	await page.evaluate(async () => {
		await document.fonts.ready;
	});
	await page.waitForFunction(() =>
		document
			.getAnimations()
			.every((animation) => animation.playState !== "running"),
	);
	const results = await new AxeBuilder({ page }).analyze();
	const blocking = results.violations.filter((violation) =>
		["serious", "critical"].includes(violation.impact ?? ""),
	);
	test.info().annotations.push({
		type: "accessibility",
		description: JSON.stringify({
			state,
			violations: blocking.map((violation) => violation.id),
		}),
	});
	expect(blocking).toEqual([]);
}

test("workspace completes the local history journey without overflow", async ({
	page,
}) => {
	test.setTimeout(90_000);
	await page.setViewportSize({ width: 1440, height: 900 });
	const consoleErrors: string[] = [];
	page.on("console", (message) => {
		if (message.type() === "error") consoleErrors.push(message.text());
	});

	await page.goto("/");
	await expect(
		page.getByRole("heading", { name: "One prompt, every model." }),
	).toBeVisible();
	await expect(page.getByText("Qualified local-first concept")).toBeVisible();
	await page.getByRole("link", { name: "Explore the workspace" }).click();
	await expect(
		page.getByRole("heading", {
			name: "Compare models without losing context.",
		}),
	).toBeVisible();
	await expect(
		page.getByText("Saved in browser", { exact: true }),
	).toBeVisible();

	const prompt = page.getByRole("textbox", {
		name: "What would you like to work through?",
	});
	await page.getByRole("button", { name: "Plan a small feature" }).click();
	await expect(prompt).toHaveValue(/^Plan a small feature/);
	await prompt.fill("What should I verify first?");
	await page.getByRole("button", { name: "Send" }).click();
	await expect(page.getByText(/^Demo response:/)).toBeVisible({
		timeout: 8_000,
	});

	const modelSelect = page.getByRole("combobox", {
		name: "Choose active model",
	});
	await modelSelect.click();
	await expect(page.getByRole("option")).toHaveCount(4);
	await page.getByRole("option", { name: /Claude Sonnet/ }).click();
	await expect(page.getByRole("status")).toContainText(
		"Switched to Claude Sonnet history",
	);
	await expect(
		page.getByText("No histories for this model yet.", { exact: true }),
	).toBeVisible();

	await page.getByRole("button", { name: "New conversation" }).click();
	await expect(
		page.getByRole("button", { name: "New conversation 0 messages" }),
	).toBeVisible();
	await prompt.fill("Summarize this copy");
	await page.getByRole("button", { name: "Send" }).click();
	await expect(page.getByText(/^Demo response:/)).toBeVisible({
		timeout: 8_000,
	});
	await expect(
		page.getByRole("button", { name: "Summarize this copy 2 messages" }),
	).toBeVisible();

	const history = page.getByRole("region", { name: "Conversations" });
	const historySearch = page.getByRole("searchbox", {
		name: "Search conversation histories",
	});
	await historySearch.fill("no match");
	await expect(history.getByText("No matching histories.")).toBeVisible();
	await historySearch.fill("");
	await history
		.getByRole("button", { name: "Delete Summarize this copy" })
		.click();
	await expect(page.getByRole("alertdialog")).toBeVisible();
	await page.getByRole("button", { name: "Delete conversation" }).click();
	await expect(
		history.getByRole("button", { name: "Summarize this copy 2 messages" }),
	).toHaveCount(0);

	await prompt.fill("Stop this response before it completes");
	await prompt.press("Enter");
	await page.getByRole("button", { name: "Stop generating" }).click();
	await expect(
		page.getByText("Response stopped before completion."),
	).toBeVisible();

	await page.getByRole("button", { name: "Import" }).click();
	await page
		.locator('input[type="file"][accept*="application/json"]')
		.setInputFiles({
			name: "invalid.json",
			mimeType: "application/json",
			buffer: Buffer.from("not json"),
		});
	await expect(
		page.getByText("Invalid EchoGPT workspace history file", { exact: true }),
	).toBeVisible();

	await page.getByRole("button", { name: "Import" }).click();
	await page
		.locator('input[type="file"][accept*="application/json"]')
		.setInputFiles({
			name: "workspace.json",
			mimeType: "application/json",
			buffer: Buffer.from(JSON.stringify(workspaceImportPayload)),
		});
	await expect(page.getByRole("alertdialog")).toContainText("2 conversations");
	await page.getByRole("button", { name: "Confirm import" }).click();
	await expect(page.getByText("Workspace history imported.")).toBeVisible();
	await expect(
		page.getByText("Imported Claude response.", { exact: true }),
	).toBeVisible();
	await expect(
		page.getByText("Imported local response.", { exact: true }),
	).toBeHidden();

	const downloadPromise = page.waitForEvent("download");
	await page.getByRole("button", { name: "Export" }).click();
	const download = await downloadPromise;
	expect(download.suggestedFilename()).toBe("echogpt-workspace-history.json");
	expect(await download.path()).not.toBeNull();

	await modelSelect.click();
	await page.getByRole("option", { name: /GPT-4/ }).click();
	await expect(
		page.getByText("Imported local response.", { exact: true }),
	).toBeVisible();
	await expect(
		page.getByText("Imported Claude response.", { exact: true }),
	).toBeHidden();

	await modelSelect.click();
	await page.getByRole("option", { name: /Gemini Pro/ }).click();
	await expect(
		page.getByText("No histories for this model yet.", { exact: true }),
	).toBeVisible();
	await page.getByRole("button", { name: "New conversation" }).click();
	await expect(
		history.getByRole("button", { name: "New conversation 0 messages" }),
	).toBeVisible();
	await prompt.fill("Draft a small feature");
	await page.getByRole("button", { name: "Send" }).click();
	await expect(page.getByText(/^Demo response:/)).toBeVisible({
		timeout: 8_000,
	});
	const newConversation = history.getByRole("button", {
		name: "Draft a small feature 2 messages",
	});
	await expect(newConversation).toBeVisible();

	await historySearch.fill("draft a small feature");
	await expect(newConversation).toBeVisible();
	await historySearch.fill("");
	await history
		.getByRole("button", { name: "Delete Draft a small feature" })
		.click();
	await page.getByRole("button", { name: "Delete conversation" }).click();
	await expect(newConversation).toHaveCount(0);

	await page.getByRole("button", { name: "Collapse context panel" }).click();
	await expect(page.getByText("Attachment metadata")).toBeHidden();
	await page.getByRole("button", { name: "Expand context panel" }).click();
	await expect(page.getByText("Attachment metadata")).toBeVisible();

	test.info().annotations.push({
		type: "coverage",
		description: JSON.stringify({
			route: "/workspace",
			viewport: "1440x900",
			state:
				"local history, model switch, send, stop, import/export, context panel",
		}),
	});
	await page.setViewportSize({ width: 360, height: 800 });
	await expectNoHorizontalOverflow(page);
	test.info().annotations.push({
		type: "coverage",
		description: JSON.stringify({
			route: "/workspace",
			viewport: "360x800",
			state: "interactive responsive workspace",
		}),
	});
	await expectNoSeriousViolations(page, "workspace interactive 360x800");
	expect(consoleErrors).toEqual([]);
});

test("extension runs actions, keeps per-action history, and resets locally", async ({
	page,
}) => {
	test.setTimeout(90_000);
	await page.setViewportSize({ width: 1440, height: 900 });
	const consoleErrors: string[] = [];
	page.on("console", (message) => {
		if (message.type() === "error") consoleErrors.push(message.text());
	});

	await page.goto("/extension");
	await expect(
		page.getByRole("region", { name: "EchoGPT extension simulator" }),
	).toBeVisible();
	await expect(page.getByText("EchoGPT Extension")).toBeVisible();

	const model = page.getByRole("combobox", { name: "Extension model" });
	await model.click();
	await expect(page.getByRole("option")).toHaveCount(4);
	await page.getByRole("option", { name: "Gemini Pro" }).click();

	const actions = [
		["Summarize page", /^Demo summary:/],
		["Rewrite", /^Demo rewrite:/],
		["Translate", /^Demo translation:/],
		["Explain code", /^Demo explanation:/],
		["Brainstorm", /^Demo ideas:/],
		["Generate image", /^Demo image brief:/],
	] as const;
	for (const [label, response] of actions) {
		await page.getByRole("button", { name: label, exact: true }).click();
		await expect(page.getByText(response)).toBeVisible({ timeout: 8_000 });
		await page.getByRole("tab", { name: "History" }).click();
		await page.getByRole("button", { name: "Clear history" }).click();
		await expect(page.getByRole("alertdialog")).toBeVisible();
		await page.getByRole("button", { name: "Clear extension history" }).click();
		await expect(page.getByText("No action history yet")).toBeVisible();
		await page.getByRole("tab", { name: "Chat" }).click();
	}

	await page.getByRole("button", { name: "Summarize page" }).click();
	const pageText = page.getByRole("textbox", { name: "Page text" });
	await pageText.fill("A short page passage that should never be stored.");
	await pageText.press("Control+Enter");
	await expect(page.getByText(/^Demo summary:/)).toBeVisible({
		timeout: 8_000,
	});
	await expect(pageText).toHaveValue("");
	await page.getByRole("tab", { name: "History" }).click();
	await expect(page.getByText("Summarize page", { exact: true })).toBeVisible();
	await page.getByRole("tab", { name: "Chat" }).click();
	await page.getByRole("tab", { name: "Settings" }).click();
	await page.getByRole("button", { name: "Reset demo data" }).click();
	await expect(page.getByRole("alertdialog")).toContainText(
		"Reset all demo data",
	);
	await page.getByRole("button", { name: "Reset demo data" }).click();
	await expect(page.getByRole("alertdialog")).toBeHidden();
	await expect(page.getByText("Demo data reset.")).toBeVisible();

	test.info().annotations.push({
		type: "coverage",
		description: JSON.stringify({
			route: "/extension",
			viewport: "1440x900",
			state: "six quick actions, isolated history, settings, global reset",
		}),
	});
	await expectNoSeriousViolations(page, "extension settings after reset");
	expect(consoleErrors).toEqual([]);
});

test("public surfaces have no serious accessibility violations", async ({
	page,
}) => {
	for (const route of routeEvidence) {
		for (const viewport of viewportEvidence) {
			await page.setViewportSize({
				width: viewport.width,
				height: viewport.height,
			});
			await page.goto(route.path);
			await expectNoHorizontalOverflow(page);
			test.info().annotations.push({
				type: "coverage",
				description: JSON.stringify({
					route: route.path,
					viewport: `${viewport.width}x${viewport.height}`,
					state: "default route",
				}),
			});
			await expectNoSeriousViolations(
				page,
				`${route.name} ${viewport.label} default`,
			);
			if (viewport.capture) {
				await page.screenshot({
					path: `Screenshots/${route.name}-${viewport.label}.png`,
					fullPage: true,
					animations: "disabled",
				});
			}
		}
	}
});
