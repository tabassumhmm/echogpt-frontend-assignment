import { MODEL_CATALOG } from "@/lib/demo-data/models";

export const STORE_URL =
	"https://chromewebstore.google.com/detail/echogpt-multi-ai-chat-sid/negimdcamohmoheiifgecbjgjepkcfhj";

export const features = [
	{
		title: "Switch models, keep context",
		body: "Move between four demo models without losing the thread of the conversation.",
	},
	{
		title: "Quick actions in context",
		body: "Summarize, rewrite, translate, and explain without leaving the page you are reading.",
	},
	{
		title: "Separate histories",
		body: "Each model keeps its own conversation thread while shared preferences stay in sync.",
	},
	{
		title: "Local-first by default",
		body: "The prototype stores demo conversations in this browser and makes no live provider requests.",
	},
] as const;

export const modelCatalog = MODEL_CATALOG;

export const pricingPlans = [
	{
		name: "Free",
		cadence: "free",
		summary: "A calm place to try the complete local-first demo.",
		features: [
			"Workspace and extension simulator",
			"Four demo model surfaces",
			"Local JSON history transfer",
		],
		highlighted: false,
	},
	{
		name: "Pro",
		cadence: "annual",
		summary: "The planned annual tier for people who want more control.",
		features: [
			"Everything in Free",
			"More browser actions",
			"Priority product experiments",
		],
		highlighted: true,
	},
] as const;

export const faqs = [
	{
		question: "What is EchoGPT?",
		answer:
			"EchoGPT is a qualified frontend concept for comparing model behavior across a shared workspace and a browser-extension surface.",
	},
	{
		question: "How does model switching work?",
		answer:
			"Choose a model in the composer, send a prompt, and compare the response. Each model keeps a separate conversation history in this demo.",
	},
	{
		question: "Does the demo call live models?",
		answer:
			"No. Responses are deterministic local simulations, so no provider credentials or network requests are required.",
	},
	{
		question: "What does the extension concept do?",
		answer:
			"The extension route previews quick actions, model choice, local history, and settings without requiring a packaged extension.",
	},
	{
		question: "How do I reset the demo?",
		answer:
			"Use Reset demo in the workspace or extension settings. It restores the seeded state after confirmation.",
	},
] as const;
