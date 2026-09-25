import { Download, FileUp, RotateCcw, Save } from "lucide-react";
import { useRef } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export type WorkspaceNotice = {
	tone: "success" | "error" | "info";
	message: string;
};

interface WorkspaceHeaderProps {
	hydrated: boolean;
	disabled: boolean;
	onImportFile: (file: File) => void;
	onExport: () => void;
	onReset: () => void;
}

export function WorkspaceHeader({
	hydrated,
	disabled,
	onImportFile,
	onExport,
	onReset,
}: WorkspaceHeaderProps) {
	const fileInputRef = useRef<HTMLInputElement>(null);

	return (
		<header className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
			<div className="max-w-2xl">
				<div className="flex flex-wrap items-center gap-2">
					<p className="eyebrow">Local workspace</p>
					<Badge variant="outline">
						{hydrated ? "Saved in browser" : "Loading"}
					</Badge>
				</div>
				<h1 className="mt-3 font-heading text-3xl font-semibold tracking-tight md:text-4xl">
					Compare models without losing context.
				</h1>
				<p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
					Each model keeps its own history while shared settings stay in sync.
					Every response is deterministic and local.
				</p>
			</div>
			<div className="flex flex-wrap items-center gap-2">
				<input
					ref={fileInputRef}
					className="sr-only"
					type="file"
					accept="application/json,.json"
					onChange={(event) => {
						const file = event.currentTarget.files?.item(0);
						event.currentTarget.value = "";
						if (file) onImportFile(file);
					}}
					tabIndex={-1}
					aria-hidden="true"
				/>
				<Button
					type="button"
					variant="outline"
					onClick={() => fileInputRef.current?.click()}
					disabled={disabled}
				>
					<FileUp data-icon="inline-start" />
					Import
				</Button>
				<Button
					type="button"
					variant="outline"
					onClick={onExport}
					disabled={disabled}
				>
					<Download data-icon="inline-start" />
					Export
				</Button>
				<Button
					type="button"
					variant="destructive"
					onClick={onReset}
					disabled={disabled}
				>
					<RotateCcw data-icon="inline-start" />
					Reset
				</Button>
			</div>
		</header>
	);
}

export function WorkspaceNotice({
	notice,
}: {
	notice: WorkspaceNotice | null;
}) {
	if (!notice) return null;
	return (
		<Card
			className={
				notice.tone === "error"
					? "border-destructive/40 bg-destructive/5"
					: "border-primary/25 bg-primary/5"
			}
		>
			<CardContent
				className="flex items-center gap-2 p-3 text-sm"
				role={notice.tone === "error" ? "alert" : "status"}
			>
				{notice.tone === "success" ? (
					<Save className="size-4 text-primary" aria-hidden="true" />
				) : null}
				{notice.message}
			</CardContent>
		</Card>
	);
}
