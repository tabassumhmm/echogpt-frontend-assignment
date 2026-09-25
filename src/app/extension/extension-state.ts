import {
	createAssistantMessage,
	createUserMessage,
} from "@/lib/workspace-actions";
import type {
	ChatMessage,
	DemoState,
	ExtensionSession,
	ModelId,
	QuickActionId,
} from "@/lib/storage/schema";

function createId(prefix: string): string {
	return `${prefix}-${crypto.randomUUID()}`;
}

export function createExtensionSession(
	actionId: QuickActionId,
	title: string,
	modelId: ModelId,
): ExtensionSession {
	const timestamp = new Date().toISOString();
	return {
		id: createId("extension-session"),
		modelId,
		title,
		createdAt: timestamp,
		updatedAt: timestamp,
		pinned: false,
		messages: [],
		actionId,
	};
}

export function addExtensionMessages(
	state: DemoState,
	sessionId: string,
	messages: readonly [ChatMessage, ChatMessage],
): DemoState {
	return {
		...state,
		extensionSessions: state.extensionSessions.map((session) =>
			session.id === sessionId
				? {
						...session,
						updatedAt: messages[1].createdAt,
						messages: [...session.messages, ...messages],
					}
				: session,
		),
	};
}

export function updateExtensionMessage(
	state: DemoState,
	sessionId: string,
	messageId: string,
	update: Partial<ChatMessage>,
): DemoState {
	return {
		...state,
		extensionSessions: state.extensionSessions.map((session) =>
			session.id === sessionId
				? {
						...session,
						updatedAt: new Date().toISOString(),
						messages: session.messages.map((message) =>
							message.id === messageId ? { ...message, ...update } : message,
						),
					}
				: session,
		),
	};
}

export function createExtensionTurn(
	modelId: DemoState["defaultModelId"],
	label: string,
	streamingEnabled: boolean,
): readonly [ChatMessage, ChatMessage] {
	return [
		createUserMessage(modelId, `${label} request`),
		createAssistantMessage(
			modelId,
			streamingEnabled ? "Composing locally…" : "Queued local response…",
		),
	];
}
