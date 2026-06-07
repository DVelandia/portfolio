import { defineCollection } from "astro:content"
import { z } from "astro/zod"
import experiencesSource from "./content/experience.json"
import projectsSource from "./content/projects.json"
import stackSource from "./content/stack.json"

const locales = ["es", "en"] as const
const projectRoles = ["FullStack", "FrontEnd"] as const
const projectImages = ["brinsa.webp", "colserauto.webp", "credicorp.webp", "filmmia.webp"] as const
const iconNames = [
	"AdobeXD",
	"Angular",
	"Anthropic",
	"Astro",
	"AWS",
	"Azure",
	"Bootstrap",
	"Code",
	"Cypress",
	"Dart",
	"DocuSign",
	"Docker",
	"Drupal",
	"Express",
	"Figma",
	"Firebase",
	"Flutter",
	"GCP",
	"Gemini",
	"Git",
	"JavaScript",
	"JQuery",
	"MCP",
	"MongoDB",
	"MySQL",
	"NestJS",
	"NodeJS",
	"OpenAI",
	"Pantheon",
	"PHP",
	"Playwright",
	"Pnpm",
	"PostgreSQL",
	"Sass",
	"Tailwind",
	"TensorFlow",
	"TypeScript",
	"Vite",
	"Vitest",
	"Vue",
	"WordPress",
] as const
const combiningMarksRegex = /[\u0300-\u036F]/g
const nonAlphaNumericRegex = /[^a-z0-9]+/g
const trimmedDashesRegex = /(^-|-$)/g
const hexColorRegex = /^#[\da-f]{6}$/i

type Locale = (typeof locales)[number]

type ProjectSourceEntry = (typeof projectsSource)[Locale][number]
type ExperienceSourceEntry = (typeof experiencesSource)[Locale][number]

const slugify = (value: string) =>
	value
		.toLowerCase()
		.normalize("NFD")
		.replace(combiningMarksRegex, "")
		.replace(nonAlphaNumericRegex, "-")
		.replace(trimmedDashesRegex, "")

const projects = defineCollection({
	loader: () =>
		locales.flatMap((locale) =>
			projectsSource[locale].map((project: ProjectSourceEntry, order) => ({
				id: `${locale}-${slugify(project.title)}`,
				locale,
				order,
				...project,
			}))
		),
	schema: z
		.object({
			locale: z.enum(locales),
			order: z.number().int().nonnegative(),
			title: z.string(),
			description: z.string(),
			visibility: z.enum(["public", "private"]).default("public"),
			role: z.enum(projectRoles).optional(),
			link: z.string().optional(),
			descriptionImage: z.string(),
			image: z.enum(projectImages),
			tags: z.array(
				z.object({
					icon: z.enum(iconNames),
				})
			),
		})
		.superRefine(({ visibility, link }, ctx) => {
			if (visibility === "public" && !link) {
				ctx.addIssue({
					code: "custom",
					message: "Public projects must include a valid link.",
					path: ["link"],
				})
			}

			if (link) {
				const result = z.url().safeParse(link)
				if (!result.success) {
					ctx.addIssue({
						code: "custom",
						message: "Project link must be a valid URL when provided.",
						path: ["link"],
					})
				}
			}
		}),
})

const experience = defineCollection({
	loader: () =>
		locales.flatMap((locale) =>
			experiencesSource[locale].map((entry: ExperienceSourceEntry, order) => ({
				id: `${locale}-${slugify(`${entry.title}-${entry.company}-${order + 1}`)}`,
				locale,
				order,
				...entry,
			}))
		),
	schema: z.object({
		locale: z.enum(locales),
		order: z.number().int().nonnegative(),
		icon: z.enum(iconNames),
		title: z.string(),
		link: z.url().optional(),
		company: z.string(),
		date: z.string(),
		bullets: z.array(z.string()).optional(),
		tags: z.array(z.object({ icon: z.enum(iconNames) })).optional(),
	}),
})

const stack = defineCollection({
	loader: () =>
		Object.entries(stackSource).map(([id, entry], order) => ({
			id,
			order,
			...entry,
		})),
	schema: z.object({
		order: z.number().int().nonnegative(),
		icons: z.array(z.enum(iconNames)),
		gradient: z.object({
			light: z.tuple([z.string().regex(hexColorRegex), z.string().regex(hexColorRegex)]),
			dark: z.tuple([z.string().regex(hexColorRegex), z.string().regex(hexColorRegex)]),
		}),
	}),
})

export const collections = { projects, experience, stack }
