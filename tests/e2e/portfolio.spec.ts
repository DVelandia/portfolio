import type { Page } from "@playwright/test"
import { expect, test } from "@playwright/test"

function failOnUnexpectedBrowserErrors(page: Page) {
	const errors: Array<string> = []

	page.on("console", (message) => {
		if (message.type() === "error") {
			errors.push(message.text())
		}
	})

	page.on("pageerror", (error) => {
		errors.push(error.message)
	})

	return errors
}

/** Vercel Analytics requests /_vercel/insights which only exists on Vercel infrastructure. */
test.beforeEach(async ({ page }) => {
	await page.route("**/_vercel/insights/**", (route) => route.fulfill({ status: 200, body: "" }))
})

test("theme toggle changes the document theme without browser errors", async ({ page }) => {
	const browserErrors = failOnUnexpectedBrowserErrors(page)

	await page.goto("/")
	await page.getByRole("button", { name: /cambiar tema/i }).click()
	await page.getByText("Oscuro", { exact: true }).click()

	await expect(page.locator("html")).toHaveClass(/dark/)
	await expect(page.locator("html")).toHaveAttribute("data-theme", "dark")

	await page.getByRole("button", { name: /cambiar tema/i }).click()
	await page.getByText("Claro", { exact: true }).click()

	await expect(page.locator("html")).not.toHaveClass(/dark/)
	await expect(page.locator("html")).toHaveAttribute("data-theme", "light")
	expect(browserErrors).toEqual([])
})

test("language selector navigates between Spanish and English", async ({ page }) => {
	const browserErrors = failOnUnexpectedBrowserErrors(page)

	await page.goto("/")
	await expect(page.locator("html")).toHaveAttribute("lang", "es")

	await page.locator(".language-selector summary").click()
	await page.getByRole("link", { name: /english/i }).click()

	await expect(page).toHaveURL(/\/en\/$/)
	await expect(page.locator("html")).toHaveAttribute("lang", "en")
	await expect(page.getByRole("heading", { name: /i'm daniel velandia/i })).toBeVisible()
	expect(browserErrors).toEqual([])
})

test("mobile menu opens, closes, and links to sections", async ({ page }) => {
	const browserErrors = failOnUnexpectedBrowserErrors(page)

	await page.setViewportSize({ width: 390, height: 844 })
	await page.goto("/")

	const menuButton = page.locator("#menu-toggle")
	await menuButton.click()

	await expect(menuButton).toHaveAttribute("aria-expanded", "true")
	await expect(page.locator("#mobile-menu")).toHaveAttribute("aria-hidden", "false")

	// aria-label at '/' is Spanish: "Navegación móvil"
	await page.getByLabel("Navegación móvil").getByRole("link", { name: "Proyectos" }).click()
	await expect(menuButton).toHaveAttribute("aria-expanded", "false")
	await expect(page).toHaveURL(/#projects$/)
	expect(browserErrors).toEqual([])
})
