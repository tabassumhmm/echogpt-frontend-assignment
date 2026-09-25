import { HISTORY_STORAGE_KEY, STORAGE_KEY, createSeedState } from "./storage";
import type { DemoState } from "./schema";

export function resetDemoState(): DemoState {
	if (typeof window !== "undefined") {
		try {
			window.localStorage.removeItem(STORAGE_KEY);
			window.localStorage.removeItem(HISTORY_STORAGE_KEY);
		} catch (error) {
			if (error instanceof DOMException || error instanceof Error) {
				return createSeedState();
			}
			throw error;
		}
	}
	return createSeedState();
}
