import { createHash } from "node:crypto"
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs"
import { join, relative, resolve } from "node:path"
import { exit } from "node:process"

const checkOnly = process.argv.includes("--check")
const rootDir = process.cwd()
const distDir = resolve(rootDir, "dist")
const vercelConfigPath = resolve(rootDir, "vercel.json")
const scriptSrcPattern = /script-src\s+([^;]+)/
const inlineScriptPattern = /<script(?![^>]*\ssrc=)(?:\s[^>]*)?>([\s\S]*?)<\/script>/g
const whitespacePattern = /\s+/

function listHtmlFiles(dir) {
	return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
		const path = join(dir, entry.name)

		if (entry.isDirectory()) {
			return listHtmlFiles(path)
		}

		return entry.isFile() && entry.name.endsWith(".html") ? [path] : []
	})
}

function hashInlineScripts(html) {
	return Array.from(
		html.matchAll(inlineScriptPattern),
		([, content]) => `sha256-${createHash("sha256").update(content).digest("base64")}`
	)
}

function getInlineScriptHashes() {
	if (!existsSync(distDir)) {
		throw new Error("Missing dist/. Run pnpm build before updating or checking CSP hashes.")
	}

	const hashes = new Set()
	for (const file of listHtmlFiles(distDir)) {
		const html = readFileSync(file, "utf8")
		for (const hash of hashInlineScripts(html)) {
			hashes.add(hash)
		}
	}

	return [...hashes].sort()
}

function getCspHeader(config) {
	const globalHeaders = config.headers?.find((entry) => entry.source === "/(.*)")?.headers
	const cspHeader = globalHeaders?.find((header) => header.key === "Content-Security-Policy")

	if (!cspHeader) {
		throw new Error("Could not find the global Content-Security-Policy header in vercel.json.")
	}

	return cspHeader
}

function updateScriptSrc(csp, hashes) {
	const hashSources = hashes.map((hash) => `'${hash}'`).join(" ")

	return csp.replace(scriptSrcPattern, (_directive, sources) => {
		const stableSources = sources
			.split(whitespacePattern)
			.filter((source) => source && !source.startsWith("'sha256-"))
			.join(" ")

		return `script-src ${stableSources}${hashSources ? ` ${hashSources}` : ""}`
	})
}

const config = JSON.parse(readFileSync(vercelConfigPath, "utf8"))
const cspHeader = getCspHeader(config)
const hashes = getInlineScriptHashes()
const nextCsp = updateScriptSrc(cspHeader.value, hashes)

if (cspHeader.value === nextCsp) {
	console.log(`CSP hashes are up to date (${hashes.length} inline script hash(es)).`)
	exit(0)
}

if (checkOnly) {
	console.error("CSP hashes are out of date. Run pnpm csp:update after pnpm build.")
	console.error(`Expected hashes: ${hashes.join(", ")}`)
	exit(1)
}

cspHeader.value = nextCsp
writeFileSync(vercelConfigPath, `${JSON.stringify(config, null, 2)}\n`)
console.log(`Updated ${relative(rootDir, vercelConfigPath)} with ${hashes.length} CSP hash(es).`)
