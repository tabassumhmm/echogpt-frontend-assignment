import type { Metadata } from "next";

import { WorkspaceApp } from "./workspace-app";

export const metadata: Metadata = {
	title: "Workspace",
	description:
		"A local-first EchoGPT writing workspace with separate model histories.",
};

export default function WorkspacePage() {
	return <WorkspaceApp />;
}
