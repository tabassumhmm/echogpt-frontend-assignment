"use client";

import type { LucideIcon } from "lucide-react";
import {
	Bot,
	Brain,
	Code2,
	FileText,
	Languages,
	PenLine,
	Sparkles,
	Square,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { QuickActionDefinition } from "@/lib/demo-data/extension-actions";
import { getModel, MODEL_CATALOG } from "@/lib/demo-data/models";
import {
	type ExtensionSession,
	isModelId,
	type ModelId,
	type QuickActionId,
} from "@/lib/storage/schema";

const ACTION_ICONS: Record<QuickActionId, LucideIcon> = {
	summarize: FileText,
	rewrite: PenLine,
	translate: Languages,
	"explain-code": Code2,
	brainstorm: Brain,
	"generate-image": Sparkles,
};

interface ExtensionChatProps {
	actions: readonly QuickActionDefinition[];
	enabledActionIds: readonly QuickActionId[];
	selectedActionId: QuickActionId;
	modelId: ModelId;
	pageText: string;
	session: ExtensionSession | undefined;
	isGenerating: boolean;
	keyboardShortcutsEnabled: boolean;
	onModelChange: (modelId: ModelId) => void;
	onPageTextChange: (value: string) => void;
	onRunAction: (actionId: QuickActionId) => void;
	onStop: () => void;
}

export function ExtensionChat({
	actions,
	enabledActionIds,
	selectedActionId,
	modelId,
	pageText,
	session,
	isGenerating,
	keyboardShortcutsEnabled,
	onModelChange,
	onPageTextChange,
	onRunAction,
	onStop,
}: ExtensionChatProps) {
	const lastAssistantMessage = [...(session?.messages ?? [])]
		.reverse()
		.find((message) => message.role === "assistant");
	const SelectedActionIcon = ACTION_ICONS[selectedActionId];

	return (
		<div className="extension-chat-grid">
			<section className="space-y-5" aria-label="Extension chat controls">
				<div className="flex flex-wrap items-start justify-between gap-3">
					<div>
						<Badge variant="secondary">
							<Bot aria-hidden="true" />
							Local extension
						</Badge>
						<h2 className="mt-3 text-xl font-semibold tracking-tight">
							Run an action on the page
						</h2>
						<p className="mt-1 text-sm text-muted-foreground">
							Selected page text stays in this tab and is never stored.
						</p>
					</div>
					<Select
						value={modelId}
						onValueChange={(value) => {
							if (isModelId(value)) onModelChange(value);
						}}
					>
						<SelectTrigger
							className="w-full min-w-44"
							aria-label="Extension model"
						>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{MODEL_CATALOG.map((model) => (
								<SelectItem key={model.id} value={model.id}>
									{model.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				<fieldset className="grid gap-2 sm:grid-cols-2">
					<legend className="sr-only">Quick actions</legend>
					{actions.map((action) => {
						const Icon = ACTION_ICONS[action.id];
						const enabled = enabledActionIds.includes(action.id);
						return (
							<Button
								key={action.id}
								type="button"
								variant={selectedActionId === action.id ? "default" : "outline"}
								disabled={!enabled || isGenerating}
								onClick={() => onRunAction(action.id)}
								aria-label={action.label}
								className="min-h-11 justify-start text-left"
							>
								<Icon aria-hidden="true" />
								<span>
									<span className="block">{action.label}</span>
									<span
										className={
											selectedActionId === action.id
												? "block text-xs text-primary-foreground"
												: "block text-xs text-foreground/70"
										}
									>
										{action.hint}
									</span>
								</span>
							</Button>
						);
					})}
				</fieldset>

				<form
					className="space-y-3"
					onSubmit={(event) => {
						event.preventDefault();
						const action = actions.find((item) => item.id === selectedActionId);
						if (action && enabledActionIds.includes(action.id)) {
							onRunAction(action.id);
						}
					}}
				>
					<label htmlFor="extension-page-text" className="text-sm font-medium">
						Page text
					</label>
					<Textarea
						id="extension-page-text"
						value={pageText}
						onChange={(event) => onPageTextChange(event.target.value)}
						onKeyDown={(event) => {
							if (
								keyboardShortcutsEnabled &&
								event.key === "Enter" &&
								(event.metaKey || event.ctrlKey)
							) {
								event.preventDefault();
								event.currentTarget.form?.requestSubmit();
							}
						}}
						placeholder="Paste or type the text you want EchoGPT to use…"
						className="min-h-36 resize-y"
						disabled={isGenerating}
					/>
					<div className="flex flex-wrap items-center justify-between gap-3">
						<p className="text-xs text-muted-foreground">
							Empty text uses the action&apos;s built-in demo prompt.
						</p>
						{isGenerating ? (
							<Button type="button" variant="outline" onClick={onStop}>
								<Square aria-hidden="true" />
								Stop
							</Button>
						) : (
							<Button type="submit">
								<SelectedActionIcon aria-hidden="true" />
								Run selected action
							</Button>
						)}
					</div>
				</form>
			</section>

			<Card className="min-w-0 self-start">
				<CardHeader>
					<CardTitle>Output</CardTitle>
					<CardDescription>
						{getModel(modelId).name} · deterministic local response
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div
						aria-live="polite"
						aria-busy={isGenerating}
						className="min-h-48 whitespace-pre-wrap rounded-lg border border-border bg-muted/45 p-4 text-sm leading-6"
					>
						{lastAssistantMessage?.content ? (
							<div className="space-y-3">
								{selectedActionId === "generate-image" ? (
									<div
										role="img"
										aria-label="Demo generated image placeholder"
										className="grid min-h-32 place-items-center rounded-lg border border-primary/30 bg-accent-soft p-4 text-center"
									>
										<div>
											<Sparkles aria-hidden="true" />
											<p className="mt-2 font-medium">
												Demo generated image placeholder
											</p>
											<p className="text-xs text-muted-foreground">
												No image provider was called.
											</p>
										</div>
									</div>
								) : null}
								<p>{lastAssistantMessage.content}</p>
							</div>
						) : isGenerating ? (
							"EchoGPT is composing a local response…"
						) : (
							"Choose a quick action to see its deterministic response."
						)}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
