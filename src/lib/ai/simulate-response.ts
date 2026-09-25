import {
	createMockResponse,
	type MockResponseRequest,
} from "@/lib/ai/mock-responses";

export type SimulationRequest = MockResponseRequest;

function getDelay(prompt: string): number {
	const normalized = prompt.trim().toLowerCase().replace(/\s+/g, " ");
	const hash = [...normalized].reduce(
		(value, character) => (value * 31 + character.charCodeAt(0)) % 1000,
		0,
	);
	return 350 + (hash % 351);
}

export function simulateResponse(
	request: SimulationRequest,
	signal?: AbortSignal,
): Promise<{ content: string; modelId: SimulationRequest["modelId"] }> {
	const content = createMockResponse(request);
	const delay = getDelay(request.prompt);

	return new Promise((resolve, reject) => {
		if (signal?.aborted) {
			reject(new DOMException("Response stopped", "AbortError"));
			return;
		}

		const timeoutId = setTimeout(() => {
			signal?.removeEventListener("abort", handleAbort);
			resolve({ content, modelId: request.modelId });
		}, delay);

		function handleAbort() {
			clearTimeout(timeoutId);
			reject(new DOMException("Response stopped", "AbortError"));
		}

		signal?.addEventListener("abort", handleAbort, { once: true });
	});
}
