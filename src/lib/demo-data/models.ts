export type ModelId = "gpt-4" | "claude-sonnet" | "gemini-pro" | "deepseek";

export type DemoModel = {
	id: ModelId;
	name: string;
	provider: string;
	description: string;
	status: "available";
};

export const MODEL_CATALOG: readonly DemoModel[] = [
	{
		id: "gpt-4",
		name: "GPT-4",
		provider: "OpenAI",
		description:
			"Structured, general-purpose responses for practical workflows.",
		status: "available",
	},
	{
		id: "claude-sonnet",
		name: "Claude Sonnet",
		provider: "Anthropic",
		description: "Measured explanations with a careful, long-form bias.",
		status: "available",
	},
	{
		id: "gemini-pro",
		name: "Gemini Pro",
		provider: "Google",
		description: "A fast comparison surface for concise, exploratory prompts.",
		status: "available",
	},
	{
		id: "deepseek",
		name: "DeepSeek",
		provider: "DeepSeek",
		description:
			"A focused technical perspective for code and system questions.",
		status: "available",
	},
];

export function getModel(modelId: ModelId): DemoModel {
	const model =
		MODEL_CATALOG.find((candidate) => candidate.id === modelId) ??
		MODEL_CATALOG[0];
	if (!model) throw new Error("Model catalog is empty");
	return model;
}
