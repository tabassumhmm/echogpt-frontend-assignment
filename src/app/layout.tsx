import localFont from "next/font/local";
import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

import { ThemeScript } from "@/components/theme-script";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";
import { ThemeProvider } from "@/lib/theme";

import "./globals.css";

const bricolage = localFont({
	src: "./fonts/bricolage-grotesque-latin.woff2",
	weight: "200 800",
	style: "normal",
	variable: "--font-display",
	display: "swap",
});

const hanken = localFont({
	src: "./fonts/hanken-grotesk-latin.woff2",
	weight: "100 900",
	style: "normal",
	variable: "--font-hanken",
	display: "swap",
});

const martianMono = localFont({
	src: "./fonts/martian-mono-latin.woff2",
	weight: "100 800",
	style: "normal",
	variable: "--font-martian",
	display: "swap",
});

export const metadata: Metadata = {
	title: {
		default: "EchoGPT: one prompt, every model",
		template: "%s · EchoGPT",
	},
	description:
		"A qualified, local-first EchoGPT demo for comparing model behavior, keeping separate histories, and trying a browser extension concept.",
};

export default function RootLayout({
	children,
}: Readonly<{ children: ReactNode }>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<ThemeScript />
			</head>
			<body
				className={`${bricolage.variable} ${hanken.variable} ${martianMono.variable} min-h-screen antialiased`}
			>
				<ThemeProvider>
					<a className="skip-link" href="#main-content">
						Skip to content
					</a>
					<header className="border-b-[3px] border-border-strong bg-background">
						<div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
							<Link
								className="group inline-flex items-center gap-2.5 font-heading font-bold tracking-[-0.02em]"
								href="/"
								aria-label="EchoGPT home"
							>
								<span
									className="grid size-8 place-items-center border-2 border-border-strong bg-primary text-primary-foreground"
									aria-hidden="true"
								>
									<span className="size-2.5 bg-primary-foreground" />
								</span>
								<span>EchoGPT</span>
							</Link>
							<div className="flex items-center gap-1.5 sm:gap-3">
								<nav
									className="hidden items-center gap-1 sm:flex"
									aria-label="Primary navigation"
								>
									<Button asChild variant="ghost" size="sm">
										<Link href="/workspace">Workspace</Link>
									</Button>
									<Button asChild variant="ghost" size="sm">
										<Link href="/extension">Extension</Link>
									</Button>
								</nav>
								<ThemeToggle />
							</div>
						</div>
					</header>
					<main id="main-content" tabIndex={-1}>
						{children}
					</main>
					<footer className="border-t-[3px] border-border-strong bg-background">
						<div className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
							<p
								className="select-none text-center text-[clamp(3.5rem,10vw,9rem)] leading-[0.9] font-bold tracking-[-0.025em] text-transparent"
								style={{ WebkitTextStroke: "1px var(--color-border-strong)" }}
								aria-hidden="true"
							>
								ECHOGPT
							</p>
						</div>
						<div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
							<span>Local-first concept · No account required</span>
							<span>Responses are deterministic demonstrations.</span>
						</div>
					</footer>
				</ThemeProvider>
			</body>
		</html>
	);
}
