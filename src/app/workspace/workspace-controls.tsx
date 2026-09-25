import {
	ChevronDown,
	Copy,
	Info,
	RefreshCw,
	Scissors,
	Square,
} from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { getModel, MODEL_CATALOG } from "@/lib/demo-data/models";
import {
	type Conversation,
	isModelId,
	type ModelId,
} from "@/lib/storage/schema";

interface ModelSwitcherProps {
	value: ModelId;
	disabled: boolean;
	onChange: (modelId: ModelId) => void;
}

export function ModelSwitcher({
	value,
	disabled,
	onChange,
}: ModelSwitcherProps) {
	const activeModel = getModel(value);
	return (
		<div className="flex flex-col gap-3 rounded-2xl border border-border/70 bg-card/70 p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
			<div className="min-w-0">
				<p className="eyebrow">Active model</p>
				<p className="mt-1 truncate text-sm text-muted-foreground">
					{activeModel.description}
				</p>
			</div>
			<Select
				value={value}
				disabled={disabled}
				onValueChange={(nextValue) => {
					if (isModelId(nextValue)) onChange(nextValue);
				}}
			>
				<SelectTrigger
					className="w-full sm:w-56"
					aria-label="Choose active model"
				>
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					{MODEL_CATALOG.map((model) => (
						<SelectItem key={model.id} value={model.id}>
							{model.name} · {model.provider}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	);
}

interface ContextPanelProps {
	modelId: ModelId;
	conversation: Conversation | undefined;
	disabled: boolean;
	onChange: (modelId: ModelId) => void;
}

export function ContextPanel({
	modelId,
	conversation,
	disabled,
	onChange,
}: ContextPanelProps) {
	const [isOpen, setIsOpen] = useState(true);
	const activeModel = getModel(modelId);
	const attachmentCount =
		conversation?.messages.reduce(
			(count, message) => count + (message.attachments?.length ?? 0),
			0,
		) ?? 0;

	return (
		<aside className="rounded-2xl border border-border/70 bg-card/70 shadow-sm">
			<div className="flex items-start justify-between gap-3 p-4">
				<div className="min-w-0">
					<p className="eyebrow">Context</p>
					<h2 className="mt-1 truncate text-sm font-semibold">
						{conversation?.title ?? "No conversation selected"}
					</h2>
				</div>
				<Button
					type="button"
					variant="ghost"
					size="icon-sm"
					aria-label={
						isOpen ? "Collapse context panel" : "Expand context panel"
					}
					aria-expanded={isOpen}
					aria-controls="workspace-context-panel"
					onClick={() => setIsOpen((open) => !open)}
				>
					<ChevronDown
						className={isOpen ? "" : "rotate-180"}
						aria-hidden="true"
					/>
				</Button>
			</div>
			{isOpen ? (
				<div
					id="workspace-context-panel"
					className="space-y-4 border-t border-border/60 p-4"
				>
					<div>
						<p className="eyebrow">Active model</p>
						<p className="mt-1 text-sm font-medium">{activeModel.name}</p>
						<p className="mt-0.5 text-xs text-muted-foreground">
							{activeModel.provider} · {activeModel.status}
						</p>
					</div>
					<div>
						<p className="eyebrow">Attachment metadata</p>
						<p className="mt-1 text-sm text-muted-foreground">
							{attachmentCount === 0
								? "No attachments in this conversation."
								: `${attachmentCount} local attachment${attachmentCount === 1 ? "" : "s"}`}
						</p>
					</div>
					<div className="flex gap-2 rounded-xl bg-muted/50 p-3 text-xs leading-relaxed text-muted-foreground">
						<Info className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
						<p>
							Each model keeps its own history in the local demo. Switching
							models changes the active thread.
						</p>
					</div>
					<Select
						value={modelId}
						disabled={disabled}
						onValueChange={(nextValue) => {
							if (isModelId(nextValue)) onChange(nextValue);
						}}
					>
						<SelectTrigger className="w-full" aria-label="Choose active model">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{MODEL_CATALOG.map((model) => (
								<SelectItem key={model.id} value={model.id}>
									{model.name} · {model.provider}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			) : null}
		</aside>
	);
}

interface ResponseActionsProps {
	canAct: boolean;
	onCopy: () => void;
	onRegenerate: () => void;
	onStop: () => void;
	onTrim: () => void;
	isGenerating: boolean;
}

export function ResponseActions({
	canAct,
	onCopy,
	onRegenerate,
	onStop,
	onTrim,
	isGenerating,
}: ResponseActionsProps) {
	return (
		<fieldset
			className="flex flex-wrap items-center gap-2 border-0 p-0"
			aria-label="Latest response actions"
		>
			<Button
				type="button"
				variant="outline"
				size="sm"
				onClick={onCopy}
				disabled={!canAct}
			>
				<Copy data-icon="inline-start" />
				Copy
			</Button>
			<Button
				type="button"
				variant="outline"
				size="sm"
				onClick={onRegenerate}
				disabled={!canAct}
			>
				<RefreshCw data-icon="inline-start" />
				Regenerate
			</Button>
			<Button
				type="button"
				variant="ghost"
				size="sm"
				onClick={onTrim}
				disabled={!canAct}
			>
				<Scissors data-icon="inline-start" />
				Trim output
			</Button>
			<Button
				type="button"
				variant="destructive"
				size="sm"
				onClick={onStop}
				disabled={!isGenerating}
			>
				<Square data-icon="inline-start" />
				Stop
			</Button>
		</fieldset>
	);
}
