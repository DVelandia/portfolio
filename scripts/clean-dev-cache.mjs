import { rm } from "node:fs/promises"
import { resolve } from "node:path"

const cachePaths = [".astro", "node_modules/.vite"]

await Promise.all(
	cachePaths.map(async (cachePath) => {
		const absolutePath = resolve(process.cwd(), cachePath)

		await rm(absolutePath, { force: true, recursive: true })
		console.log(`Removed ${cachePath}`)
	})
)
