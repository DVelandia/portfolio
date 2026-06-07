import AxeBuilder from "@axe-core/playwright"
import { expect, test } from "@playwright/test"

for (const path of ["/", "/en/"]) {
	test(`homepage ${path} passes automated accessibility checks`, async ({ page }) => {
		await page.goto(path)
		await page.addStyleTag({
			content: ".js-reveal [data-reveal]{opacity:1!important;transform:none!important}",
		})

		const results = await new AxeBuilder({ page }).analyze()

		expect(results.violations).toEqual([])
	})
}
