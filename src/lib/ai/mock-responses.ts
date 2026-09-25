import type { ModelId, QuickActionId } from "@/lib/storage/schema";

export interface MockResponseRequest {
	prompt: string;
	modelId: ModelId;
	actionId?: QuickActionId;
}

const ACTION_PREFIX: Record<QuickActionId, string> = {
	summarize: "Demo summary:",
	rewrite: "Demo rewrite:",
	translate: "Demo translation:",
	"explain-code": "Demo explanation:",
	brainstorm: "Demo ideas:",
	"generate-image": "Demo image brief:",
};

const MODEL_PERSPECTIVE: Record<ModelId, string> = {
	"gpt-4": "GPT-4 keeps the answer practical and easy to verify.",
	"claude-sonnet": "Claude Sonnet adds a careful check for missing context.",
	"gemini-pro": "Gemini Pro turns the result into a compact set of next steps.",
	deepseek: "DeepSeek keeps the focus on the smallest useful technical move.",
};

const RESPONSE_MATRIX: Partial<
	Record<ModelId, Readonly<Record<string, string>>>
> = {
	"gpt-4": {
		"explain this code":
			"The code turns a raw value into a typed, predictable result and keeps the fallback explicit.",
		"summarize this copy":
			"The copy explains a useful change, names the audience benefit, and ends with one clear next step.",
	},
	"claude-sonnet": {
		"what should i verify first?":
			"Verify the public behavior first, then the smallest integration path that depends on it.",
	},
	"gemini-pro": {
		"summarize this paragraph for a product brief.":
			"Flexible work improves control over collaboration, but written decisions keep the team aligned.",
	},
	deepseek: {
		"turn these launch notes into a calm announcement.":
			"Lead with the useful change, name the reader benefit, and keep the call to action singular.",
	},
};

const FALLBACK_BODY =
	"This is a scripted demo response. Add context, constraints, and a desired next step for a more specific result.";

export function normalizePrompt(prompt: string): string {
	return prompt.trim().toLowerCase().replace(/\s+/g, " ");
}

export function createMockResponse({
	prompt,
	modelId,
	actionId,
}: MockResponseRequest): string {
	const normalized = normalizePrompt(prompt);
	const prefix =
		actionId === undefined ? "Demo response:" : ACTION_PREFIX[actionId];
	const modelResponses = RESPONSE_MATRIX[modelId];
	const body = modelResponses?.[normalized] ?? FALLBACK_BODY;
	return `${prefix} ${body} ${MODEL_PERSPECTIVE[modelId]}`;
}
