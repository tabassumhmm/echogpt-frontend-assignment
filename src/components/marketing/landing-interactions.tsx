"use client";

import { Check, ChevronDown, Sparkles, X } from "lucide-react";
import { useEffect, useId, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { faqs, pricingPlans } from "@/lib/demo-data/site-copy";

type PricingPlan = (typeof pricingPlans)[number];

function PrototypeDialog({
	open,
	onClose,
}: {
	open: boolean;
	onClose: () => void;
}) {
	const titleId = useId();
	const descriptionId = useId();

	useEffect(() => {
		if (!open) return;
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") onClose();
		};
		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [onClose, open]);

	if (!open) return null;

	return (
		<div className="fixed inset-0 z-50 grid place-items-center bg-ink/35 p-4 backdrop-blur-sm">
			<button
				type="button"
				aria-label="Close Pro prototype dialog"
				className="absolute inset-0 cursor-default"
				onClick={onClose}
			/>
			<Card
				role="dialog"
				aria-modal="true"
				aria-labelledby={titleId}
				aria-describedby={descriptionId}
				className="relative w-full max-w-md border-border/80 bg-surface shadow-[var(--shadow-float)]"
			>
				<CardHeader>
					<div className="flex items-start justify-between gap-4">
						<div>
							<Badge variant="secondary" className="mb-3">
								Prototype
							</Badge>
							<CardTitle id={titleId}>Pro is a product direction</CardTitle>
						</div>
						<Button
							aria-label="Close Pro prototype dialog"
							variant="ghost"
							size="icon-sm"
							onClick={onClose}
						>
							<X aria-hidden="true" />
						</Button>
					</div>
				</CardHeader>
				<CardContent>
					<p
						id={descriptionId}
						className="text-sm leading-6 text-muted-foreground"
					>
						This demo does not collect payment or account details. It only
						previews the intended capability split between Free and Pro.
					</p>
					<Button asChild className="mt-5 w-full">
						<a href="/workspace" onClick={onClose}>
							Explore the free workspace
						</a>
					</Button>
				</CardContent>
			</Card>
		</div>
	);
}

function PlanCard({
	plan,
	onTryPro,
}: {
	plan: PricingPlan;
	onTryPro: () => void;
}) {
	return (
		<Card
			className={
				plan.highlighted
					? "border-primary/45 shadow-[var(--shadow-float)]"
					: "border-border/80"
			}
		>
			<CardHeader>
				<div className="flex items-center justify-between gap-3">
					<CardTitle>{plan.name}</CardTitle>
					{plan.highlighted ? (
						<Badge>Planned</Badge>
					) : (
						<Badge variant="outline">Available</Badge>
					)}
				</div>
				<p className="text-sm leading-6 text-muted-foreground">
					{plan.summary}
				</p>
			</CardHeader>
			<CardContent>
				<Separator className="mb-5" />
				<ul className="space-y-3 text-sm">
					{plan.features.map((feature) => (
						<li className="flex gap-2.5" key={feature}>
							<Check
								className="mt-0.5 size-4 shrink-0 text-success"
								aria-hidden="true"
							/>
							<span>{feature}</span>
						</li>
					))}
				</ul>
				{plan.highlighted ? (
					<Button
						className="mt-6 w-full"
						type="button"
						variant="default"
						onClick={onTryPro}
					>
						Try Pro demo
					</Button>
				) : (
					<Button asChild className="mt-6 w-full" variant="outline">
						<a href="/workspace">Start with Free</a>
					</Button>
				)}
			</CardContent>
		</Card>
	);
}

export function Pricing() {
	const [dialogOpen, setDialogOpen] = useState(false);

	return (
		<section className="page-shell" aria-labelledby="pricing-title">
			<div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
				<div>
					<p className="eyebrow">A simple split</p>
					<h2
						id="pricing-title"
						className="max-w-xl text-3xl font-semibold sm:text-4xl"
					>
						Start local. Keep the choice open.
					</h2>
				</div>
				<p className="max-w-sm text-sm leading-6 text-muted-foreground">
					No exact prices or checkout fields. This prototype makes the
					capability boundary clear without pretending to be a live
					subscription.
				</p>
			</div>
			<div className="grid gap-4 md:grid-cols-2">
				{pricingPlans.map((plan) => (
					<PlanCard
						key={plan.name}
						plan={plan}
						onTryPro={() => setDialogOpen(true)}
					/>
				))}
			</div>
			<PrototypeDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
		</section>
	);
}

export function Faq() {
	const [openIndex, setOpenIndex] = useState<number | null>(0);

	return (
		<section className="page-shell" aria-labelledby="faq-title">
			<div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
				<div>
					<p className="eyebrow">Good questions</p>
					<h2 id="faq-title" className="text-3xl font-semibold sm:text-4xl">
						A demo should tell you what it is.
					</h2>
					<p className="mt-4 max-w-md text-sm leading-6 text-muted-foreground">
						EchoGPT is intentionally explicit about its boundaries: local demo
						state, deterministic responses, and no live provider calls.
					</p>
				</div>
				<div className="divide-y divide-border/80 rounded-2xl border border-border/80 bg-surface/70 px-5">
					{faqs.map((faq, index) => {
						const answerId = `faq-answer-${index}`;
						const isOpen = openIndex === index;
						return (
							<div key={faq.question}>
								<button
									type="button"
									className="flex w-full items-center justify-between gap-4 py-5 text-left font-medium"
									aria-expanded={isOpen}
									aria-controls={answerId}
									onClick={() => setOpenIndex(isOpen ? null : index)}
								>
									<span>{faq.question}</span>
									<ChevronDown
										className={`size-4 shrink-0 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`}
										aria-hidden="true"
									/>
								</button>
								<div
									id={answerId}
									className={`grid transition-[grid-template-rows,opacity] duration-200 ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
								>
									<div className="overflow-hidden">
										<p className="pb-5 pr-8 text-sm leading-6 text-muted-foreground">
											{faq.answer}
										</p>
									</div>
								</div>
							</div>
						);
					})}
				</div>
			</div>
			<div className="mt-8 flex items-center gap-2 text-sm text-muted-foreground">
				<Sparkles className="size-4 text-primary" aria-hidden="true" />
				Built for exploring the interaction, not pretending it is a live
				provider.
			</div>
		</section>
	);
}
