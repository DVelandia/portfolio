# SEO reference: meta tags and structured data

Adapted from addyosmani/web-quality-skills (`seo`), MIT license. Trimmed to what a static, bilingual personal site
can use. Load this file from `SKILL.md` only when you need the exact tag list, length rules or a JSON-LD example.

## Contents

- [Head tag checklist](#head-tag-checklist)
- [Title and description rules](#title-and-description-rules)
- [Canonical, robots and hreflang](#canonical-robots-and-hreflang)
- [Open Graph and X cards](#open-graph-and-x-cards)
- [Headings, images and links](#headings-images-and-links)
- [Structured data (JSON-LD)](#structured-data-json-ld)
- [Validation tools](#validation-tools)

## Head tag checklist

All of these are rendered by `src/components/seo/SEO.astro` + `src/layouts/Layout.astro`; the list is here to
check the built HTML against, not to copy into components.

| Tag                                                   | Required | Notes                                            |
| ----------------------------------------------------- | -------- | ------------------------------------------------ |
| `<title>`                                             | yes      | unique per page, 50-60 chars                     |
| `<meta name="description">`                           | yes      | unique per page, 150-160 chars                   |
| `<meta name="viewport" content="width=device-width, initial-scale=1">` | yes | mobile-friendly audit             |
| `<meta charset="UTF-8">`                              | yes      | first tag in `<head>`                            |
| `<link rel="canonical">`                              | yes      | absolute, self-referencing                       |
| `<meta name="robots">`                                | yes      | `index, follow`; `noindex, nofollow` on 404      |
| `<link rel="alternate" hreflang="...">`               | yes      | `es`, `en`, `x-default`; symmetric per locale    |
| `<html lang="es|en">`                                 | yes      | matches locale                                   |
| `<meta name="author">`                                | optional | `publicProfile.fullName`                         |
| `<meta name="theme-color">`                           | optional | mirrors `dark-50` / `dark-950` tokens            |
| `<link rel="icon">`, `<link rel="apple-touch-icon">`  | yes      | `public/favicon.ico`, `public/img/icons/`        |
| `<meta name="generator">`                             | no       | intentionally omitted in this repo               |

## Title and description rules

- Title: primary keyword first ("Daniel Velandia | Ingeniero de Software Full-Stack"), brand/name at the end
  unless it is the home page, no keyword stuffing, no duplicates across `/`, `/en/`, about pages and 404.
- Description: a sentence that matches the page content and invites the click; include the role, stack and
  location once. Google rewrites descriptions that do not match the content.
- Keep both in `src/i18n/{es,en}.json` (`seo.*`) or in the page frontmatter for the about pages; never in
  components.

## Canonical, robots and hreflang

```html
<link rel="canonical" href="https://daniel.velandia.dev/en/" />
<meta name="robots" content="index, follow" />
<meta name="robots" content="noindex, nofollow" /> <!-- 404 and utility pages only -->
<link rel="alternate" hreflang="es" href="https://daniel.velandia.dev/" />
<link rel="alternate" hreflang="en" href="https://daniel.velandia.dev/en/" />
<link rel="alternate" hreflang="x-default" href="https://daniel.velandia.dev/" />
```

- Every page must link to itself and to its translation; `x-default` points to the Spanish (default) URL.
- Canonical and hreflang URLs must be absolute, with trailing slash, same as the sitemap entries.
- `public/robots.txt` stays `Allow: /` plus the `Sitemap:` line; there is nothing private to block.

## Open Graph and X cards

```html
<meta property="og:type" content="website" />
<meta property="og:title" content="..." />
<meta property="og:description" content="..." />
<meta property="og:url" content="https://daniel.velandia.dev/" />
<meta property="og:site_name" content="Portfolio de Daniel Velandia" />
<meta property="og:locale" content="es_CO" />
<meta property="og:locale:alternate" content="en_US" />
<meta property="og:image" content="https://daniel.velandia.dev/og.png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:alt" content="..." />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:site" content="@handle" />
<meta name="twitter:title" content="..." />
<meta name="twitter:description" content="..." />
<meta name="twitter:image" content="https://daniel.velandia.dev/og.png" />
```

OG image: 1200x630 PNG, under 1 MB, text readable at thumbnail size. Regenerate with `pnpm generate:og`.

## Headings, images and links

- One `<h1>` per page (hero `AboutMe.astro` on the home; `<header>` of the article on about pages); sections
  use `<h2>` via `SectionContainer.astro`; do not skip levels.
- Images: `alt` describes the content ("Captura de la app X mostrando el panel Y"), never the filename;
  decorative SVGs get `aria-hidden="true"` and empty `alt`. Project images come from `descriptionImage`.
- Links: descriptive text, internal links to `/#projects`, `/#experience`, about pages; external links need
  `rel="noopener noreferrer"` and the `sr-only` "new tab" label.
- URLs: lowercase, hyphenated, short (`/sobre-daniel-velandia/`, `/en/about-daniel-velandia/`).

## Structured data (JSON-LD)

The site emits `Person`, `WebSite` and `ProfilePage` from `RichResults.astro`, built from `publicProfile.ts`
and the `richResults` i18n keys. Use `@id` to link entities instead of duplicating them.

```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": "https://daniel.velandia.dev#person",
  "name": "Daniel Velandia",
  "url": "https://daniel.velandia.dev",
  "image": "https://daniel.velandia.dev/og.png",
  "jobTitle": "Ingeniero de Software Full-Stack",
  "sameAs": ["https://www.linkedin.com/in/...", "https://github.com/..."],
  "address": { "@type": "PostalAddress", "addressLocality": "...", "addressCountry": "CO" },
  "knowsLanguage": ["es", "en"]
}
```

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://daniel.velandia.dev#website",
  "name": "Portfolio de Daniel Velandia",
  "url": "https://daniel.velandia.dev",
  "inLanguage": ["es", "en"],
  "author": { "@id": "https://daniel.velandia.dev#person" }
}
```

```json
{
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  "mainEntity": { "@id": "https://daniel.velandia.dev#person" },
  "inLanguage": "es",
  "url": "https://daniel.velandia.dev/"
}
```

Optional additions if the site grows:

- `BreadcrumbList` for the about pages (`Home > Sobre Daniel Velandia`), `itemListElement` with `position`,
  `name`, `item`.
- `Article` / `BlogPosting` only if a blog is added (`headline`, `datePublished`, `dateModified`, `author`
  with `@id` of the Person, `image`).
- Do not add `Organization`, `Product`, `FAQPage` or `AggregateRating`: there is no company, product, FAQ or
  reviews, and Google penalises schema that does not match visible content.

Remember: inline JSON-LD is hashed by the CSP. After any change run `pnpm build && pnpm csp:update`.

## Validation tools

| Tool                                                    | Use                                   |
| ------------------------------------------------------- | ------------------------------------- |
| `pnpm test:smoke`                                       | canonical, hreflang, robots, JSON-LD  |
| `pnpm test:lighthouse`                                  | Lighthouse SEO category (>= 0.9)      |
| https://validator.schema.org/                           | JSON-LD syntax and vocabulary         |
| https://search.google.com/test/rich-results             | eligibility for rich results          |
| Google Search Console                                   | indexing, hreflang and crawl errors   |
| https://developers.google.com/search/docs               | source guidelines                     |
