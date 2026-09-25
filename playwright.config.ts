import { defineConfig, devices } from "@playwright/test";

const localURL = "http://localhost:3000";
const baseURL = process.env.E2E_BASE_URL ?? localURL;
const useLocalServer = process.env.E2E_BASE_URL === undefined;

export default defineConfig({
	testDir: "./e2e",
	fullyParallel: true,
	forbidOnly: Boolean(process.env.CI),
	retries: process.env.CI ? 2 : 0,
	...(process.env.CI ? { workers: 1 } : {}),
	globalTimeout: 180_000,
	reporter: [["list"]],
	use: {
		baseURL,
		trace: "on-first-retry",
		screenshot: "only-on-failure",
		video: "retain-on-failure",
	},
	...(useLocalServer
		? {
				webServer: {
					command: "corepack pnpm dev",
					url: localURL,
					reuseExistingServer: !process.env.CI,
					timeout: 120_000,
				},
			}
		: {}),
	projects: [
		{
			name: "chromium",
			use: { ...devices["Desktop Chrome"] },
		},
	],
});
