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

test("404 page renders with error content for unknown routes", async ({ page }) => {
	const browserErrors = failOnUnexpectedBrowserErrors(page)

	await page.goto("/this-page-does-not-exist")

	await expect(page.locator("html")).toHaveAttribute("lang", "es")
	await expect(page.getByRole("heading", { level: 1 })).toContainText("ERROR 404")
	await expect(page.getByText("Página no encontrada")).toBeVisible()
	await expect(page.getByRole("link", { name: "Volver al inicio" })).toBeVisible()

	// The "404 (Not Found)" network error is expected when visiting a missing route
	const unexpectedErrors = browserErrors.filter((e) => !e.includes("404 (Not Found)"))
	expect(unexpectedErrors).toEqual([])
})

test("404 page home link returns to the Spanish homepage", async ({ page }) => {
	const browserErrors = failOnUnexpectedBrowserErrors(page)

	await page.goto("/this-page-does-not-exist")
	await page.getByRole("link", { name: "Volver al inicio" }).click()

	await expect(page).toHaveURL("/")
	await expect(page.locator("html")).toHaveAttribute("lang", "es")

	// The "404 (Not Found)" network error is expected when visiting a missing route
	const unexpectedErrors = browserErrors.filter((e) => !e.includes("404 (Not Found)"))
	expect(unexpectedErrors).toEqual([])
})
