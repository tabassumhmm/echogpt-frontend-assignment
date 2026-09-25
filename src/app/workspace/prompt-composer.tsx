import { CornerDownLeft, Paperclip, Sparkles, Square, X } from "lucide-react";
import { useRef } from "react";
import type { KeyboardEvent } from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { getModel } from "@/lib/demo-data/models";
import {
	type AttachmentMetadata,
	MAX_ATTACHMENTS_PER_MESSAGE,
	type ModelId,
	type SuggestedPrompt,
} from "@/lib/storage/schema";
import { createAttachmentMetadata } from "@/lib/workspace-actions";

interface PromptComposerProps {
	modelId: ModelId;
	prompt: string;
	attachments: AttachmentMetadata[];
	isGenerating: boolean;
	suggestions: readonly SuggestedPrompt[];
	onPromptChange: (value: string) => void;
	onAttachmentsChange: (attachments: AttachmentMetadata[]) => void;
	onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
	onStop: () => void;
	onSuggestion: (prompt: string) => void;
}

function formatFileSize(size: number): string {
	if (size < 1024) return `${size} B`;
	if (size < 1024 * 1024) return `${Math.round(size / 1024)} KB`;
	return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

export function PromptComposer({
	modelId,
	prompt,
	attachments,
	isGenerating,
	suggestions,
	onPromptChange,
	onAttachmentsChange,
	onSubmit,
	onStop,
	onSuggestion,
}: PromptComposerProps) {
	const model = getModel(modelId);
	const attachmentInputRef = useRef<HTMLInputElement>(null);
	const promptInputRef = useRef<HTMLTextAreaElement>(null);

	function handleSuggestion(value: string) {
		onSuggestion(value);
		window.setTimeout(() => promptInputRef.current?.focus(), 0);
	}

	function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
		if (
			event.key !== "Enter" ||
			event.shiftKey ||
			event.nativeEvent.isComposing
		) {
			return;
		}
		event.preventDefault();
		event.currentTarget.form?.requestSubmit();
	}

	function addFiles(files: FileList | null) {
		if (!files || files.length === 0) return;
		const nextAttachments = [
			...attachments,
			...Array.from(files).map((file) => createAttachmentMetadata(file)),
		].slice(0, MAX_ATTACHMENTS_PER_MESSAGE);
		onAttachmentsChange(nextAttachments);
	}

	return (
		<form
			className="rounded-2xl border border-border/70 bg-card p-4 shadow-sm md:p-5"
			onSubmit={onSubmit}
		>
			<div className="flex flex-wrap items-start justify-between gap-3">
				<div>
					<p className="eyebrow">Message {model.name}</p>
					<label
						htmlFor="workspace-prompt"
						className="mt-1 block text-sm font-medium"
					>
						What would you like to work through?
					</label>
				</div>
				<span className="text-xs text-muted-foreground">
					Local demo · no provider call
				</span>
			</div>
			<Textarea
				ref={promptInputRef}
				id="workspace-prompt"
				className="mt-3 min-h-32 resize-y"
				rows={5}
				maxLength={20_000}
				placeholder="Ask for a draft, critique, comparison, or next step…"
				value={prompt}
				onChange={(event) => onPromptChange(event.currentTarget.value)}
				onKeyDown={handleKeyDown}
				disabled={isGenerating}
			/>
			{attachments.length > 0 ? (
				<fieldset
					className="mt-3 flex min-w-0 flex-wrap gap-2 border-0 p-0"
					aria-label="Attachment metadata"
				>
					{attachments.map((attachment) => (
						<span
							key={attachment.id}
							className="inline-flex max-w-full items-center gap-1.5 rounded-lg border border-border/70 bg-muted/50 px-2 py-1 text-xs text-muted-foreground"
						>
							<Paperclip className="size-3 shrink-0" aria-hidden="true" />
							<span className="max-w-48 truncate">{attachment.name}</span>
							<span className="shrink-0">
								{formatFileSize(attachment.size)}
							</span>
							<button
								type="button"
								className="rounded p-0.5 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
								onClick={() =>
									onAttachmentsChange(
										attachments.filter((item) => item.id !== attachment.id),
									)
								}
								aria-label={`Remove ${attachment.name}`}
								disabled={isGenerating}
							>
								<X aria-hidden="true" />
							</button>
						</span>
					))}
				</fieldset>
			) : null}
			<div className="mt-3 flex flex-wrap items-center justify-between gap-3">
				<div className="flex flex-wrap items-center gap-2">
					<input
						ref={attachmentInputRef}
						className="sr-only"
						type="file"
						multiple
						onChange={(event) => {
							addFiles(event.currentTarget.files);
							event.currentTarget.value = "";
						}}
						tabIndex={-1}
						aria-hidden="true"
					/>
					<Button
						type="button"
						variant="outline"
						size="xs"
						onClick={() => attachmentInputRef.current?.click()}
						disabled={
							isGenerating || attachments.length >= MAX_ATTACHMENTS_PER_MESSAGE
						}
					>
						<Paperclip data-icon="inline-start" />
						Attach metadata
					</Button>
					<fieldset
						className="flex min-w-0 flex-wrap gap-2 border-0 p-0"
						aria-label="Suggested prompts"
					>
						{suggestions.map((suggestion) => (
							<Button
								key={suggestion.id}
								type="button"
								variant="outline"
								size="xs"
								onClick={() => handleSuggestion(suggestion.prompt)}
								disabled={isGenerating}
							>
								<Sparkles data-icon="inline-start" />
								{suggestion.label}
							</Button>
						))}
					</fieldset>
				</div>
				<div className="flex items-center gap-2">
					{isGenerating ? (
						<Button
							type="button"
							variant="destructive"
							size="sm"
							onClick={onStop}
							aria-label="Stop generating"
						>
							<Square data-icon="inline-start" />
							Stop
						</Button>
					) : null}
					<Button
						type="submit"
						size="sm"
						disabled={isGenerating || prompt.trim().length === 0}
					>
						Send
						<CornerDownLeft data-icon="inline-end" />
					</Button>
				</div>
			</div>
			<p className="mt-2 text-[0.68rem] text-muted-foreground">
				Only file names, types, and sizes are kept locally; file contents are
				never read or uploaded.
			</p>
		</form>
	);
}
