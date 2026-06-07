/* eslint-disable test/no-import-node-test */
import assert from "node:assert/strict"
import { createHash } from "node:crypto"
import { access, readdir, readFile } from "node:fs/promises"
import { resolve } from "node:path"
import test from "node:test"

const distDir = resolve(process.cwd(), "dist")
const rootDir = process.cwd()
const inlineScriptPattern = /<script(?![^>]*\ssrc=)(?:\s[^>]*)?>([\s\S]*?)<\/script>/g
const jsonLdPattern = /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g

async function readOutput(relativePath) {
	const filePath = resolve(distDir, relativePath)
	await access(filePath)
	return readFile(filePath, "utf8")
}

async function listHtmlOutputs(dir = distDir) {
	const entries = await readdir(dir, { withFileTypes: true })
	const files = await Promise.all(
		entries.map(async (entry) => {
			const filePath = resolve(dir, entry.name)

			if (entry.isDirectory()) {
				return listHtmlOutputs(filePath)
			}

			return entry.isFile() && entry.name.endsWith(".html") ? [filePath] : []
		})
	)

	return files.flat()
}

function getInlineScriptHashes(html) {
	return Array.from(
		html.matchAll(inlineScriptPattern),
		([, content]) => `sha256-${createHash("sha256").update(content).digest("base64")}`
	)
}

async function getVercelCsp() {
	const vercelConfig = JSON.parse(await readFile(resolve(rootDir, "vercel.json"), "utf8"))
	const globalHeaders = vercelConfig.headers.find((entry) => entry.source === "/(.*)")?.headers
	const csp = globalHeaders?.find((header) => header.key === "Content-Security-Policy")?.value

	assert.ok(csp, "Expected a global Content-Security-Policy header")

	return csp
}

test("build outputs the Spanish homepage", async () => {
	const html = await readOutput("index.html")

	assert.match(html, /<html lang="es">/)
	assert.match(html, /href="\/#about"/)
	assert.match(html, /Daniel Velandia/)
	assert.match(html, /hreflang="en" href="https:\/\/daniel\.velandia\.dev\/en\/"/)
	assert.match(html, /href="\/en\/" lang="en" hreflang="en"/)
})

test("build outputs the English homepage", async () => {
	const html = await readOutput("en/index.html")

	assert.match(html, /<html lang="en">/)
	assert.match(html, /href="\/en\/#projects"/)
	assert.match(html, /All rights reserved\./)
	assert.match(html, /hreflang="es" href="https:\/\/daniel\.velandia\.dev\/"/)
	assert.match(html, /href="\/" lang="es" hreflang="es"/)
})

test("build outputs a noindex 404 page", async () => {
	const html = await readOutput("404.html")

	assert.match(html, /<html lang="es" dir="ltr">/)
	assert.match(html, /noindex, nofollow/)
	assert.match(html, /href="\/"/)
	assert.match(html, /ERROR 404/)
})

test("build does not reference public script files", async () => {
	for (const htmlFile of await listHtmlOutputs()) {
		const html = await readFile(htmlFile, "utf8")

		assert.doesNotMatch(html, /\/scripts\/[\w.-]+\.js/)
	}
})

test("public does not contain JavaScript or CSS application code", async () => {
	const publicDir = resolve(rootDir, "public")
	const forbiddenExtensions = new Set([".css", ".js", ".mjs", ".ts"])
	const entries = await readdir(publicDir, { recursive: true, withFileTypes: true })
	const codeFiles = []

	for (const entry of entries) {
		if (!entry.isFile()) {
			continue
		}

		const extension = entry.name.slice(entry.name.lastIndexOf("."))

		if (forbiddenExtensions.has(extension)) {
			codeFiles.push(entry.name)
		}
	}

	assert.deepEqual(codeFiles, [])
})

test("interactive scripts are emitted as hashed Astro assets", async () => {
	const html = await readOutput("index.html")

	assert.match(html, /src="\/_astro\/theme-toggle\.[\w-]+\.js"/)
	assert.match(html, /src="\/_astro\/header\.[\w-]+\.js"/)
})

test("homepages include core SEO metadata and valid structured data", async () => {
	const html = await readOutput("index.html")
	const jsonLdScripts = Array.from(html.matchAll(jsonLdPattern), ([, content]) =>
		JSON.parse(content)
	)
	const personSchema = jsonLdScripts.find((schema) => schema["@type"] === "Person")

	assert.match(html, /<link rel="canonical" href="https:\/\/daniel\.velandia\.dev\/">/)
	assert.match(html, /<meta property="og:type" content="website">/)
	assert.match(html, /<meta property="og:locale" content="es_CO">/)
	assert.match(html, /<meta property="og:locale:alternate" content="en_US">/)
	assert.match(html, /<meta name="twitter:card" content="summary_large_image">/)
	assert.ok(personSchema, "Expected a Person JSON-LD schema")
	assert.equal(personSchema.name, "Daniel Velandia")
	assert.equal(personSchema.url, "https://daniel.velandia.dev/")
	assert.ok(
		Array.isArray(personSchema.sameAs) && personSchema.sameAs.length > 0,
		"Expected social profile URLs in sameAs"
	)
})

test("robots.txt allows crawling and points to the sitemap index", async () => {
	const robots = await readOutput("robots.txt")

	assert.match(robots, /User-agent: \*/)
	assert.match(robots, /Allow: \//)
	assert.match(robots, /Sitemap: https:\/\/daniel\.velandia\.dev\/sitemap-index\.xml/)
})

test("sitemap exposes localized indexable pages", async () => {
	const sitemapIndex = await readOutput("sitemap-index.xml")
	const sitemap = await readOutput("sitemap-0.xml")

	assert.match(sitemapIndex, /https:\/\/daniel\.velandia\.dev\/sitemap-0\.xml/)
	assert.match(sitemap, /<loc>https:\/\/daniel\.velandia\.dev\/<\/loc>/)
	assert.match(sitemap, /<loc>https:\/\/daniel\.velandia\.dev\/en\/<\/loc>/)
	assert.doesNotMatch(sitemap, /404/)
})

test("CSP includes every inline script hash generated by the build", async () => {
	const csp = await getVercelCsp()
	const expectedHashes = new Set()

	for (const htmlFile of await listHtmlOutputs()) {
		const html = await readFile(htmlFile, "utf8")

		for (const hash of getInlineScriptHashes(html)) {
			expectedHashes.add(hash)
		}
	}

	for (const hash of expectedHashes) {
		assert.match(csp, new RegExp(`'${hash.replaceAll("+", "\\+")}'`))
	}
})

test("project image assets referenced by content exist", async () => {
	const projects = JSON.parse(await readFile(resolve(rootDir, "src/content/projects.json"), "utf8"))
	const projectImages = new Set(
		Object.values(projects)
			.flat()
			.map((project) => project.image)
	)

	for (const image of projectImages) {
		await access(resolve(rootDir, "src/assets/projects", image))
	}
})

test("homepages include font preload link for Onest Variable", async () => {
	for (const path of ["index.html", "en/index.html"]) {
		const html = await readOutput(path)

		assert.match(
			html,
			/<link rel="preload" as="font" type="font\/woff2"[^>]+onest-latin-wght-normal[^>]+>/,
			`Expected Onest Variable font preload in ${path}`
		)
	}
})

test("all target=_blank links have rel=noopener noreferrer", async () => {
	const extLinkPattern = /<a[^>]+target="_blank"[^>]*>/g

	for (const htmlFile of await listHtmlOutputs()) {
		const html = await readFile(htmlFile, "utf8")
		const externalLinks = Array.from(html.matchAll(extLinkPattern), ([match]) => match)

		for (const link of externalLinks) {
			const relMatch = link.match(/rel="([^"]*)"/)
			const rel = relMatch?.[1] ?? ""

			assert.ok(
				rel.includes("noopener"),
				`Link missing noopener in ${htmlFile.replace(distDir, "dist")}: ${link.slice(0, 120)}`
			)
			assert.ok(
				rel.includes("noreferrer"),
				`Link missing noreferrer in ${htmlFile.replace(distDir, "dist")}: ${link.slice(0, 120)}`
			)
		}
	}
})
