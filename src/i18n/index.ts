import english from "@/i18n/en.json"
import spanish from "@/i18n/es.json"

const DEFAULT_LOCALE = "es"

const translations = {
	en: english,
	es: spanish,
} satisfies Record<string, typeof spanish>

type Locale = keyof typeof translations

export type I18NDictionary = (typeof translations)[typeof DEFAULT_LOCALE]

export const getI18N = ({
	currentLocale = DEFAULT_LOCALE,
}: {
	currentLocale?: string
}): I18NDictionary => translations[currentLocale as Locale] ?? translations[DEFAULT_LOCALE]

/** Normalizes Astro's `currentLocale` to a type-safe locale string. */
export const getLocale = (currentLocale?: string): Locale =>
	(currentLocale as Locale) in translations ? (currentLocale as Locale) : DEFAULT_LOCALE
