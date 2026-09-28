import {
	ArrowRight,
	Code,
	ClockCounterClockwise,
	Stack,
	Lock,
	Browser,
	Asterisk,
	MagicWand,
	Lightning,
} from "@phosphor-icons/react/dist/ssr";
import type { Metadata } from "next";
import Link from "next/link";
import { Faq, Pricing } from "@/components/marketing/landing-interactions";
import { ProductPreview } from "@/components/marketing/product-preview";
import { Reveal } from "@/components/motion/reveal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { features, modelCatalog, STORE_URL } from "@/lib/demo-data/site-copy";

export const metadata: Metadata = {
	title: "One prompt, every model",
	description:
		"Explore EchoGPT, a qualified local-first demo for comparing model behavior and trying a browser extension concept.",
};

const featureIcons = [Stack, MagicWand, ClockCounterClockwise, Lock] as const;

export default function HomePage() {
	return (
		<div className="overflow-hidden">
			<section
				className="page-shell pb-16 pt-12 sm:pb-24 sm:pt-16 lg:pb-28 lg:pt-24"
				aria-labelledby="hero-title"
			>
				<div className="grid items-center gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
					<div className="max-w-2xl">
						<h1
							id="hero-title"
							className="rise-in max-w-[12ch] text-5xl leading-[0.95] tracking-[-0.03em] sm:text-6xl lg:text-7xl"
						>
							One prompt,{" "}
							<em className="text-accent-strong not-italic">every model.</em>
						</h1>
						<p className="rise-in mt-6 max-w-xl text-lg leading-8 text-muted-foreground [animation-delay:80ms] sm:text-xl">
							A calmer way to compare model behavior, keep separate histories,
							and move between surfaces without starting over.
						</p>
						<div className="rise-in mt-8 w-fit [animation-delay:160ms]">
							<div className="flex flex-col gap-3 sm:flex-row">
								<Button
									asChild
									size="lg"
									className="outline-2 outline-offset-3 outline-border-strong sm:flex-1"
								>
									<a href={STORE_URL} target="_blank" rel="noreferrer">
										<Browser className="size-4" aria-hidden="true" />
										Install EchoGPT
									</a>
								</Button>
								<Button
									asChild
									size="lg"
									variant="outline"
									className="sm:flex-1"
								>
									<Link href="/workspace">
										Explore the workspace
										<ArrowRight className="size-4" aria-hidden="true" />
									</Link>
								</Button>
							</div>
							<p className="micro mt-7 tracking-[0.06em] text-muted-foreground">
								No sign-in · No live AI calls · Local JSON export
							</p>
						</div>
					</div>
					<Reveal>
						<ProductPreview />
					</Reveal>
				</div>
			</section>

			<section
				className="border-y-[3px] border-border-strong"
				aria-labelledby="features-title"
			>
				<div className="page-shell py-16 sm:py-20 lg:py-24">
					<div className="max-w-2xl">
						<h2 id="features-title" className="text-4xl sm:text-5xl">
							The useful parts stay close.
						</h2>
						<p className="mt-4 text-base leading-7 text-muted-foreground">
							EchoGPT keeps the interaction focused: a model choice, a clear
							thread, and a way to carry the work forward.
						</p>
					</div>
					<div className="mt-10 grid border-2 border-border-strong bg-surface lg:grid-cols-4">
						{features.map((feature, index) => {
							const Icon = featureIcons[index] ?? Asterisk;
							return (
								<Reveal
									className="flex flex-col border-t-[3px] border-border-strong p-6 transition-colors duration-200 first:border-t-0 hover:bg-accent-soft/50 lg:border-t-0 lg:border-l-[3px] lg:first:border-l-0"
									key={feature.title}
								>
									<span
										className="mb-6 grid size-10 place-items-center border-2 border-border-strong bg-accent-soft text-accent-strong"
										aria-hidden="true"
									>
										<Icon className="size-5" />
									</span>
									<h3 className="text-base">{feature.title}</h3>
									<p className="mt-2 text-sm leading-6 text-muted-foreground">
										{feature.body}
									</p>
								</Reveal>
							);
						})}
					</div>
				</div>
			</section>

			<section
				className="page-shell py-20 sm:py-24 lg:py-28"
				aria-labelledby="preview-title"
			>
				<div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:items-center">
					<div>
						<h2 id="preview-title" className="text-4xl sm:text-5xl">
							One workspace. Two surfaces.
						</h2>
						<p className="mt-4 max-w-md text-base leading-7 text-muted-foreground">
							Start with a focused prompt in the workspace, then see how the
							same model choice and local history translate into a compact
							extension experience.
						</p>
						<div className="mt-6 space-y-3 text-sm text-muted-foreground">
							<p className="flex items-center gap-2">
								<Lock
									className="size-4 text-accent-strong"
									aria-hidden="true"
								/>
								The demo boundary stays visible.
							</p>
							<p className="flex items-center gap-2">
								<Lightning
									className="size-4 text-accent-strong"
									aria-hidden="true"
								/>
								Quick actions stay close to the page.
							</p>
							<p className="flex items-center gap-2">
								<Code
									className="size-4 text-accent-strong"
									aria-hidden="true"
								/>
								Technical prompts have a dedicated surface.
							</p>
						</div>
						<Button asChild className="mt-7" variant="outline">
							<Link href="/extension">
								View extension concept{" "}
								<ArrowRight className="size-4" aria-hidden="true" />
							</Link>
						</Button>
					</div>
					<div className="grid gap-5 sm:grid-cols-2">
						<Card className="band-ink border-2 border-border-strong transition-transform duration-200 hover:-translate-y-1 sm:translate-y-5">
							<CardHeader>
								<div className="flex items-center justify-between">
									<span className="tag">Workspace</span>
									<span className="micro opacity-70">01</span>
								</div>
								<CardTitle className="mt-5 text-2xl">
									Keep the thread.
								</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-sm leading-6 opacity-75">
									A full-height conversation view with model history, context,
									and a composer that does not make you hunt for context.
								</p>
								<div className="micro mt-8 flex items-center gap-2">
									<span className="size-2 bg-accent" />
									Local state · ready
								</div>
							</CardContent>
						</Card>
						<Card className="border-2 border-border-strong bg-primary text-primary-foreground transition-transform duration-200 hover:-translate-y-1">
							<CardHeader>
								<div className="flex items-center justify-between">
									<span className="tag">Extension</span>
									<span className="micro text-primary-foreground">02</span>
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
								<div className="micro mt-8 flex items-center gap-2 text-primary-foreground">
									<Browser className="size-3.5" />
									Browser-ready concept
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</section>

			<section
				className="page-shell py-20 sm:py-24 lg:py-28"
				aria-labelledby="models-title"
			>
				<div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
					<div>
						<h2 id="models-title" className="text-4xl sm:text-5xl">
							Four recognizable surfaces.
						</h2>
					</div>
				</div>
				<div className="mt-10 border-t-[3px] border-border-strong">
					{modelCatalog.map((model, index) => (
						<Reveal key={model.id}>
							<article className="grid gap-2 border-b-2 border-border-strong py-6 transition-colors duration-200 hover:bg-accent-soft/50 sm:grid-cols-[110px_minmax(0,1fr)_auto] sm:items-baseline sm:gap-6">
								<p className="micro text-accent-strong">
									M·{String(index + 1).padStart(2, "0")}
								</p>
								<div>
									<h3 className="text-lg">{model.name}</h3>
									<p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
										{model.description}
									</p>
								</div>
								<p className="micro text-muted-foreground">
									{model.provider} · demo status
								</p>
							</article>
						</Reveal>
					))}
				</div>
				<p className="micro mt-6 text-muted-foreground">
					Model names are descriptive labels for this prototype. No provider is
					called and no capability claim is implied.
				</p>
			</section>

			<section
				className="band-ink border-y-[3px] border-border-strong"
				aria-labelledby="why-title"
			>
				<div className="page-shell py-16 sm:py-20 lg:py-24">
					<div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
						<h2 id="why-title" className="text-4xl sm:text-5xl">
							Less tab juggling.{" "}
							<em className="text-accent not-italic">
								More useful comparison.
							</em>
						</h2>
						<div className="divide-y-2 divide-white/15">
							{[
								[
									"Context continuity",
									"Switch models without losing the shape of the task.",
								],
								[
									"One interface",
									"Carry the same mental model from workspace to popup.",
								],
								[
									"Clear control",
									"Choose the surface and the model before you commit.",
								],
							].map(([title, body]) => (
								<Reveal className="py-6 first:pt-0 last:pb-0" key={title}>
									<h3 className="font-mono text-xl font-bold sm:text-2xl">
										{title}
									</h3>
									<p className="mt-3 text-sm leading-6 opacity-75">{body}</p>
								</Reveal>
							))}
						</div>
					</div>
				</div>
			</section>

			<Pricing />
			<Faq />

			<section
				className="page-shell py-20 sm:py-24 lg:py-28"
				aria-labelledby="testimonials-title"
			>
				<div className="mb-10">
					<h2 id="testimonials-title" className="max-w-xl text-4xl sm:text-5xl">
						Early words from the demo.
					</h2>
				</div>
				<div className="grid gap-4 sm:grid-cols-2">
					{[
						{
							quote:
								"I stopped pasting the same prompt into three tabs. One history per model means comparing answers takes a click, not a scavenger hunt.",
							name: "Maya R.",
							role: "frontend lead",
						},
						{
							quote:
								"The first thing I tried was export. One JSON file for the whole workspace, and when I broke it by hand the import told me what was wrong instead of eating the file.",
							name: "Deniz K.",
							role: "QA engineer",
						},
						{
							quote:
								"Keyboard flow is why it stays open: Ctrl and Enter, next question, no button hunting mid-thought.",
							name: "Sam O.",
							role: "indie developer",
						},
						{
							quote: "It runs offline and says so. I demo it on flights.",
							name: "Priya N.",
							role: "solutions consultant",
						},
					].map(({ quote, name, role }) => (
						<Reveal key={name}>
							<figure className="h-full border-2 border-border-strong bg-surface p-5 transition-colors duration-200 hover:bg-accent-soft/50 sm:p-6">
								<blockquote className="text-sm leading-6">
									&ldquo;{quote}&rdquo;
								</blockquote>
								<figcaption className="mt-5 flex items-center gap-3">
									<span
										className="grid size-8 shrink-0 place-items-center border-2 border-border-strong bg-accent-soft font-mono text-xs font-bold text-accent-strong"
										aria-hidden="true"
									>
										{name
											.split(" ")
											.map((part) => part[0])
											.join("")}
									</span>
									<span>
										<span className="block text-sm font-bold">{name}</span>
										<span className="micro text-muted-foreground">{role}</span>
									</span>
								</figcaption>
							</figure>
						</Reveal>
					))}
				</div>
				<p className="micro mt-6 text-muted-foreground">
					Illustrative quotes for the concept build. No live users to quote yet.
				</p>
			</section>

			<section
				className="page-shell pb-20 pt-0 sm:pb-24 lg:pb-28"
				aria-labelledby="final-title"
			>
				<Card className="overflow-hidden border-2 border-border-strong bg-surface outline-2 outline-offset-4 outline-accent-soft">
					<CardContent className="flex flex-col gap-6 p-7 sm:p-10 lg:flex-row lg:items-center lg:justify-between">
						<div>
							<h2 id="final-title" className="max-w-xl text-4xl sm:text-5xl">
								Open the workspace, then decide what comes next.
							</h2>
							<p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
								The seeded demo is deliberately small enough to understand in a
								minute and complete enough to explore on your own.
							</p>
						</div>
						<div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
							<Button
								asChild
								size="lg"
								className="outline-2 outline-offset-3 outline-border-strong"
							>
								<Link href="/workspace">
									Open workspace{" "}
									<ArrowRight className="size-4" aria-hidden="true" />
								</Link>
							</Button>
							<Button asChild size="lg" variant="outline">
								<a href={STORE_URL} target="_blank" rel="noreferrer">
									<Browser className="size-4" aria-hidden="true" />
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
