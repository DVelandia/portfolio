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

test("desktop nav links navigate to section anchors", async ({ page }, testInfo) => {
	test.skip(testInfo.project.name === "mobile-chromium", "Desktop nav is hidden on mobile.")

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

test("English mobile menu uses localized labels and links to sections", async ({ page }) => {
	const browserErrors = failOnUnexpectedBrowserErrors(page)

	await page.setViewportSize({ width: 390, height: 844 })
	await page.goto("/en/")

	const menuButton = page.locator("#menu-toggle")
	await expect(menuButton).toHaveAttribute("aria-label", "Open navigation menu")
	await menuButton.click()

	await expect(menuButton).toHaveAttribute("aria-expanded", "true")
	await expect(menuButton).toHaveAttribute("aria-label", "Close navigation menu")
	await expect(page.getByLabel("Mobile navigation")).toHaveAttribute("aria-hidden", "false")

	await page.getByLabel("Mobile navigation").getByRole("link", { name: "Projects" }).click()

	await expect(page).toHaveURL(/\/en\/#projects$/)
	await expect(menuButton).toHaveAttribute("aria-expanded", "false")
	await expect(menuButton).toHaveAttribute("aria-label", "Open navigation menu")
	expect(browserErrors).toEqual([])
})

test("English theme toggle changes the document theme without browser errors", async ({ page }) => {
	const browserErrors = failOnUnexpectedBrowserErrors(page)

	await page.goto("/en/")
	await page.getByRole("button", { name: /change theme/i }).click()
	await page.getByText("Dark", { exact: true }).click()

	await expect(page.locator("html")).toHaveClass(/dark/)
	await expect(page.locator("html")).toHaveAttribute("data-theme", "dark")

	await page.getByRole("button", { name: /change theme/i }).click()
	await page.getByText("Light", { exact: true }).click()

	await expect(page.locator("html")).not.toHaveClass(/dark/)
	await expect(page.locator("html")).toHaveAttribute("data-theme", "light")
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
