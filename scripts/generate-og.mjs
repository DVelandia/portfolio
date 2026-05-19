/**
 * generate-og.mjs
 *
 * Captures the /og-image route using Playwright and produces a
 * 1200×630 PNG optimised for social sharing (< 300 KB target).
 *
 * Strategy:
 *  1. Launch Chromium at 1200×630 with deviceScaleFactor 2 (retina quality).
 *  2. Screenshot → raw buffer at 2400×1260.
 *  3. Resize to 1200×630 with sharp (high-quality Lanczos) and compress PNG.
 *
 * Usage:
 *   pnpm generate:og          (requires pnpm preview running on port 4321)
 */

import { chromium } from "playwright"
import sharp from "sharp"
import { fileURLToPath } from "url"
import path from "path"
import fs from "fs"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, "..")
const OUTPUT = path.join(ROOT, "public", "og.png")

const OG_WIDTH = 1200
const OG_HEIGHT = 630
const DEVICE_SCALE = 2 // capture at 2× for sharpness before downscale

const PORT = process.env.PORT ?? 4321
const URL = `http://localhost:${PORT}/og-image`

async function main() {
	console.log(`📸  Capturing ${URL} …`)

	const browser = await chromium.launch()
	const page = await browser.newPage({
		viewport: { width: OG_WIDTH, height: OG_HEIGHT },
		deviceScaleFactor: DEVICE_SCALE,
	})

	await page.goto(URL, { waitUntil: "networkidle" })

	// Brief pause for any CSS animations / font loading to settle
	await page.waitForTimeout(800)

	const rawBuffer = await page.screenshot({ type: "png", fullPage: false })
	await browser.close()

	console.log(
		`🔬  Raw capture: ${OG_WIDTH * DEVICE_SCALE}×${OG_HEIGHT * DEVICE_SCALE}px (${Math.round(rawBuffer.length / 1024)} KB)`
	)

	// Resize to 1200×630 and compress — target < 300 KB, max < 600 KB
	const optimised = await sharp(rawBuffer)
		.resize(OG_WIDTH, OG_HEIGHT, { kernel: sharp.kernel.lanczos3 })
		.png({ compressionLevel: 9, adaptiveFiltering: true, palette: false })
		.toBuffer()

	fs.writeFileSync(OUTPUT, optimised)

	const kb = Math.round(optimised.length / 1024)
	const status = kb < 300 ? "✅" : kb < 600 ? "⚠️ " : "❌"
	console.log(`${status}  Output: public/og.png — ${OG_WIDTH}×${OG_HEIGHT}px (${kb} KB)`)

	if (kb >= 600) {
		console.error("   WhatsApp limit is 600 KB. Consider simplifying the OG card design.")
		process.exit(1)
	}
}

main().catch((err) => {
	console.error(err)
	process.exit(1)
})
