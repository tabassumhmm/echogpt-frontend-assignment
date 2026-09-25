import {
	extensionSeedSessions,
	workspaceSeedConversations,
} from "@/lib/demo-data/conversations";
import {
	type Conversation,
	type DemoState,
	MAX_IMPORT_BYTES,
	parseConversation,
	parseDemoState,
} from "@/lib/storage/schema";

export const STORAGE_KEY = "echogpt.demo.v1";
export const HISTORY_STORAGE_KEY = "echogpt.workspace-history.v1";

export class InvalidWorkspaceHistoryError extends Error {
	constructor() {
		super("Invalid EchoGPT workspace history file");
		this.name = "InvalidWorkspaceHistoryError";
	}
}

function cloneConversation(conversation: Conversation): Conversation {
	return {
		...conversation,
		messages: conversation.messages.map((message) => ({
			...message,
			...(message.attachments === undefined
				? {}
				: {
						attachments: message.attachments.map((attachment) => ({
							...attachment,
						})),
					}),
		})),
	};
}

export function createSeedState(): DemoState {
	return {
		version: 1,
		themeMode: "system",
		defaultModelId: "gpt-4",
		streamingEnabled: true,
		compactMode: false,
		keyboardShortcutsEnabled: true,
		enabledQuickActionIds: [
			"summarize",
			"rewrite",
			"translate",
			"explain-code",
			"brainstorm",
			"generate-image",
		],
		workspaceConversations: workspaceSeedConversations.map(cloneConversation),
		extensionSessions: extensionSeedSessions.map((session) => ({
			...cloneConversation(session),
			...(session.actionId === undefined ? {} : { actionId: session.actionId }),
		})),
	};
}

export function loadDemoState(): DemoState {
	if (typeof window === "undefined") return createSeedState();
	try {
		const raw = window.localStorage.getItem(STORAGE_KEY);
		if (raw === null) return createSeedState();
		const parsed = parseDemoState(JSON.parse(raw));
		return parsed ?? createSeedState();
	} catch (error) {
		if (error instanceof DOMException || error instanceof Error) {
			return createSeedState();
		}
		throw error;
	}
}

export function saveDemoState(state: DemoState): boolean {
	if (typeof window === "undefined") return true;
	try {
		window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
		return true;
	} catch (error) {
		if (error instanceof DOMException || error instanceof Error) {
			return false;
		}
		throw error;
	}
}

export function exportWorkspaceHistory(state: DemoState): string {
	return JSON.stringify(
		{
			kind: "echogpt-workspace-history",
			version: 1,
			conversations: state.workspaceConversations,
		},
		null,
		2,
	);
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function importWorkspaceHistory(
	serialized: string,
	currentState: DemoState,
): DemoState {
	if (new TextEncoder().encode(serialized).byteLength > MAX_IMPORT_BYTES) {
		throw new InvalidWorkspaceHistoryError();
	}

	let value: unknown;
	try {
		value = JSON.parse(serialized);
	} catch {
		throw new InvalidWorkspaceHistoryError();
	}

	if (
		!isRecord(value) ||
		value.kind !== "echogpt-workspace-history" ||
		value.version !== 1
	) {
		throw new InvalidWorkspaceHistoryError();
	}
	if (!Array.isArray(value.conversations) || value.conversations.length === 0) {
		throw new InvalidWorkspaceHistoryError();
	}

	const conversations: Conversation[] = [];
	for (const item of value.conversations) {
		if (isRecord(item) && Object.hasOwn(item, "actionId")) {
			throw new InvalidWorkspaceHistoryError();
		}
		const conversation = parseConversation(item, currentState.defaultModelId);
		if (conversation === null) throw new InvalidWorkspaceHistoryError();
		conversations.push(conversation);
	}

	return { ...currentState, workspaceConversations: conversations };
}
