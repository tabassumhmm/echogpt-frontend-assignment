import type { ThemeMode } from "@/lib/theme";

export const MODEL_IDS = [
	"gpt-4",
	"claude-sonnet",
	"gemini-pro",
	"deepseek",
] as const;
export type ModelId = (typeof MODEL_IDS)[number];

export const QUICK_ACTION_IDS = [
	"summarize",
	"rewrite",
	"translate",
	"explain-code",
	"brainstorm",
	"generate-image",
] as const;
export type QuickActionId = (typeof QUICK_ACTION_IDS)[number];

export type SuggestedPromptId =
	| "explain-code"
	| "summarize-copy"
	| "plan-feature";

export interface SuggestedPrompt {
	id: SuggestedPromptId;
	label: string;
	prompt: string;
}

export type ChatMessageRole = "user" | "assistant";
export type MessageStatus = "complete" | "streaming" | "stopped";

export interface AttachmentMetadata {
	id: string;
	name: string;
	type: string;
	size: number;
}

export interface ChatMessage {
	id: string;
	role: ChatMessageRole;
	content: string;
	createdAt: string;
	modelId: ModelId;
	status: MessageStatus;
	attachments?: AttachmentMetadata[];
}

export interface Conversation {
	id: string;
	modelId: ModelId;
	title: string;
	createdAt: string;
	updatedAt: string;
	pinned: boolean;
	messages: ChatMessage[];
}

export interface ExtensionSession extends Conversation {
	actionId?: QuickActionId;
}

export interface DemoState {
	version: 1;
	themeMode: ThemeMode;
	defaultModelId: ModelId;
	streamingEnabled: boolean;
	compactMode: boolean;
	keyboardShortcutsEnabled: boolean;
	enabledQuickActionIds: QuickActionId[];
	workspaceConversations: Conversation[];
	extensionSessions: ExtensionSession[];
}

export const MAX_IMPORT_BYTES = 750_000;
export const MAX_HISTORY_ITEMS = 200;
export const MAX_MESSAGE_LENGTH = 20_000;
export const MAX_CONVERSATION_TITLE_LENGTH = 120;
export const MAX_ATTACHMENTS_PER_MESSAGE = 8;
export const MAX_ATTACHMENT_NAME_LENGTH = 160;
export const MAX_ATTACHMENT_TYPE_LENGTH = 120;
export const MAX_ATTACHMENT_SIZE_BYTES = 50 * 1024 * 1024;
export const MAX_SESSION_ACTION_LENGTH = 1_000;

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isBoundedString(value: unknown, maxLength: number): value is string {
	return (
		typeof value === "string" && value.length > 0 && value.length <= maxLength
	);
}

export function isModelId(value: unknown): value is ModelId {
	return (
		typeof value === "string" && MODEL_IDS.some((modelId) => modelId === value)
	);
}

export function isQuickActionId(value: unknown): value is QuickActionId {
	return (
		typeof value === "string" &&
		QUICK_ACTION_IDS.some((actionId) => actionId === value)
	);
}

function isThemeModeValue(value: unknown): value is ThemeMode {
	return value === "light" || value === "dark" || value === "system";
}

function isMessageRole(value: unknown): value is ChatMessageRole {
	return value === "user" || value === "assistant";
}

function isMessageStatus(value: unknown): value is MessageStatus {
	return value === "complete" || value === "streaming" || value === "stopped";
}

function isAttachmentMetadata(value: unknown): value is AttachmentMetadata {
	if (!isRecord(value)) return false;
	return (
		isBoundedString(value.id, 120) &&
		isBoundedString(value.name, MAX_ATTACHMENT_NAME_LENGTH) &&
		typeof value.type === "string" &&
		value.type.length <= MAX_ATTACHMENT_TYPE_LENGTH &&
		typeof value.size === "number" &&
		Number.isSafeInteger(value.size) &&
		value.size >= 0 &&
		value.size <= MAX_ATTACHMENT_SIZE_BYTES
	);
}

function parseAttachments(value: unknown): AttachmentMetadata[] | undefined {
	if (!Array.isArray(value)) return undefined;
	const attachments = value
		.filter(isAttachmentMetadata)
		.slice(0, MAX_ATTACHMENTS_PER_MESSAGE);
	return attachments.length > 0 ? attachments : undefined;
}

function parseChatMessage(value: unknown): ChatMessage | null {
	if (!isRecord(value)) return null;
	const { id, role, content, createdAt, modelId, status } = value;
	if (
		!isBoundedString(id, 120) ||
		!isMessageRole(role) ||
		!isBoundedString(content, MAX_MESSAGE_LENGTH) ||
		!isBoundedString(createdAt, 40) ||
		!isModelId(modelId) ||
		!isMessageStatus(status)
	) {
		return null;
	}
	const message: ChatMessage = {
		id,
		role,
		content,
		createdAt,
		modelId,
		status,
	};
	const attachments = parseAttachments(value.attachments);
	return attachments === undefined ? message : { ...message, attachments };
}

export function parseConversation(
	value: unknown,
	fallbackModelId: ModelId = "gpt-4",
): Conversation | null {
	if (!isRecord(value)) return null;
	const { id, modelId, title, createdAt, updatedAt, pinned, messages } = value;
	if (
		!isBoundedString(id, 120) ||
		(modelId !== undefined && !isModelId(modelId)) ||
		!isBoundedString(title, MAX_CONVERSATION_TITLE_LENGTH) ||
		!isBoundedString(createdAt, 40) ||
		!isBoundedString(updatedAt, 40) ||
		typeof pinned !== "boolean" ||
		!Array.isArray(messages) ||
		messages.length > MAX_HISTORY_ITEMS
	) {
		return null;
	}

	const parsedMessages: ChatMessage[] = [];
	for (const item of messages) {
		const message = parseChatMessage(item);
		if (message === null) return null;
		parsedMessages.push(message);
	}

	return {
		id,
		modelId: isModelId(modelId) ? modelId : fallbackModelId,
		title,
		createdAt,
		updatedAt,
		pinned,
		messages: parsedMessages,
	};
}

function parseExtensionSession(
	value: unknown,
	fallbackModelId: ModelId = "gpt-4",
): ExtensionSession | null {
	const conversation = parseConversation(value, fallbackModelId);
	if (conversation === null || !isRecord(value)) return null;
	if (value.actionId !== undefined && !isQuickActionId(value.actionId))
		return null;

	const session: ExtensionSession = { ...conversation };
	if (isQuickActionId(value.actionId)) session.actionId = value.actionId;
	return session;
}

export function parseDemoState(value: unknown): DemoState | null {
	if (
		!isRecord(value) ||
		value.version !== 1 ||
		!isThemeModeValue(value.themeMode)
	)
		return null;
	if (!isModelId(value.defaultModelId)) return null;
	if (typeof value.streamingEnabled !== "boolean") return null;
	if (typeof value.compactMode !== "boolean") return null;
	if (typeof value.keyboardShortcutsEnabled !== "boolean") return null;
	if (!Array.isArray(value.enabledQuickActionIds)) return null;
	if (!value.enabledQuickActionIds.every(isQuickActionId)) return null;
	if (
		new Set(value.enabledQuickActionIds).size !==
		value.enabledQuickActionIds.length
	)
		return null;
	if (
		!Array.isArray(value.workspaceConversations) ||
		value.workspaceConversations.length === 0
	)
		return null;
	if (!Array.isArray(value.extensionSessions)) return null;

	const workspaceConversations: Conversation[] = [];
	for (const conversation of value.workspaceConversations) {
		const parsed = parseConversation(conversation, value.defaultModelId);
		if (parsed === null) return null;
		workspaceConversations.push(parsed);
	}

	const extensionSessions: ExtensionSession[] = [];
	for (const session of value.extensionSessions) {
		const parsed = parseExtensionSession(session, value.defaultModelId);
		if (parsed === null) return null;
		extensionSessions.push(parsed);
	}

	return {
		version: 1,
		themeMode: value.themeMode,
		defaultModelId: value.defaultModelId,
		streamingEnabled: value.streamingEnabled,
		compactMode: value.compactMode,
		keyboardShortcutsEnabled: value.keyboardShortcutsEnabled,
		enabledQuickActionIds: [...value.enabledQuickActionIds],
		workspaceConversations,
		extensionSessions,
	};
}

export function isConversation(value: unknown): value is Conversation {
	return parseConversation(value) !== null;
}
