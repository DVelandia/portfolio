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

test("desktop nav links navigate to section anchors", async ({ page }) => {
	const browserErrors = failOnUnexpectedBrowserErrors(page)

	await page.goto("/")

	// aria-label at '/' is Spanish: "Navegación de escritorio"
	const desktopNav = page.getByLabel("Navegación de escritorio")

	await desktopNav.getByRole("link", { name: "Proyectos" }).click()
	await expect(page).toHaveURL(/#projects$/)

	await desktopNav.getByRole("link", { name: "Experiencia" }).click()
	await expect(page).toHaveURL(/#experience$/)

	await desktopNav.getByRole("link", { name: "Tecnologías" }).click()
	await expect(page).toHaveURL(/#technologies$/)

	expect(browserErrors).toEqual([])
})

test("selected theme persists after page reload", async ({ page }) => {
	const browserErrors = failOnUnexpectedBrowserErrors(page)

	await page.goto("/")

	// Set dark mode
	await page.getByRole("button", { name: /cambiar tema/i }).click()
	await page.getByText("Oscuro", { exact: true }).click()
	await expect(page.locator("html")).toHaveClass(/dark/)

	// Reload and verify persistence via localStorage
	await page.reload()
	await expect(page.locator("html")).toHaveClass(/dark/)

	// Clean up: restore light mode
	await page.getByRole("button", { name: /cambiar tema/i }).click()
	await page.getByText("Claro", { exact: true }).click()
	await expect(page.locator("html")).not.toHaveClass(/dark/)

	expect(browserErrors).toEqual([])
})

test("language selector navigates from English back to Spanish", async ({ page }) => {
	const browserErrors = failOnUnexpectedBrowserErrors(page)

	await page.goto("/en/")
	await expect(page.locator("html")).toHaveAttribute("lang", "en")

	await page.locator(".language-selector summary").click()
	await page.getByRole("link", { name: /español/i }).click()

	await expect(page).toHaveURL("/")
	await expect(page.locator("html")).toHaveAttribute("lang", "es")

	expect(browserErrors).toEqual([])
})
