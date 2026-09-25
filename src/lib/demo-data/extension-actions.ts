import type { QuickActionId, SuggestedPrompt } from "@/lib/storage/schema";

export interface QuickActionDefinition {
	id: QuickActionId;
	label: string;
	description: string;
	hint: string;
	examplePrompt: string;
}

const fallbackQuickAction: QuickActionDefinition = {
	id: "summarize",
	label: "Summarize page",
	description: "Make the main point easier to scan.",
	hint: "Condense the main idea",
	examplePrompt: "Summarize this paragraph for a product brief.",
};

export const quickActions: readonly QuickActionDefinition[] = [
	{
		id: "summarize",
		label: "Summarize page",
		description: "Make the main point easier to scan.",
		hint: "Condense the main idea",
		examplePrompt: "Summarize this paragraph for a product brief.",
	},
	{
		id: "rewrite",
		label: "Rewrite",
		description: "Clarify the sentence without changing its intent.",
		hint: "Improve clarity",
		examplePrompt: "Rewrite this sentence to make the trade-off clearer.",
	},
	{
		id: "translate",
		label: "Translate",
		description: "Render a plain-language demo translation.",
		hint: "Use plain language",
		examplePrompt:
			"Translate this update into clear English for a product audience.",
	},
	{
		id: "explain-code",
		label: "Explain code",
		description: "Describe the behavior a snippet is meant to produce.",
		hint: "Describe the behavior",
		examplePrompt: "Explain what this code does and one edge case to check.",
	},
	{
		id: "brainstorm",
		label: "Brainstorm",
		description: "Offer a few concrete directions to explore.",
		hint: "Explore useful directions",
		examplePrompt:
			"Brainstorm three small, useful directions for this product problem.",
	},
	{
		id: "generate-image",
		label: "Generate image",
		description: "Create a local visual placeholder for the selected page.",
		hint: "Describe a visual direction",
		examplePrompt:
			"Describe a simple visual direction for this product announcement.",
	},
] as const;

export const workspaceSuggestedPrompts: readonly SuggestedPrompt[] = [
	{
		id: "explain-code",
		label: "Explain this code",
		prompt:
			"Explain what this code does, what input it expects, and one edge case to check.",
	},
	{
		id: "summarize-copy",
		label: "Summarize this copy",
		prompt:
			"Summarize this copy in three clear sentences and keep the next action explicit.",
	},
	{
		id: "plan-feature",
		label: "Plan a small feature",
		prompt:
			"Plan a small feature with the smallest useful scope, one risk, and a verification step.",
	},
] as const;

export function getQuickAction(actionId: QuickActionId): QuickActionDefinition {
	return (
		quickActions.find((action) => action.id === actionId) ?? fallbackQuickAction
	);
}
