/**
 * generate-blur-placeholders.mjs
 *
 * Generates tiny base64 blur placeholders for every project image.
 * Outputs a JSON file that ProjectItem.astro reads at build time.
 *
 * Run: node scripts/generate-blur-placeholders.mjs
 * Or automatically via: pnpm generate:blur
 *
 * Based on the pattern from midudev/la-velada-web-oficial.
 */

import { readdir, writeFile } from "node:fs/promises"
import { join } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = fileURLToPath(new URL(".", import.meta.url))

// Dynamically import sharp (it's a native dep, may need await)
const sharp = (await import("sharp")).default

const IMAGES_DIR = join(__dirname, "../src/assets/projects")
const OUTPUT_FILE = join(__dirname, "../src/data/blur-placeholders.json")

/** Generate a tiny 20px wide base64 WEBP for the blur-up effect */
async function generateBlurPlaceholder(imagePath) {
	const buffer = await sharp(imagePath)
		.resize(20) // tiny — width 20px, height auto
		.webp({ quality: 20 })
		.toBuffer()

	return `data:image/webp;base64,${buffer.toString("base64")}`
}

async function main() {
	const files = await readdir(IMAGES_DIR)
	const imageFiles = files.filter((f) => /\.(?:webp|jpg|jpeg|png|avif)$/i.test(f))

	console.log(`🖼  Generating blur placeholders for ${imageFiles.length} images...`)

	const placeholders = {}

	await Promise.all(
		imageFiles.map(async (filename) => {
			const fullPath = join(IMAGES_DIR, filename)
			try {
				placeholders[filename] = await generateBlurPlaceholder(fullPath)
				console.log(`  ✓ ${filename}`)
			} catch (err) {
				console.error(`  ✗ ${filename}: ${err.message}`)
			}
		})
	)

	await writeFile(OUTPUT_FILE, JSON.stringify(placeholders, null, 2), "utf-8")
	console.log(`\n✅ Placeholders saved to ${OUTPUT_FILE}`)
}

main().catch((err) => {
	console.error("Fatal error:", err)
	process.exit(1)
})
