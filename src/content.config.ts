import { defineCollection } from "astro:content"
import { z } from "astro/zod"
import experiencesSource from "./data/experience.json"
import projectsSource from "./data/projects.json"
import stackSource from "./data/stack.json"

const locales = ["es", "en"] as const
const combiningMarksRegex = /[\u0300-\u036F]/g
const nonAlphaNumericRegex = /[^a-z0-9]+/g
const trimmedDashesRegex = /(^-|-$)/g

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
	schema: z.object({
		locale: z.enum(locales),
		order: z.number().int().nonnegative(),
		title: z.string(),
		description: z.string(),
		link: z.url(),
		descriptionImage: z.string(),
		image: z.string(),
		tags: z.array(
			z.object({
				icon: z.string(),
			})
		),
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
		icon: z.string(),
		title: z.string(),
		link: z.url().optional(),
		company: z.string(),
		date: z.string(),
		description: z.string(),
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
		icons: z.array(z.string()),
		gradient: z.object({
			light: z.tuple([z.string(), z.string()]),
			dark: z.tuple([z.string(), z.string()]),
		}),
	}),
})

export const collections = { projects, experience, stack }
