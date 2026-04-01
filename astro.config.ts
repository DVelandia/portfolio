import sitemap from "@astrojs/sitemap"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from "astro/config"
import { seoConfig } from "./src/utils/seoConfig"

// https://astro.build/config
export default defineConfig({
	integrations: [sitemap()],
	output: "static",
	site: seoConfig.baseURL,
	vite: {
		plugins: [tailwindcss()],
	},
	i18n: {
		defaultLocale: "es",
		locales: ["es", "en"],
		routing: {
			prefixDefaultLocale: false,
		},
	},
})
