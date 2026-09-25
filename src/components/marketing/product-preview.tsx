"use client";

import {
	ArrowUpRight,
	Bot,
	Braces,
	Check,
	CircleStop,
	Command,
	Sparkles,
	type LucideIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const previewActions: readonly { label: string; icon: LucideIcon }[] = [
	{ label: "Summarize", icon: Braces },
	{ label: "Rewrite", icon: Check },
	{ label: "Plan next", icon: ArrowUpRight },
];

export function ProductPreview() {
	return (
		<div className="relative">
			<div
				className="absolute -inset-4 rounded-[2rem] bg-primary/10 blur-3xl"
				aria-hidden="true"
			/>
			<Card className="relative overflow-hidden border-border/80 bg-surface/95 shadow-[var(--shadow-float)]">
				<CardHeader className="border-b border-border/70 bg-surface-raised/70 pb-4">
					<div className="flex items-center justify-between gap-3">
						<div className="flex items-center gap-2.5">
							<span
								className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground"
								aria-hidden="true"
							>
								<Sparkles className="size-4" />
							</span>
							<div>
								<CardTitle className="text-sm">Workspace</CardTitle>
								<p className="font-mono text-[0.68rem] text-muted-foreground">
									local session · 04 models
								</p>
							</div>
						</div>
						<Badge variant="secondary">Demo catalog</Badge>
					</div>
				</CardHeader>
				<CardContent className="grid gap-4 p-4 sm:p-5">
					<div className="flex items-center justify-between rounded-xl border border-border/70 bg-background/70 px-3 py-2.5">
						<div className="flex items-center gap-2 text-xs text-muted-foreground">
							<span
								className="size-2 rounded-full bg-success"
								aria-hidden="true"
							/>
							Context preserved
						</div>
						<span className="font-mono text-[0.68rem] text-muted-foreground">
							just now
						</span>
					</div>
					<div className="space-y-3">
						<div className="max-w-[88%] rounded-2xl rounded-tl-md bg-primary px-4 py-3 text-sm leading-6 text-primary-foreground">
							Give me a clear brief from these notes, with the decision first.
						</div>
						<div className="ml-auto max-w-[92%] rounded-2xl rounded-tr-md border border-border/70 bg-surface-raised px-4 py-3 text-sm leading-6 text-foreground">
							<div className="mb-2 flex items-center gap-2 font-mono text-[0.68rem] text-muted-foreground">
								<Bot className="size-3.5" aria-hidden="true" />
								Claude Sonnet
								<Badge className="px-1.5 py-0 text-[0.58rem]" variant="outline">
									Demo
								</Badge>
							</div>
							Start with the decision, group evidence by theme, then close with
							the questions that still need an answer.
						</div>
					</div>
					<div className="rounded-xl border border-border/70 bg-background/70 p-3">
						<div className="mb-3 flex items-center gap-1.5 text-xs text-muted-foreground">
							<Command className="size-3.5" aria-hidden="true" />
							Try a focused action
						</div>
						<div className="flex flex-wrap gap-2">
							{previewActions.map(({ label, icon: Icon }) => (
								<span
									className="inline-flex items-center gap-1.5 rounded-lg border border-border/70 bg-surface px-2.5 py-1.5 text-xs"
									key={label}
								>
									<Icon className="size-3.5 text-primary" aria-hidden="true" />
									{label}
								</span>
							))}
						</div>
					</div>
					<div className="flex items-center justify-between border-t border-border/70 pt-3 text-xs text-muted-foreground">
						<span className="inline-flex items-center gap-1.5">
							<CircleStop className="size-3.5" aria-hidden="true" />
							Ready when you are
						</span>
						<Button asChild size="sm" variant="ghost">
							<a href="/workspace">
								Open workspace{" "}
								<ArrowUpRight className="size-3.5" aria-hidden="true" />
							</a>
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
