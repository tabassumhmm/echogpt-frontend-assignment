"use client";

import { type FormEvent, useEffect, useMemo, useRef, useState } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { simulateResponse } from "@/lib/ai/simulate-response";
import { workspaceSuggestedPrompts } from "@/lib/demo-data/extension-actions";
import { getModel } from "@/lib/demo-data/models";
import { resetDemoState } from "@/lib/storage/reset";
import {
	type AttachmentMetadata,
	type DemoState,
	MAX_IMPORT_BYTES,
	type ModelId,
} from "@/lib/storage/schema";
import {
	createSeedState,
	exportWorkspaceHistory,
	importWorkspaceHistory,
	loadDemoState,
	saveDemoState,
} from "@/lib/storage/storage";
import {
	addMessage,
	createAssistantMessage,
	createConversation,
	createUserMessage,
	deleteConversation,
	renameConversation,
	toggleConversationPin,
	updateMessage,
} from "@/lib/workspace-actions";
import { ConversationList } from "./conversation-list";
import { MessageList } from "./message-list";
import { PreferencesPanel } from "./preferences-panel";
import { PromptComposer } from "./prompt-composer";
import {
	DeleteConversationDialog,
	ImportReviewDialog,
	ResetDialog,
} from "./workspace-dialogs";
import {
	type WorkspaceNotice as Notice,
	WorkspaceHeader,
	WorkspaceNotice,
} from "./workspace-chrome";
import { ContextPanel, ResponseActions } from "./workspace-controls";

type PendingImport = {
	name: string;
	size: number;
	conversationCount: number;
	serialized: string;
};

function trimResponse(content: string): string {
	const firstSentence = content.split(/(?<=[.!?])\s+/)[0] ?? content;
	return `${firstSentence.trim()}…`;
}

export function WorkspaceApp() {
	const [state, setState] = useState<DemoState>(() => createSeedState());
	const [activeId, setActiveId] = useState("");
	const [modelId, setModelId] = useState<ModelId>(state.defaultModelId);
	const [prompt, setPrompt] = useState("");
	const [attachments, setAttachments] = useState<AttachmentMetadata[]>([]);
	const [notice, setNotice] = useState<Notice | null>(null);
	const [pendingImport, setPendingImport] = useState<PendingImport | null>(
		null,
	);
	const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
	const [resetOpen, setResetOpen] = useState(false);
	const [isGenerating, setIsGenerating] = useState(false);
	const [isImporting, setIsImporting] = useState(false);
	const [hydrated, setHydrated] = useState(false);
	const abortRef = useRef<AbortController | null>(null);

	useEffect(() => {
		const loaded = loadDemoState();
		const timer = window.setTimeout(() => {
			setState(loaded);
			setModelId(loaded.defaultModelId);
			setActiveId(
				loaded.workspaceConversations.find(
					(conversation) => conversation.modelId === loaded.defaultModelId,
				)?.id ?? "",
			);
			setHydrated(true);
		}, 0);
		return () => window.clearTimeout(timer);
	}, []);

	useEffect(() => {
		if (!hydrated || saveDemoState(state)) return;
		const timer = window.setTimeout(
			() =>
				setNotice({
					tone: "error",
					message: "Local changes could not be saved in this browser.",
				}),
			0,
		);
		return () => window.clearTimeout(timer);
	}, [hydrated, state]);

	useEffect(() => () => abortRef.current?.abort(), []);

	const visibleConversations = useMemo(
		() =>
			state.workspaceConversations.filter(
				(conversation) => conversation.modelId === modelId,
			),
		[modelId, state.workspaceConversations],
	);
	const activeConversation = useMemo(
		() =>
			visibleConversations.find(
				(conversation) => conversation.id === activeId,
			) ?? visibleConversations[0],
		[activeId, visibleConversations],
	);
	const lastAssistant = [...(activeConversation?.messages ?? [])]
		.reverse()
		.find((message) => message.role === "assistant");
	const latestPrompt = [...(activeConversation?.messages ?? [])]
		.reverse()
		.find((message) => message.role === "user");

	function selectConversation(id: string) {
		if (isGenerating || isImporting) return;
		setActiveId(id);
		setAttachments([]);
	}

	function handleModelChange(nextModelId: ModelId) {
		if (isGenerating || isImporting || nextModelId === modelId) return;
		const firstConversation = state.workspaceConversations.find(
			(conversation) => conversation.modelId === nextModelId,
		);
		setModelId(nextModelId);
		setState((current) => ({ ...current, defaultModelId: nextModelId }));
		setActiveId(firstConversation?.id ?? "");
		setAttachments([]);
		setNotice({
			tone: "info",
			message: `Switched to ${getModel(nextModelId).name} history.`,
		});
	}

	async function runSimulation(
		nextPrompt: string,
		conversationId: string,
		assistantId: string,
		responseModelId: ModelId,
	) {
		const controller = new AbortController();
		abortRef.current = controller;
		setIsGenerating(true);
		setNotice({
			tone: "info",
			message: "Composing a deterministic local response…",
		});
		try {
			const result = await simulateResponse(
				{ prompt: nextPrompt, modelId: responseModelId },
				controller.signal,
			);
			setState((current) =>
				updateMessage(current, conversationId, assistantId, {
					content: result.content,
					status: "complete",
				}),
			);
			setNotice({
				tone: "success",
				message: "Response added to this local history.",
			});
		} catch (error) {
			if (error instanceof DOMException && error.name === "AbortError") {
				setState((current) =>
					updateMessage(current, conversationId, assistantId, {
						content: "Response stopped before completion.",
						status: "stopped",
					}),
				);
				setNotice({
					tone: "info",
					message:
						"Generation stopped. Your prompt is still available to retry.",
				});
			} else if (error instanceof Error) {
				setNotice({
					tone: "error",
					message: "The local demo could not complete that response.",
				});
			} else {
				throw error;
			}
		} finally {
			if (abortRef.current === controller) abortRef.current = null;
			setIsGenerating(false);
		}
	}

	function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const submittedPrompt = prompt.trim();
		if (submittedPrompt.length === 0 || isGenerating || isImporting) return;

		const conversation = activeConversation ?? createConversation(modelId);
		if (!activeConversation) {
			setState((current) => ({
				...current,
				workspaceConversations: [
					...current.workspaceConversations,
					conversation,
				],
			}));
			setActiveId(conversation.id);
		}

		const userMessage = createUserMessage(
			modelId,
			submittedPrompt,
			attachments.length > 0 ? attachments : undefined,
		);
		const assistantMessage = createAssistantMessage(
			modelId,
			state.streamingEnabled ? "" : "Composing locally…",
		);
		setState((current) =>
			addMessage(
				addMessage(current, conversation.id, userMessage),
				conversation.id,
				assistantMessage,
			),
		);
		setPrompt("");
		setAttachments([]);
		void runSimulation(
			submittedPrompt,
			conversation.id,
			assistantMessage.id,
			modelId,
		);
	}

	function handleRegenerate() {
		if (!activeConversation || !lastAssistant || !latestPrompt || isGenerating)
			return;
		setState((current) =>
			updateMessage(current, activeConversation.id, lastAssistant.id, {
				content: "",
				status: "streaming",
			}),
		);
		void runSimulation(
			latestPrompt.content,
			activeConversation.id,
			lastAssistant.id,
			modelId,
		);
	}

	function handleTrim() {
		if (!activeConversation || !lastAssistant) return;
		setState((current) =>
			updateMessage(current, activeConversation.id, lastAssistant.id, {
				content: trimResponse(lastAssistant.content),
				status: "stopped",
			}),
		);
		setNotice({ tone: "info", message: "Latest response trimmed." });
	}

	async function handleCopy() {
		if (!lastAssistant) return;
		try {
			await navigator.clipboard.writeText(lastAssistant.content);
			setNotice({ tone: "success", message: "Copied the latest response." });
		} catch (error) {
			if (error instanceof DOMException || error instanceof Error) {
				setNotice({
					tone: "error",
					message: "Clipboard access is unavailable in this browser.",
				});
				return;
			}
			throw error;
		}
	}

	function handleNewConversation() {
		if (isGenerating || isImporting) return;
		const conversation = createConversation(modelId);
		setState((current) => ({
			...current,
			workspaceConversations: [...current.workspaceConversations, conversation],
		}));
		setActiveId(conversation.id);
		setPrompt("");
		setAttachments([]);
		setNotice({
			tone: "info",
			message: `New ${getModel(modelId).name} conversation created.`,
		});
	}

	function handleRename(conversationId: string, title: string) {
		if (title.trim().length === 0) return;
		setState((current) => renameConversation(current, conversationId, title));
		setNotice({ tone: "success", message: "Conversation name updated." });
	}

	function handleTogglePin(conversationId: string) {
		setState((current) => toggleConversationPin(current, conversationId));
	}

	function handleDelete(conversationId: string) {
		if (isGenerating || isImporting) return;
		const conversation = state.workspaceConversations.find(
			(item) => item.id === conversationId,
		);
		if (!conversation) return;
		setPendingDeleteId(conversationId);
		setNotice({
			tone: "info",
			message: "Review the deletion before removing this conversation.",
		});
	}

	function handleConfirmDelete() {
		if (!pendingDeleteId) return;
		const conversation = state.workspaceConversations.find(
			(item) => item.id === pendingDeleteId,
		);
		if (!conversation) {
			setPendingDeleteId(null);
			return;
		}

		const nextState = deleteConversation(state, pendingDeleteId);
		const remainingForModel = nextState.workspaceConversations.filter(
			(item) => item.modelId === conversation.modelId,
		);
		if (remainingForModel.length === 0) {
			const replacement = createConversation(conversation.modelId);
			setState({
				...nextState,
				workspaceConversations: [
					...nextState.workspaceConversations,
					replacement,
				],
			});
			setActiveId(replacement.id);
		} else {
			if (activeId === pendingDeleteId) {
				setActiveId(remainingForModel[0]?.id ?? "");
			}
			setState(nextState);
		}
		setPendingDeleteId(null);
		setNotice({
			tone: "success",
			message: "Conversation deleted from this browser.",
		});
	}

	function handleCancelDelete() {
		setPendingDeleteId(null);
	}

	function handleReset() {
		if (isGenerating || isImporting) return;
		setResetOpen(true);
	}

	function handleConfirmReset() {
		abortRef.current?.abort();
		const next = resetDemoState();
		setState(next);
		setModelId(next.defaultModelId);
		setActiveId(
			next.workspaceConversations.find(
				(conversation) => conversation.modelId === next.defaultModelId,
			)?.id ?? "",
		);
		setPrompt("");
		setAttachments([]);
		setPendingImport(null);
		setPendingDeleteId(null);
		setResetOpen(false);
		setNotice({ tone: "success", message: "Local demo state reset." });
	}

	function handleCancelReset() {
		setResetOpen(false);
	}

	function handleExport() {
		const blob = new Blob([exportWorkspaceHistory(state)], {
			type: "application/json",
		});
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = "echogpt-workspace-history.json";
		document.body.append(link);
		link.click();
		link.remove();
		URL.revokeObjectURL(url);
		setNotice({ tone: "success", message: "Workspace history exported." });
	}

	async function handleImportFile(file: File) {
		if (file.size > MAX_IMPORT_BYTES) {
			setNotice({
				tone: "error",
				message: "That file is too large to import safely.",
			});
			return;
		}
		setNotice({ tone: "info", message: `Reading ${file.name} locally…` });
		try {
			const serialized = await file.text();
			const preview = importWorkspaceHistory(serialized, state);
			setPendingImport({
				name: file.name,
				size: file.size,
				conversationCount: preview.workspaceConversations.length,
				serialized,
			});
			setNotice({
				tone: "info",
				message: "Review the local history file before importing.",
			});
		} catch (error) {
			setNotice({
				tone: "error",
				message:
					error instanceof Error ? error.message : "Could not read that file.",
			});
		}
	}

	async function handleConfirmImport() {
		if (!pendingImport || isImporting) return;
		setIsImporting(true);
		setNotice({
			tone: "info",
			message: "Validating and applying local history…",
		});
		await new Promise<void>((resolve) => window.setTimeout(resolve, 0));
		try {
			const imported = importWorkspaceHistory(pendingImport.serialized, state);
			setState(imported);
			setModelId(imported.defaultModelId);
			setActiveId(
				imported.workspaceConversations.find(
					(conversation) => conversation.modelId === imported.defaultModelId,
				)?.id ?? "",
			);
			setAttachments([]);
			setPendingImport(null);
			setNotice({ tone: "success", message: "Workspace history imported." });
		} catch (error) {
			setNotice({
				tone: "error",
				message:
					error instanceof Error
						? error.message
						: "Invalid workspace history file.",
			});
		} finally {
			setIsImporting(false);
		}
	}

	function handleCancelImport() {
		if (isImporting) return;
		setPendingImport(null);
		setNotice({
			tone: "info",
			message: "Import canceled; current history is unchanged.",
		});
	}

	return (
		<div
			className="page-shell space-y-5"
			aria-busy={isGenerating || isImporting}
		>
			<WorkspaceHeader
				hydrated={hydrated}
				disabled={isGenerating || isImporting}
				onImportFile={(file) => void handleImportFile(file)}
				onExport={handleExport}
				onReset={handleReset}
			/>
			<WorkspaceNotice notice={notice} />
			{pendingImport ? (
				<ImportReviewDialog
					open
					fileName={pendingImport.name}
					fileSize={pendingImport.size}
					conversationCount={pendingImport.conversationCount}
					isImporting={isImporting}
					onConfirm={() => void handleConfirmImport()}
					onCancel={handleCancelImport}
				/>
			) : null}
			{pendingDeleteId ? (
				<DeleteConversationDialog
					open
					title={
						state.workspaceConversations.find(
							(item) => item.id === pendingDeleteId,
						)?.title ?? "this conversation"
					}
					onConfirm={handleConfirmDelete}
					onCancel={handleCancelDelete}
				/>
			) : null}
			<ResetDialog
				open={resetOpen}
				onConfirm={handleConfirmReset}
				onCancel={handleCancelReset}
			/>
			<div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
				<div className="min-w-0 space-y-5">
					<ConversationList
						conversations={visibleConversations}
						activeId={activeConversation?.id ?? ""}
						disabled={isGenerating || isImporting}
						onSelect={selectConversation}
						onCreate={handleNewConversation}
						onRename={handleRename}
						onTogglePin={handleTogglePin}
						onDelete={handleDelete}
					/>
					{activeConversation ? (
						<MessageList
							modelId={modelId}
							items={activeConversation.messages}
							compact={state.compactMode}
						/>
					) : (
						<Card>
							<CardContent>
								{visibleConversations.length === 0
									? "No histories for this model yet. Send a prompt to start one."
									: "No conversation selected."}
							</CardContent>
						</Card>
					)}
					<ResponseActions
						canAct={Boolean(lastAssistant) && !isGenerating}
						isGenerating={isGenerating}
						onCopy={() => void handleCopy()}
						onRegenerate={handleRegenerate}
						onTrim={handleTrim}
						onStop={() => abortRef.current?.abort()}
					/>
					<PromptComposer
						modelId={modelId}
						prompt={prompt}
						attachments={attachments}
						isGenerating={isGenerating || isImporting}
						suggestions={workspaceSuggestedPrompts}
						onPromptChange={setPrompt}
						onAttachmentsChange={setAttachments}
						onSubmit={handleSubmit}
						onStop={() => abortRef.current?.abort()}
						onSuggestion={setPrompt}
					/>
				</div>
				<aside className="space-y-5 lg:sticky lg:top-5 lg:self-start">
					<ContextPanel
						modelId={modelId}
						conversation={activeConversation}
						disabled={isGenerating || isImporting}
						onChange={handleModelChange}
					/>
					<PreferencesPanel
						streamingEnabled={state.streamingEnabled}
						compactMode={state.compactMode}
						keyboardShortcutsEnabled={state.keyboardShortcutsEnabled}
						onStreamingChange={(value) =>
							setState((current) => ({ ...current, streamingEnabled: value }))
						}
						onCompactChange={(value) =>
							setState((current) => ({ ...current, compactMode: value }))
						}
						onKeyboardShortcutsChange={(value) =>
							setState((current) => ({
								...current,
								keyboardShortcutsEnabled: value,
							}))
						}
					/>
				</aside>
			</div>
		</div>
	);
}
