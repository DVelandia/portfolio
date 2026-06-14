import sitemap from "@astrojs/sitemap"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from "astro/config"
import { publicProfile } from "./src/data/publicProfile"

// https://astro.build/config
export default defineConfig({
	integrations: [
		sitemap({
			i18n: {
				defaultLocale: "es",
				locales: { es: "es", en: "en" },
			},
		}),
	],
	output: "static",
	site: publicProfile.siteUrl,
	image: {
		layout: "constrained",
		responsiveStyles: true,
	},
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
