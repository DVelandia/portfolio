# Portfolio — DVelandia

Personal portfolio of Daniel Velandia (https://daniel.velandia.dev/). Static Astro 6 site (`output: "static"`), Tailwind CSS v4, TypeScript strict, bilingual ES/EN, strict CSP, deployed to Vercel.

## Commands

```bash
pnpm dev              # Dev server on localhost:4321
pnpm dev:clean        # Clear Astro/.vite cache, then dev (use on stale-dependency errors)
pnpm build            # Static build -> dist/
pnpm check            # astro check + tsc --noEmit
pnpm lint             # ESLint (pnpm lint:fix to auto-fix)
pnpm format:check     # Prettier check (pnpm format to write)
pnpm test             # build -> csp:check -> smoke tests (tests/smoke, node --test)
pnpm test:e2e         # Playwright (builds + previews on 127.0.0.1:4321 itself; chromium + mobile)
pnpm test:lighthouse  # Lighthouse CI against dist/ (needs a prior build)
pnpm csp:update       # Rewrite inline-script SHA-256 hashes in vercel.json (needs dist/)
pnpm csp:check        # Fail if vercel.json hashes don't match dist/
pnpm generate:blur    # Regenerate src/data/blur-placeholders.json from src/assets/projects/
```

- pnpm only (`packageManager: pnpm@10.33.0`), Node >= 22.12.0. Never add npm/yarn lockfiles.
- Pre-commit runs lint-staged (prettier + eslint --fix). Pre-push runs `format:check`, `lint`, `check`.
- CI (`.github/workflows/ci.yml`): format:check, lint, check, test, test:e2e.
- Deploy: push to `master` deploys to Vercel production via the Vercel CLI in CI (Vercel Git auto-deploy is disabled), then runs Lighthouse. PRs get a preview deploy (`vercel-preview.yml`).

## Map

- `src/pages/` — `index.astro` (ES, no prefix) and `en/index.astro` both render `components/pages/AppPage.astro`; locale comes from `Astro.currentLocale`.
  Also `sobre-daniel-velandia.astro` / `en/about-daniel-velandia.astro` (standalone SEO pages) and `404.astro`.
- `src/content/*.json` + `src/content.config.ts` — content collections (projects, experience, stack) validated with Zod enums (`iconNames`, `projectImages`, `projectRoles`).
- `src/i18n/{es,en}.json` + `index.ts` — UI strings via `getI18N({ currentLocale })`; `getLocale()` normalizes the locale.
- `src/data/publicProfile.ts` — single source of truth for personal data, URLs, social links, resume paths.
- `src/components/seo/` — `SEO.astro` (meta tags), `RichResults.astro` (JSON-LD from `publicProfile` + `richResults` i18n keys).
- `src/components/ui/Icon.astro` — loads `src/icons/*.astro` by name via `import.meta.glob`; unknown names render a 2-letter placeholder instead of failing.
- `src/scripts/*.ts` — client scripts bundled by Astro; `theme-init.ts` is inlined raw in `<head>` by `layouts/Layout.astro` (no FOUC).
- `src/styles/global.css` — Tailwind `@import`, `@theme` tokens, fonts, global CSS.
- `scripts/` — Node utilities (CSP hashes, blur placeholders, OG image, dev cache).
- `vercel.json` — security headers (global CSP) and per-route cache policies.

## Content & i18n

- `projects.json` and `experience.json` are keyed by locale (`es` / `en`): always update both arrays together. Order on the page = array order.
- `stack.json` is locale-agnostic; category labels live in `i18n.technologies.categories.<id>`.
- `es.json` is the type reference for translations (`typeof spanish`): `en.json` must keep the same structure.
- No hardcoded UI strings in components; add keys to both i18n files. (Exception today: the two "about" pages carry their copy inline.)
- Icons used from content JSON must exist in `src/icons/` AND be listed in `iconNames` in `content.config.ts`, or `pnpm check`/build fails.
- `src/data/blur-placeholders.json` is generated: never edit by hand; run `pnpm generate:blur`.

## CSP gotcha

`csp-hashes.mjs` hashes every inline `<script>` without `src` in `dist/**/*.html`, including the JSON-LD blocks.
So after changing `theme-init.ts`, any `is:inline` script, `publicProfile.ts`, or the `richResults` i18n copy, run `pnpm build && pnpm csp:update` and commit `vercel.json`. A smoke test and `pnpm test` fail otherwise.

## Conventions

- Path alias `@/` -> `src/`.
- Icon components spread `{...Astro.props}` on the `<svg>` root; decorative SVGs get `aria-hidden="true"`.
- Every `target="_blank"` link needs `rel="noopener noreferrer"` (checked by a smoke test) plus an `sr-only` "new tab" label (`i18n.projects.newTab`).
- Client scripts use the typed `$` / `$$` helpers from `src/lib/dom.ts` instead of raw `querySelector`.
- Scroll reveal: add `data-reveal` (or `data-reveal="left"`, optional `data-reveal-delay` in ms); handled by `scripts/scroll-reveal.ts` + `global.css`.
- No `meta[name="generator"]`: intentionally omitted. OG image is `public/og.png` (1200x630).
- Keep the skip-to-content link in `Layout.astro` and target `#main-content` in new pages.
