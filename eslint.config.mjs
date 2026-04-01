import antfu from "@antfu/eslint-config"
import eslintConfigPrettier from "eslint-config-prettier/flat"

export default antfu(
	{
		astro: true,
		ignores: ["dist", ".astro", ".vercel", "public", "src/data/**/*.json"],
		jsonc: false,
		lessOpinionated: true,
		stylistic: false,
		yaml: false,
	},
	{
		rules: {
			"antfu/consistent-list-newline": "off",
			"antfu/if-newline": "off",
			"no-undef": "off",
			"node/prefer-global/process": "off",
			"perfectionist/sort-imports": "off",
			"perfectionist/sort-named-imports": "off",
			"unused-imports/no-unused-imports": "warn",
		},
	},
	{
		files: ["**/*.astro"],
		rules: {
			"astro/no-conflict-set-directives": "warn",
			"astro/no-unused-css-selector": "off",
			"astro/no-unused-define-vars-in-style": "warn",
			"astro/prefer-class-list-directive": "warn",
		},
	},
	eslintConfigPrettier
)
