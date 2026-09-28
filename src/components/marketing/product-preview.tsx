"use client";

import type { Icon } from "@phosphor-icons/react";
import {
	ArrowUpRight,
	CaretDown,
	Check,
	BracketsCurly,
	PaperPlaneRight,
	Robot,
	SquaresFour,
} from "@phosphor-icons/react/dist/ssr";

import { Card } from "@/components/ui/card";

const previewActions: readonly { label: string; icon: Icon }[] = [
	{ label: "Summarize", icon: BracketsCurly },
	{ label: "Rewrite", icon: Check },
	{ label: "Plan next", icon: ArrowUpRight },
];

export function ProductPreview() {
	return (
		<Card
			className="overflow-hidden border-2 border-border-strong bg-surface ring-0"
			role="img"
			aria-label="Product preview: a workspace chat with Claude Sonnet replying locally and a message composer"
		>
			<div className="flex items-center justify-between gap-3 border-b-2 border-border-strong px-4 py-3">
				<div className="flex items-center gap-2.5">
					<span
						className="grid size-8 place-items-center border-2 border-border-strong bg-primary text-primary-foreground"
						aria-hidden="true"
					>
						<SquaresFour className="size-4" />
					</span>
					<div>
						<p className="text-sm font-bold">Workspace</p>
						<p className="micro text-muted-foreground">
							local session · 4 models
						</p>
					</div>
				</div>
				<span className="micro flex items-center gap-1.5 border-2 border-border-strong px-2 py-1">
					<Robot className="size-3.5 text-accent-strong" aria-hidden="true" />
					Claude Sonnet
					<CaretDown className="size-3" aria-hidden="true" />
				</span>
			</div>

			<div className="grid gap-4 p-4">
				<div className="space-y-4">
					<div className="flex justify-end">
						<div className="max-w-[85%]">
							<p className="micro mb-1 text-right text-muted-foreground">
								You · 3:00 PM
							</p>
							<div className="border-2 border-border-strong bg-primary px-3 py-2 text-sm leading-6 text-primary-foreground">
								Give me a clear brief from these notes, with the decision first.
							</div>
						</div>
					</div>
					<div className="flex gap-2.5">
						<span
							className="mt-5 grid size-7 shrink-0 place-items-center border-2 border-border-strong bg-accent-soft text-accent-strong"
							aria-hidden="true"
						>
							<Robot className="size-4" />
						</span>
						<div className="max-w-[85%]">
							<p className="micro mb-1 text-muted-foreground">
								Claude Sonnet · 3:00 PM
							</p>
							<div className="border-2 border-border-strong bg-background px-3 py-2 text-sm leading-6">
								Start with the decision, group evidence by theme, then close
								with the questions that still need an answer.
							</div>
						</div>
					</div>
					<div className="flex items-center gap-1.5 pl-[38px]">
						<span className="size-1.5 animate-pulse bg-accent-strong" />
						<span className="size-1.5 animate-pulse bg-accent-strong [animation-delay:150ms]" />
						<span className="size-1.5 animate-pulse bg-accent-strong [animation-delay:300ms]" />
						<span className="micro ml-1 text-muted-foreground">composing…</span>
					</div>
				</div>

				<div className="flex flex-wrap gap-2 border-t-2 border-border-strong pt-3">
					{previewActions.map(({ label, icon: Icon }) => (
						<span
							className="inline-flex items-center gap-1.5 border-2 border-border-strong bg-surface px-2.5 py-1.5 text-xs font-bold"
							key={label}
						>
							<Icon
								className="size-3.5 text-accent-strong"
								aria-hidden="true"
							/>
							{label}
						</span>
					))}
				</div>

				<div className="flex items-center justify-between gap-3 border-2 border-border-strong bg-background px-3 py-2">
					<span className="text-sm text-muted-foreground">
						Reply in this demo…
					</span>
					<span className="grid size-7 place-items-center border-2 border-border-strong bg-primary text-primary-foreground">
						<PaperPlaneRight className="size-3.5" aria-hidden="true" />
					</span>
				</div>
			</div>
		</Card>
	);
}
