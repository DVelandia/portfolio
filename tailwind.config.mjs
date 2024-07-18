/** @type {import('tailwindcss').Config} */
export default {
	content: ["./src/**/*.{astro,html,js,jsx,md,mdx,ts}"],
	theme: {
		extend: {
			colors: {
				primary: {
					50: "#effaff",
					200: "#b6eaff",
					400: "#2cc9ff",
					500: "#00a8e8",
					600: "#008fd4",
					700: "#0072ab",
					950: "#04334d",
				},
				daintree: {
					200: "#99ffff",
					300: "#54fbff",
					700: "#0082a1",
					800: "#005d74",
				},
				crusta: {
					300: "#ffb272",
					700: "#c53509",
					800: "#9c2b10",
				},
				dark: {
					50: "#f8fafc",
					100: "#f1f5f9",
					200: "#e2e8f0",
					300: "#cbd5e1",
					400: "#94a3b8",
					700: "#334155",
					800: "#1e293b",
					900: "#0f172a",
					950: "#020617",
				},
			},
		},
	},
	darkMode: "class",
	plugins: [],
}
