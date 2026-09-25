import type { Metadata } from "next";
import Link from "next/link";
import { IBM_Plex_Mono, Instrument_Sans } from "next/font/google";
import type { ReactNode } from "react";

import { ThemeScript } from "@/components/theme-script";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";
import { ThemeProvider } from "@/lib/theme";

import "./globals.css";

const instrumentSans = Instrument_Sans({
	subsets: ["latin"],
	variable: "--font-instrument",
	display: "swap",
});

const plexMono = IBM_Plex_Mono({
	subsets: ["latin"],
	weight: ["400", "500", "600", "700"],
	variable: "--font-plex-mono",
	display: "swap",
});

export const metadata: Metadata = {
	title: {
		default: "EchoGPT — One prompt, every model",
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
				className={`${instrumentSans.variable} ${plexMono.variable} min-h-screen antialiased`}
			>
				<ThemeProvider>
					<a className="skip-link" href="#main-content">
						Skip to content
					</a>
					<header className="border-b border-border/70 bg-background/90 backdrop-blur">
						<div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
							<Link
								className="group inline-flex items-center gap-2.5 font-semibold tracking-[-0.02em]"
								href="/"
								aria-label="EchoGPT home"
							>
								<span
									className="grid size-8 place-items-center rounded-[0.65rem] bg-primary text-primary-foreground shadow-sm transition-transform group-hover:-rotate-6"
									aria-hidden="true"
								>
									<span className="size-2.5 rounded-full bg-primary-foreground" />
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
					<footer className="border-t border-border/70 bg-surface/60">
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
