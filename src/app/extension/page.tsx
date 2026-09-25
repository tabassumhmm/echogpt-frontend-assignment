import type { Metadata } from "next";

import { ExtensionSimulator } from "./extension-simulator";

export const metadata: Metadata = {
	title: "Extension Simulator",
	description:
		"A local-first concept for an EchoGPT page-assistance extension.",
};

export default function ExtensionPage() {
	return <ExtensionSimulator />;
}
