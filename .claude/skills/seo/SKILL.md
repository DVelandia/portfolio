---
name: seo
description: Audit and fix technical/on-page SEO of this static Astro portfolio (meta tags, Open Graph, canonical, hreflang, sitemap, robots, JSON-LD structured data, Lighthouse SEO score). Use when asked to "improve SEO", "mejora el SEO", "revisa el SEO", "fix meta tags", "add structured data", "rich results", "schema.org", "sitemap", "canonical", "hreflang", "Open Graph", "lighthouse seo" or "search engine optimization".
license: MIT. Adapted from addyosmani/web-quality-skills (seo), author web-quality-skills.
metadata:
  author: web-quality-skills (adapted for portfolio-dvelandia)
  version: "1.1-portfolio"
---

# SEO (static Astro site)

Scope: technical and on-page SEO for a static, bilingual (es/en) Astro site with no backend, no blog and no
forms. Content quality and backlinks are out of scope. Read `references/meta-and-structured-data.md` only when
you need the full meta tag list, title/description length rules or a JSON-LD example to add or extend a schema.

## Where SEO lives in this repo

| Concern                                   | File                                                                    |
| ----------------------------------------- | ----------------------------------------------------------------------- |
| `<title>`, description, canonical, OG/X   | `src/components/seo/SEO.astro` (props from `Layout.astro`)              |
| `hreflang` alternates                     | `src/layouts/Layout.astro` (`alternateLinks` prop, auto es/en/x-default) |
| JSON-LD (Person, WebSite, ProfilePage)    | `src/components/seo/RichResults.astro` + i18n `richResults` keys        |
| Personal data, URLs, social `sameAs`      | `src/data/publicProfile.ts` (single source of truth)                   |
| Page copy for title/description           | `src/i18n/{es,en}.json` `seo.*` (home, 404) or inline in about pages   |
| Sitemap                                   | `@astrojs/sitemap` in `astro.config.ts` (i18n aware); no manual XML     |
| `robots.txt`, `og.png` (1200x630), favicon | `public/`                                                               |
| Security headers / cache                  | `vercel.json`                                                           |
| Lighthouse SEO threshold (>= 0.9)         | `lighthouserc.json` (`pnpm test:lighthouse`)                            |

## Audit checklist

Go through the built HTML (`dist/index.html`, `dist/en/index.html`, about pages, `404.html`):

- Head: one `<title>` (50-60 chars, unique per page), one `meta[name=description]` (150-160 chars, unique),
  `<link rel="canonical">` absolute and self-referencing, `meta[name=robots]` is `index, follow` except 404
  (`noindex`).
- i18n: `<html lang>` matches the locale; `hreflang` for `es`, `en` and `x-default` point to absolute URLs and
  the pair is symmetric between the two locales; `og:locale` / `og:locale:alternate` match.
- Social: `og:title`, `og:description`, `og:url`, `og:image` (+ width/height/alt), `twitter:card`.
- Structured data: every JSON-LD block parses, `@id` of `Person` and `WebSite` are consistent, `sameAs` URLs
  are live, `jobTitle` / `description` translated per locale.
- Content: exactly one `<h1>` per page, no skipped heading levels, descriptive link text (no "click here"),
  every `<img>` has meaningful `alt` (projects: `descriptionImage` in `projects.json`).
- Crawl: `public/robots.txt` allows `/` and points to `/sitemap-index.xml`; sitemap lists every indexable page
  in both locales and nothing `noindex`.
- Mobile: `meta[name=viewport]` present, text readable without zoom, tap targets >= 24px (see accessibility skill).

## How to verify

```bash
pnpm build                       # dist/ is the source of truth for the audit
pnpm test:smoke                  # asserts canonical, hreflang, robots, sitemap, JSON-LD validity, OG tags
pnpm test:lighthouse             # Lighthouse CI on / and /en/ (SEO category must score >= 0.9)
```

- Inspect head tags: `grep -o '<meta[^>]*>' dist/index.html` or open `dist/**/*.html` directly.
- Validate JSON-LD: paste the `<script type="application/ld+json">` into https://validator.schema.org/ and
  https://search.google.com/test/rich-results (Person / ProfilePage).
- Preview social cards with the OG image at `https://daniel.velandia.dev/og.png`.

## How to fix (Astro)

- Title/description of a page: pass `title` / `description` to `<Layout>`; for the home and 404 edit the `seo`
  keys in BOTH `src/i18n/es.json` and `en.json` (`es.json` is the type reference, keep structures equal).
- New page: create `src/pages/<slug>.astro` AND `src/pages/en/<slug>.astro`, render through `Layout`, and pass
  explicit `alternateLinks` when the slugs differ per language (see `sobre-daniel-velandia.astro`). The sitemap
  picks it up automatically on build; add `robots="noindex, nofollow"` only for utility pages.
- Canonical: only override `canonical` when the page is a duplicate of another; default is the current path.
- Structured data: extend the objects in `RichResults.astro`, read strings from `richResults` i18n keys and
  data from `publicProfile.ts`. Never hardcode personal data in the component.
- After touching `RichResults.astro`, `publicProfile.ts`, the `richResults` i18n copy or any inline script, run
  `pnpm build && pnpm csp:update` and commit `vercel.json` (inline JSON-LD is hashed by the CSP). `pnpm test`
  fails otherwise.
- OG image change: replace `public/og.png` keeping 1200x630 (`pnpm generate:og` regenerates it) and update
  `seo.og_image_alt` in both locales.
- Do not add `meta[name=generator]` (intentionally omitted), SSR, client-side routing hacks, or a manual
  `sitemap.xml`.

## Report format

List findings grouped as Critical (indexing/canonical/hreflang/duplicates), High (title/description/OG/JSON-LD),
Medium (headings/alt/links), each with file + fix. Then apply the fixes and show the verification output.
