import { defineConfig, devices } from "@playwright/test"

const PORT = 4321
const baseURL = `http://127.0.0.1:${PORT}`

export default defineConfig({
	testDir: "./tests/e2e",
	timeout: 30_000,
	expect: {
		timeout: 5_000,
	},
	fullyParallel: true,
	forbidOnly: Boolean(process.env.CI),
	retries: process.env.CI ? 2 : 0,
	reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
	use: {
		baseURL,
		trace: "on-first-retry",
	},
	projects: [
		{
			name: "chromium",
			use: { ...devices["Desktop Chrome"] },
		},
	],
	webServer: {
		command: `pnpm build && pnpm preview --host 127.0.0.1 --port ${PORT}`,
		reuseExistingServer: !process.env.CI,
		url: baseURL,
		timeout: 120_000,
	},
})
