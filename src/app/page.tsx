import {
	ArrowRight,
	Check,
	Code2,
	History,
	Layers3,
	LockKeyhole,
	PanelsTopLeft,
	Sparkles,
	WandSparkles,
	Zap,
} from "lucide-react";
import type { Metadata } from "next";
import { Faq, Pricing } from "@/components/marketing/landing-interactions";
import { ProductPreview } from "@/components/marketing/product-preview";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { features, modelCatalog, STORE_URL } from "@/lib/demo-data/site-copy";

export const metadata: Metadata = {
	title: "One prompt, every model",
	description:
		"Explore EchoGPT, a qualified local-first demo for comparing model behavior and trying a browser extension concept.",
};

const featureIcons = [Layers3, WandSparkles, History, LockKeyhole] as const;

export default function HomePage() {
	return (
		<div className="overflow-hidden">
			<section
				className="page-shell pb-16 pt-14 sm:pb-24 sm:pt-20 lg:pb-32 lg:pt-28"
				aria-labelledby="hero-title"
			>
				<div className="grid items-center gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
					<div className="max-w-2xl">
						<Badge className="mb-6 gap-1.5" variant="secondary">
							<Sparkles className="size-3.5" aria-hidden="true" />
							Qualified local-first concept
						</Badge>
						<h1
							id="hero-title"
							className="max-w-[12ch] text-5xl font-semibold leading-[0.98] tracking-[-0.055em] sm:text-6xl lg:text-7xl"
						>
							One prompt, every model.
						</h1>
						<p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground sm:text-xl">
							A calmer way to compare model behavior, keep separate histories,
							and move between surfaces without starting over.
						</p>
						<div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
							<Button asChild size="lg">
								<a href={STORE_URL} target="_blank" rel="noreferrer">
									<PanelsTopLeft className="size-4" aria-hidden="true" />
									Install EchoGPT
								</a>
							</Button>
							<Button asChild size="lg" variant="outline">
								<a href="/workspace">
									Explore the workspace
									<ArrowRight className="size-4" aria-hidden="true" />
								</a>
							</Button>
						</div>
						<div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
							<span className="inline-flex items-center gap-1.5">
								<Check className="size-4 text-success" aria-hidden="true" />
								No sign-in
							</span>
							<span className="inline-flex items-center gap-1.5">
								<Check className="size-4 text-success" aria-hidden="true" />
								No live AI calls
							</span>
							<span className="inline-flex items-center gap-1.5">
								<Check className="size-4 text-success" aria-hidden="true" />
								Local JSON export
							</span>
						</div>
					</div>
					<ProductPreview />
				</div>
			</section>

			<section
				className="border-y border-border/70 bg-surface/55"
				aria-labelledby="features-title"
			>
				<div className="page-shell py-16 sm:py-20 lg:py-24">
					<div className="max-w-2xl">
						<p className="eyebrow">Built for comparison</p>
						<h2
							id="features-title"
							className="text-3xl font-semibold sm:text-4xl"
						>
							The useful parts stay close.
						</h2>
						<p className="mt-4 text-base leading-7 text-muted-foreground">
							EchoGPT keeps the interaction focused: a model choice, a clear
							thread, and a way to carry the work forward.
						</p>
					</div>
					<div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
						{features.map((feature, index) => {
							const Icon = featureIcons[index] ?? Sparkles;
							return (
								<Card
									className="border-border/80 bg-surface/80"
									key={feature.title}
								>
									<CardContent className="p-5">
										<span
											className="mb-8 grid size-10 place-items-center rounded-xl bg-accent-soft text-primary"
											aria-hidden="true"
										>
											<Icon className="size-5" />
										</span>
										<h3 className="text-base font-semibold">{feature.title}</h3>
										<p className="mt-2 text-sm leading-6 text-muted-foreground">
											{feature.body}
										</p>
									</CardContent>
								</Card>
							);
						})}
					</div>
				</div>
			</section>

			<section className="page-shell" aria-labelledby="preview-title">
				<div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:items-center">
					<div>
						<p className="eyebrow">Product preview</p>
						<h2
							id="preview-title"
							className="text-3xl font-semibold sm:text-4xl"
						>
							One workspace. Two surfaces.
						</h2>
						<p className="mt-4 max-w-md text-base leading-7 text-muted-foreground">
							Start with a focused prompt in the workspace, then see how the
							same model choice and local history translate into a compact
							extension experience.
						</p>
						<div className="mt-6 space-y-3 text-sm text-muted-foreground">
							<p className="flex items-center gap-2">
								<Zap className="size-4 text-primary" aria-hidden="true" />
								Quick actions stay close to the page.
							</p>
							<p className="flex items-center gap-2">
								<Code2 className="size-4 text-primary" aria-hidden="true" />
								Technical prompts have a dedicated surface.
							</p>
							<p className="flex items-center gap-2">
								<LockKeyhole
									className="size-4 text-primary"
									aria-hidden="true"
								/>
								The demo boundary stays visible.
							</p>
						</div>
						<Button asChild className="mt-7" variant="outline">
							<a href="/extension">
								View extension concept{" "}
								<ArrowRight className="size-4" aria-hidden="true" />
							</a>
						</Button>
					</div>
					<div className="grid gap-4 sm:grid-cols-2">
						<Card className="border-border/80 bg-foreground text-background sm:translate-y-5">
							<CardHeader>
								<div className="flex items-center justify-between">
									<Badge variant="secondary">Workspace</Badge>
									<span className="font-mono text-[0.68rem] text-background">
										01
									</span>
								</div>
								<CardTitle className="mt-5 text-2xl text-background">
									Keep the thread.
								</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-sm leading-6 text-background">
									A full-height conversation view with model history, context,
									and a composer that does not make you hunt for context.
								</p>
								<div className="mt-8 flex items-center gap-2 font-mono text-xs text-background">
									<span className="size-2 rounded-full bg-success" />
									Local state · ready
								</div>
							</CardContent>
						</Card>
						<Card className="border-border/80 bg-primary text-primary-foreground">
							<CardHeader>
								<div className="flex items-center justify-between">
									<Badge className="bg-black/20 text-primary-foreground">
										Extension
									</Badge>
									<span className="font-mono text-[0.68rem] text-primary-foreground">
										02
									</span>
								</div>
								<CardTitle className="mt-5 text-2xl text-primary-foreground">
									Stay in context.
								</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-sm leading-6 text-primary-foreground">
									A compact popup concept for quick actions, local sessions, and
									settings without pretending to be a packaged extension.
								</p>
								<div className="mt-8 flex items-center gap-2 font-mono text-xs text-primary-foreground">
									<PanelsTopLeft className="size-3.5" />
									Browser-ready concept
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</section>

			<section className="page-shell" aria-labelledby="models-title">
				<div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
					<div>
						<p className="eyebrow">Demo catalog</p>
						<h2
							id="models-title"
							className="text-3xl font-semibold sm:text-4xl"
						>
							Four recognizable surfaces.
						</h2>
					</div>
					<p className="max-w-sm text-sm leading-6 text-muted-foreground">
						Model names are descriptive labels for this prototype. No provider
						is called and no capability claim is implied.
					</p>
				</div>
				<div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
					{modelCatalog.map((model) => (
						<Card className="border-border/80" key={model.id}>
							<CardContent className="p-5">
								<div className="flex items-start justify-between gap-3">
									<div>
										<p className="font-mono text-xs text-primary">{model.id}</p>
										<h3 className="mt-2 text-lg font-semibold">{model.name}</h3>
									</div>
									<Badge variant="outline">Available</Badge>
								</div>
								<p className="mt-4 text-sm leading-6 text-muted-foreground">
									{model.description}
								</p>
								<Separator className="my-4" />
								<p className="text-xs text-muted-foreground">
									{model.provider} · demo status
								</p>
							</CardContent>
						</Card>
					))}
				</div>
			</section>

			<section
				className="border-y border-border/70 bg-foreground text-background"
				aria-labelledby="why-title"
			>
				<div className="page-shell py-16 sm:py-20 lg:py-24">
					<div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
						<div>
							<p className="eyebrow text-background">Why EchoGPT</p>
							<h2
								id="why-title"
								className="text-3xl font-semibold text-background sm:text-4xl"
							>
								Less tab juggling. More useful comparison.
							</h2>
						</div>
						<div className="grid gap-6 sm:grid-cols-3">
							{[
								[
									"01",
									"Context continuity",
									"Switch models without losing the shape of the task.",
								],
								[
									"02",
									"One interface",
									"Carry the same mental model from workspace to popup.",
								],
								[
									"03",
									"Clear control",
									"Choose the surface and the model before you commit.",
								],
							].map(([number, title, body]) => (
								<div key={number}>
									<p className="font-mono text-sm text-background">{number}</p>
									<h3 className="mt-5 text-lg font-semibold text-background">
										{title}
									</h3>
									<p className="mt-2 text-sm leading-6 text-background">
										{body}
									</p>
								</div>
							))}
						</div>
					</div>
				</div>
			</section>

			<Pricing />
			<Faq />

			<section className="page-shell pt-0" aria-labelledby="final-title">
				<Card className="overflow-hidden border-primary/25 bg-accent-soft">
					<CardContent className="flex flex-col gap-6 p-7 sm:p-10 lg:flex-row lg:items-center lg:justify-between">
						<div>
							<p className="eyebrow">Start with a better comparison</p>
							<h2
								id="final-title"
								className="max-w-xl text-3xl font-semibold sm:text-4xl"
							>
								Open the workspace, then decide what comes next.
							</h2>
							<p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
								The seeded demo is deliberately small enough to understand in a
								minute and complete enough to explore on your own.
							</p>
						</div>
						<div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
							<Button asChild size="lg">
								<a href="/workspace">
									Open workspace{" "}
									<ArrowRight className="size-4" aria-hidden="true" />
								</a>
							</Button>
							<Button asChild size="lg" variant="outline">
								<a href={STORE_URL} target="_blank" rel="noreferrer">
									<PanelsTopLeft className="size-4" aria-hidden="true" />
									Install EchoGPT
								</a>
							</Button>
						</div>
					</CardContent>
				</Card>
			</section>
		</div>
	);
}
