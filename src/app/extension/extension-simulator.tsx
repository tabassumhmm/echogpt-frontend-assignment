"use client";

import { useEffect, useRef, useState } from "react";
import { History, MessageSquareText, Settings2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { simulateResponse } from "@/lib/ai/simulate-response";
import {
	quickActions,
	type QuickActionDefinition,
} from "@/lib/demo-data/extension-actions";
import { resetDemoState } from "@/lib/storage/reset";
import {
	QUICK_ACTION_IDS,
	type DemoState,
	type ModelId,
	type QuickActionId,
} from "@/lib/storage/schema";
import {
	createSeedState,
	loadDemoState,
	saveDemoState,
} from "@/lib/storage/storage";
import { ExtensionChat } from "./extension-chat";
import { ExtensionConfirmDialog } from "./extension-dialogs";
import { ExtensionHistory } from "./extension-history";
import { ExtensionSettings } from "./extension-settings";
import {
	addExtensionMessages,
	createExtensionSession,
	createExtensionTurn,
	updateExtensionMessage,
} from "./extension-state";

export type ExtensionTab = "chat" | "history" | "settings";
type ConfirmAction = "clear" | "reset" | null;
type SettingKey =
	| "defaultModelId"
	| "streamingEnabled"
	| "compactMode"
	| "keyboardShortcutsEnabled";
type ExtensionSettingsValues = Pick<DemoState, SettingKey>;

const ACTIONS_BY_ID = new Map<QuickActionId, QuickActionDefinition>(
	quickActions.map((action) => [action.id, action]),
);

export function ExtensionSimulator() {
	const [state, setState] = useState<DemoState>(() => createSeedState());
	const [hydrated, setHydrated] = useState(false);
	const [activeTab, setActiveTab] = useState<ExtensionTab>("chat");
	const [selectedActionId, setSelectedActionId] =
		useState<QuickActionId>("summarize");
	const [modelId, setModelId] = useState<ModelId>(state.defaultModelId);
	const [pageText, setPageText] = useState("");
	const [isGenerating, setIsGenerating] = useState(false);
	const [notice, setNotice] = useState("");
	const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null);
	const abortRef = useRef<AbortController | null>(null);

	useEffect(() => {
		const timer = window.setTimeout(() => {
			const loaded = loadDemoState();
			setState(loaded);
			setModelId(loaded.defaultModelId);
			setHydrated(true);
		}, 0);
		return () => window.clearTimeout(timer);
	}, []);

	useEffect(() => {
		if (!hydrated || saveDemoState(state)) return;
		const timer = window.setTimeout(
			() => setNotice("Local changes could not be saved in this browser."),
			0,
		);
		return () => window.clearTimeout(timer);
	}, [hydrated, state]);

	const selectedSession = state.extensionSessions.find(
		(session) => session.actionId === selectedActionId,
	);

	function selectModel(nextModelId: ModelId) {
		setModelId(nextModelId);
		setState((current) => ({ ...current, defaultModelId: nextModelId }));
	}

	function changeSetting<Key extends SettingKey>(
		key: Key,
		value: ExtensionSettingsValues[Key],
	) {
		setState((current) => ({ ...current, [key]: value }));
		if (key === "defaultModelId") setModelId(value as ModelId);
	}

	function toggleAction(actionId: QuickActionId, enabled: boolean) {
		setState((current) => ({
			...current,
			enabledQuickActionIds: enabled
				? QUICK_ACTION_IDS.filter(
						(id) =>
							current.enabledQuickActionIds.includes(id) || id === actionId,
					)
				: current.enabledQuickActionIds.filter((id) => id !== actionId),
		}));
	}

	function runAction(actionId: QuickActionId) {
		if (isGenerating || !state.enabledQuickActionIds.includes(actionId)) return;
		const action = ACTIONS_BY_ID.get(actionId);
		if (!action) return;

		const sourceText = pageText.trim() || action.examplePrompt;
		const existingSession = state.extensionSessions.find(
			(session) => session.actionId === actionId,
		);
		const session =
			existingSession ??
			createExtensionSession(actionId, action.label, modelId);
		const [userMessage, assistantMessage] = createExtensionTurn(
			modelId,
			action.label,
			state.streamingEnabled,
		);
		const stateWithSession = existingSession
			? state
			: { ...state, extensionSessions: [...state.extensionSessions, session] };
		const nextState = addExtensionMessages(stateWithSession, session.id, [
			userMessage,
			assistantMessage,
		]);

		setSelectedActionId(actionId);
		setActiveTab("chat");
		setPageText("");
		setState(nextState);
		setIsGenerating(true);
		setNotice(`${action.label} is running locally.`);

		const controller = new AbortController();
		abortRef.current = controller;
		void simulateResponse(
			{ prompt: sourceText, modelId, actionId },
			controller.signal,
		)
			.then((response) => {
				if (abortRef.current !== controller) return;
				setState((current) =>
					updateExtensionMessage(current, session.id, assistantMessage.id, {
						content: response.content,
						modelId: response.modelId,
						status: "complete",
					}),
				);
				setNotice(`${action.label} response is ready.`);
			})
			.catch((error: unknown) => {
				if (abortRef.current !== controller) return;
				const stopped =
					error instanceof DOMException && error.name === "AbortError";
				setState((current) =>
					updateExtensionMessage(current, session.id, assistantMessage.id, {
						content: stopped
							? "Response stopped."
							: "The local response could not be generated.",
						status: "stopped",
					}),
				);
				setNotice(stopped ? "Response stopped." : "The local response failed.");
			})
			.finally(() => {
				if (abortRef.current === controller) {
					abortRef.current = null;
					setIsGenerating(false);
				}
			});
	}

	function clearHistory() {
		abortRef.current = null;
		setState((current) => ({ ...current, extensionSessions: [] }));
		setNotice("Extension history cleared.");
		setConfirmAction(null);
	}

	function resetDemo() {
		abortRef.current = null;
		const fresh = resetDemoState();
		setState(fresh);
		setModelId(fresh.defaultModelId);
		setPageText("");
		setNotice("Demo data reset.");
		setConfirmAction(null);
	}

	return (
		<section
			className="extension-window"
			aria-label="EchoGPT extension simulator"
			data-compact={state.compactMode}
		>
			<Tabs
				value={activeTab}
				onValueChange={(value) => {
					if (value === "chat" || value === "history" || value === "settings") {
						setActiveTab(value);
					}
				}}
			>
				<div className="extension-toolbar">
					<div>
						<p className="text-sm font-semibold">EchoGPT Extension</p>
						<p className="text-xs text-muted-foreground">
							Local simulator · no page content stored
						</p>
					</div>
					<TabsList className="grid w-full grid-cols-3 sm:w-auto">
						<TabsTrigger value="chat">
							<MessageSquareText aria-hidden="true" />
							Chat
						</TabsTrigger>
						<TabsTrigger value="history">
							<History aria-hidden="true" />
							History
						</TabsTrigger>
						<TabsTrigger value="settings">
							<Settings2 aria-hidden="true" />
							Settings
						</TabsTrigger>
					</TabsList>
				</div>
				<div className="extension-pane">
					<TabsContent value="chat">
						<ExtensionChat
							actions={quickActions}
							enabledActionIds={state.enabledQuickActionIds}
							selectedActionId={selectedActionId}
							modelId={modelId}
							pageText={pageText}
							session={selectedSession}
							isGenerating={isGenerating}
							keyboardShortcutsEnabled={state.keyboardShortcutsEnabled}
							onModelChange={selectModel}
							onPageTextChange={setPageText}
							onRunAction={runAction}
							onStop={() => abortRef.current?.abort()}
						/>
					</TabsContent>
					<TabsContent value="history">
						<ExtensionHistory
							sessions={state.extensionSessions}
							selectedActionId={selectedActionId}
							onSelectAction={(actionId) => {
								setSelectedActionId(actionId);
								setActiveTab("chat");
							}}
							onClearRequest={() => setConfirmAction("clear")}
						/>
					</TabsContent>
					<TabsContent value="settings">
						<ExtensionSettings
							settings={state}
							enabledActionIds={state.enabledQuickActionIds}
							onSettingChange={changeSetting}
							onToggleAction={toggleAction}
							onResetRequest={() => setConfirmAction("reset")}
						/>
					</TabsContent>
				</div>
			</Tabs>
			<p className="extension-notice" role="status" aria-live="polite">
				{notice}
			</p>
			<ExtensionConfirmDialog
				open={confirmAction === "clear"}
				title="Clear extension history?"
				description="This removes extension sessions only. Workspace conversations and shared settings stay intact."
				confirmLabel="Clear extension history"
				onCancel={() => setConfirmAction(null)}
				onConfirm={clearHistory}
			/>
			<ExtensionConfirmDialog
				open={confirmAction === "reset"}
				title="Reset all demo data?"
				description="This removes extension history, workspace conversations, and shared settings, then restores the seeded demo."
				confirmLabel="Reset demo data"
				onCancel={() => setConfirmAction(null)}
				onConfirm={resetDemo}
			/>
		</section>
	);
}
