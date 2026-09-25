import type {
	ChatMessage,
	Conversation,
	ExtensionSession,
	ModelId,
} from "@/lib/storage/schema";

const SEED_TIME = "2026-01-15T09:00:00.000Z";

function seedMessage(
	id: string,
	role: ChatMessage["role"],
	content: string,
	modelId: ModelId,
	status: ChatMessage["status"] = "complete",
	createdAt = SEED_TIME,
): ChatMessage {
	return { id, role, content, createdAt, modelId, status };
}

function seedConversation(
	id: string,
	title: string,
	messages: ChatMessage[],
	pinned = false,
	modelId: ModelId = messages[0]?.modelId ?? "gpt-4",
): Conversation {
	return {
		id,
		modelId,
		title,
		createdAt: messages[0]?.createdAt ?? SEED_TIME,
		updatedAt: messages[messages.length - 1]?.createdAt ?? SEED_TIME,
		pinned,
		messages,
	};
}

export const workspaceSeedConversations: Conversation[] = [
	seedConversation(
		"conversation-refactor-plan",
		"Refactor plan",
		[
			seedMessage(
				"refactor-user-1",
				"user",
				"Help me plan a small refactor without changing behavior.",
				"gpt-4",
			),
			seedMessage(
				"refactor-assistant-1",
				"assistant",
				"Start with a behavior-preserving inventory, then extract the smallest seam that removes duplication. Run the existing checks after each slice.",
				"gpt-4",
			),
			seedMessage(
				"refactor-user-2",
				"user",
				"What should I verify first?",
				"gpt-4",
			),
			seedMessage(
				"refactor-assistant-2",
				"assistant",
				"Verify the public behavior and the smallest observable integration path first. Those checks give the refactor a useful boundary.",
				"gpt-4",
			),
		],
		true,
	),
	seedConversation("conversation-error", "Explain this error", [
		seedMessage(
			"error-user-1",
			"user",
			"Explain why a local storage write can fail silently.",
			"gemini-pro",
		),
		seedMessage(
			"error-assistant-1",
			"assistant",
			"A browser can disable storage, exceed quota, or reject private-mode writes. Treat the write as best effort and show a recoverable status when it fails.",
			"gemini-pro",
		),
	]),
	seedConversation("conversation-launch-notes", "Launch notes", [
		seedMessage(
			"launch-user-1",
			"user",
			"Turn these launch notes into a calm announcement.",
			"deepseek",
		),
		seedMessage(
			"launch-assistant-1",
			"assistant",
			"Lead with the useful change, name who it helps, and end with one clear next step. Keep implementation details in the follow-up material.",
			"deepseek",
		),
	]),
];

export const extensionSeedSessions: ExtensionSession[] = [
	{
		...seedConversation("extension-summarize", "Summarize selected text", [
			seedMessage(
				"extension-summary-user",
				"user",
				"Summarize this paragraph for a product brief.",
				"gpt-4",
			),
			seedMessage(
				"extension-summary-assistant",
				"assistant",
				"Demo summary: Remote work gives teams control over when they collaborate, while making written decisions essential.",
				"gpt-4",
			),
		]),
		actionId: "summarize",
	},
	{
		...seedConversation("extension-rewrite", "Rewrite selected text", [
			seedMessage(
				"extension-rewrite-user",
				"user",
				"Rewrite this sentence to make the trade-off clearer.",
				"claude-sonnet",
			),
			seedMessage(
				"extension-rewrite-assistant",
				"assistant",
				"Demo rewrite: Remote work offers flexible schedules, but teams must document decisions so collaboration does not depend on overlap.",
				"claude-sonnet",
			),
		]),
		actionId: "rewrite",
	},
	{
		...seedConversation("extension-explain-code", "Explain selected code", [
			seedMessage(
				"extension-code-user",
				"user",
				"Explain what this small function does.",
				"gemini-pro",
			),
			seedMessage(
				"extension-code-assistant",
				"assistant",
				"Demo explanation: The function checks a model value, then returns a typed fallback when the catalog cannot find it.",
				"gemini-pro",
			),
		]),
		actionId: "explain-code",
	},
];
