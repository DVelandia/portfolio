interface PublicProfile {
	fullName: string
	givenName: string
	familyName: string
	additionalName: string
	siteUrl: string
	defaultImageUrl: string
	twitterHandle: string
	contact: {
		email: string
		resumePaths: Record<ResumeLocale, string>
	}
	social: {
		linkedin: string
		github: string
	}
	location: {
		locality: string
		region: string
		country: string
	}
	organizations: {
		worksFor: string
		alumniOf: string[]
	}
	skills: string[]
}

type ResumeLocale = "es" | "en"

export const publicProfile: PublicProfile = {
	fullName: "Daniel Velandia",
	givenName: "Daniel",
	familyName: "Velandia",
	additionalName: "DVelandia",
	siteUrl: "https://daniel.velandia.dev/",
	defaultImageUrl: "https://daniel.velandia.dev/og.png",
	twitterHandle: "@dvelandia",
	contact: {
		email: "dfvf03@gmail.com",
		resumePaths: {
			es: "/daniel-velandia-cv-es.pdf",
			en: "/daniel-velandia-cv-en.pdf",
		},
	},
	social: {
		linkedin: "https://www.linkedin.com/in/dvelandia",
		github: "https://github.com/dvelandia",
	},
	location: {
		locality: "Chiquinquirá",
		region: "Boyacá",
		country: "Colombia",
	},
	organizations: {
		worksFor: "Davinci Technologies LATAM",
		alumniOf: ["UNISANGIL", "Platzi", "Google Cloud Skills Boost"],
	},
	skills: [
		"Software Engineering",
		"Enterprise web platforms",
		"Enterprise integrations",
		"Google Cloud Platform (GCP)",
		"Applied AI automation",
		"TypeScript",
		"Angular",
		"Node.js",
		"Express",
		"NestJS",
		"Drupal",
		"WordPress",
		"PHP",
		"MySQL",
		"Docker",
		"Git",
		"CI/CD",
		"Technical SEO",
		"Security hardening",
	],
}

export function getResumePath(currentLocale?: string) {
	const locale: ResumeLocale = currentLocale === "en" ? "en" : "es"

	return publicProfile.contact.resumePaths[locale]
}

export function toPublicUrl(path: string) {
	return new URL(path, publicProfile.siteUrl).href
}
