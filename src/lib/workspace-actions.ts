import {
	type AttachmentMetadata,
	type ChatMessage,
	type Conversation,
	type DemoState,
	MAX_ATTACHMENT_NAME_LENGTH,
	MAX_ATTACHMENT_SIZE_BYTES,
	MAX_ATTACHMENT_TYPE_LENGTH,
	MAX_CONVERSATION_TITLE_LENGTH,
	type ModelId,
} from "@/lib/storage/schema";

function newId(prefix: string): string {
	return `${prefix}-${crypto.randomUUID()}`;
}

function now(): string {
	return new Date().toISOString();
}

export function createConversation(modelId: ModelId): Conversation {
	const timestamp = new Date().toISOString();
	return {
		id: newId("conversation"),
		modelId,
		title: "New conversation",
		createdAt: timestamp,
		updatedAt: timestamp,
		pinned: false,
		messages: [],
	};
}

export function createAttachmentMetadata(file: File): AttachmentMetadata {
	return {
		id: newId("attachment"),
		name: file.name.slice(0, MAX_ATTACHMENT_NAME_LENGTH),
		type: file.type.slice(0, MAX_ATTACHMENT_TYPE_LENGTH),
		size: Math.min(file.size, MAX_ATTACHMENT_SIZE_BYTES),
	};
}

export function createUserMessage(
	modelId: ModelId,
	content: string,
	attachments?: AttachmentMetadata[],
): ChatMessage {
	const message: ChatMessage = {
		id: newId("user"),
		role: "user",
		content,
		createdAt: now(),
		modelId,
		status: "complete",
	};
	return attachments && attachments.length > 0
		? { ...message, attachments }
		: message;
}

export function createAssistantMessage(
	modelId: ModelId,
	content = "",
): ChatMessage {
	return {
		id: newId("assistant"),
		role: "assistant",
		content,
		createdAt: now(),
		modelId,
		status: "streaming",
	};
}

export function updateConversation(
	state: DemoState,
	conversationId: string,
	update: (conversation: Conversation) => Conversation,
): DemoState {
	return {
		...state,
		workspaceConversations: state.workspaceConversations.map((conversation) =>
			conversation.id === conversationId ? update(conversation) : conversation,
		),
	};
}

export function renameConversation(
	state: DemoState,
	conversationId: string,
	title: string,
): DemoState {
	const normalizedTitle = title.trim().slice(0, MAX_CONVERSATION_TITLE_LENGTH);
	if (normalizedTitle.length === 0) return state;
	return updateConversation(state, conversationId, (conversation) => ({
		...conversation,
		title: normalizedTitle,
		updatedAt: now(),
	}));
}

export function toggleConversationPin(
	state: DemoState,
	conversationId: string,
): DemoState {
	return updateConversation(state, conversationId, (conversation) => ({
		...conversation,
		pinned: !conversation.pinned,
		updatedAt: now(),
	}));
}

export function deleteConversation(
	state: DemoState,
	conversationId: string,
): DemoState {
	return {
		...state,
		workspaceConversations: state.workspaceConversations.filter(
			(conversation) => conversation.id !== conversationId,
		),
	};
}

export function addMessage(
	state: DemoState,
	conversationId: string,
	message: ChatMessage,
): DemoState {
	return updateConversation(state, conversationId, (conversation) => ({
		...conversation,
		title:
			conversation.messages.length === 0
				? message.content.slice(0, 60)
				: conversation.title,
		updatedAt: message.createdAt,
		messages: [...conversation.messages, message],
	}));
}

export function updateMessage(
	state: DemoState,
	conversationId: string,
	messageId: string,
	update: Partial<ChatMessage>,
): DemoState {
	return updateConversation(state, conversationId, (conversation) => ({
		...conversation,
		updatedAt: now(),
		messages: conversation.messages.map((message) =>
			message.id === messageId ? { ...message, ...update } : message,
		),
	}));
}

export function getConversation(
	state: DemoState,
	conversationId: string,
): Conversation | undefined {
	return state.workspaceConversations.find(
		(conversation) => conversation.id === conversationId,
	);
}
