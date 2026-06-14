# Portfolio — DVelandia

Personal portfolio of Daniel Velandia, Software Engineer. Static site built with Astro, Tailwind CSS v4, and TypeScript. Deployed to Vercel.

**Live site:** https://daniel.velandia.dev/

---

## Essential Commands

```bash
pnpm dev              # Start dev server (localhost:4321)
pnpm dev:clean        # Clear Astro/.vite cache, then start dev
pnpm build            # Production build
pnpm preview          # Preview production build locally

pnpm generate:blur    # Regenerate blur placeholders for project images (run after adding new images)

pnpm check            # Type-check with astro check + tsc
pnpm lint             # ESLint
pnpm lint:fix         # ESLint with auto-fix
pnpm format           # Prettier
pnpm format:check     # Prettier check (no writes)

pnpm test             # Full suite: build → CSP check → smoke tests
pnpm test:e2e         # Playwright E2E tests (starts preview server automatically)
pnpm test:lighthouse  # Lighthouse CI audit against the built site
pnpm test:smoke       # Node.js smoke tests (runs after build)

pnpm csp:update       # Recalculate and write CSP hashes to vercel.json
pnpm csp:check        # Verify CSP hashes match current build (used in CI)
```

> **Important:** Always run `pnpm check` before committing to catch TypeScript and Astro type errors early.

> **CSP note:** Whenever inline scripts change (e.g., `theme-init.ts` or any `is:inline` script in Layout.astro), run `pnpm csp:update` to regenerate SHA-256 hashes and commit the updated `vercel.json`.

---

## Architecture

```
src/
├── assets/
│   ├── me.webp               # Profile photo (optimized by Astro Image)
│   ├── logo.webp               # DV brand logo (672×490, optimized by Astro Image)
│   └── projects/             # Project screenshots (brinsa, colserauto, credicorp)
├── components/
│   ├── about/                # AboutMe section
│   ├── experiences/          # Work experience timeline
│   ├── pages/AppPage.astro   # Main page composition (assembles all sections)
│   ├── projects/             # ProjectItem, ProjectImagePanel, ProjectInfoPanel, ProjectTagsList, Projects
│   ├── seo/                  # SEO.astro (meta tags), RichResults.astro (JSON-LD)
│   ├── stack/                # Tech stack grid (StackItem, SectionItem, Stack)
│   ├── ui/                   # Icon.astro (dynamic icon loader), ThemeToggle, LanguageSelector
│   ├── SectionContainer.astro  # Reusable section wrapper (max-width, padding)
│   ├── Header.astro
│   └── Footer.astro
├── content/                  # JSON data files (source of truth for content)
│   ├── experience.json       # Work experience (keyed by locale: es / en)
│   ├── projects.json         # Projects (keyed by locale: es / en)
│   └── stack.json            # Tech stack categories (locale-agnostic)
├── content.config.ts         # Astro content collection schemas with Zod validation
├── data/
│   ├── publicProfile.ts         # Personal info, URLs, social links, skills (single source of truth)
│   └── blur-placeholders.json   # Auto-generated base64 blur previews for project images
├── i18n/
│   ├── en.json               # English translations (UI strings + rich results copy)
│   ├── es.json               # Spanish translations
│   └── index.ts              # getI18N() helper — resolves locale to translation object
├── icons/                    # SVG icon components (.astro files)
│   └── flags/                # Country flag SVGs for language selector
├── layouts/
│   └── Layout.astro          # Base HTML layout (hreflang, font preload, scripts)
├── pages/
│   ├── index.astro           # → delegates to AppPage (Spanish default, no prefix)
│   ├── en/index.astro        # → delegates to AppPage (English, /en/ prefix)
│   └── 404.astro             # Custom 404 page
├── scripts/                  # Client-side TypeScript (loaded at runtime)
│   ├── header.ts             # Mobile nav open/close + active section
│   ├── language-selector.ts  # Language menu keyboard/click/focus management
│   ├── scroll-reveal.ts      # IntersectionObserver reveal animation
│   ├── theme-init.ts         # Inlined in <head> — sets theme before paint (no FOUC)
│   ├── theme-toggle.ts       # Theme switcher (light/dark/system) with View Transitions
│   └── ui-scroll.ts          # Shared scroll progress + header state listener
├── styles/
│   └── global.css            # @font-face (Onest + Adjusted Arial Fallback), Tailwind @import, CSS tokens
├── lib/
│   └── dom.ts                # Typed $ / $$ querySelector helpers (used in client scripts)
├── types/
│   └── Preload.ts            # Type for <link rel="preload"> props
└── env.d.ts                  # Astro type declarations
```

---

## Routing & i18n

- **Default locale:** Spanish (`es`) — served at `/` (no prefix).
- **English locale:** served at `/en/`.
- Both `pages/index.astro` and `pages/en/index.astro` import the same `AppPage.astro` component — locale is detected via `Astro.currentLocale`.
- All components call `getI18N({ currentLocale })` from `src/i18n/index.ts` to get locale-aware strings.
- Hreflang links are generated in `Layout.astro` and include `es`, `en`, and `x-default` (points to `/`).
- `es.json` is used as the TypeScript type reference (`typeof spanish`) — both files must stay structurally in sync.

---

## Content System

Content is driven by JSON files in `src/content/` and validated through Astro content collections defined in `src/content.config.ts`.

### Adding a new project

1. Add an entry to both `es` and `en` arrays in `src/content/projects.json`.
2. Add the project image to `src/assets/projects/` (WebP format preferred).
3. Add the image filename to the `projectImages` const in `content.config.ts`.
4. Run `pnpm generate:blur` to regenerate `src/data/blur-placeholders.json`.
5. Run `pnpm check` to validate the schema.

### Adding a new icon

1. Create `src/icons/YourIcon.astro` — spread `{...Astro.props}` on the SVG root.
2. Add the icon name string to the `iconNames` array in `content.config.ts`.
3. The `Icon.astro` component loads all icons dynamically via `import.meta.glob`.

### Adding a new technology to the stack

Add the icon name to the appropriate category array in `src/content/stack.json`. Icon must already exist in `src/icons/`.

---

## Styling

- **CSS framework:** Tailwind CSS v4 (Vite plugin, not PostCSS).
- **Design tokens** are defined in `global.css` under `@theme { }`:
  - `primary-*` — brand blue (50 → 950)
  - `dark-*` — neutral slate scale for backgrounds/text
  - `daintree-*` — teal accent
  - `crusta-*` — warm orange accent
- **Dark mode:** Class-based via `.dark` on `<html>`. Custom variant: `@custom-variant dark (&:where(.dark, .dark *))`.
- **Font:** Onest Variable — loaded as manual `@font-face` for `latin` and `latin-ext` subsets only (no Cyrillic). File paths come from `@fontsource-variable/onest`.
- **Fallback font:** `Adjusted Arial Fallback` — a calibrated `@font-face` that adjusts Arial's metrics to match Onest, reducing Cumulative Layout Shift (CLS) during font load.
- **Hero height:** Uses the `.hero-height` CSS class (`100svh` on mobile, `100vh` on desktop) — `svh` excludes the mobile browser's UI bar, preventing the hero from being clipped.
- **Utilities:** `mask-fade-bottom` and `mask-fade-bottom-quick` — CSS `@utility` rules using `mask-image` for a soft gradient fade on content blocks.
- **Scrollbar:** Custom styled via `::-webkit-scrollbar` with `primary-400` color and `color-mix` transparency. Firefox uses `scrollbar-color`. Only applied on pointer devices (`hover: hover`).
- **Theme colors:** `#f8fafc` (light) / `#020617` (dark) — used in `meta[name="theme-color"]`.

---

## SEO & Rich Results

- **`SEO.astro`** — generates all meta tags: `<title>`, description, author, canonical, og:_, twitter:_, theme-color, robots, icons.
- **`RichResults.astro`** — generates JSON-LD `Person` and `WebSite` schemas. Data comes from `publicProfile.ts` (structural) + locale-specific `richResults` keys in `en.json`/`es.json` (copy).
- **`publicProfile.ts`** — single source of truth for personal data: name, URLs, social links, location, organizations, skills, resume path.
- **No `meta[name="generator"]`** — intentionally removed to avoid exposing the framework.
- Open Graph image: `/public/og.png` (1200×630px required).

### Updating the CSP after script changes

```bash
pnpm build
pnpm csp:update   # Updates SHA-256 hashes in vercel.json
```

---

## Deployment

- **Platform:** Vercel (static output).
- **Config:** `vercel.json` — defines security headers (CSP, HSTS, CORP, etc.) and cache policies per route.
- **Output mode:** `static` — fully pre-rendered at build time, no server runtime.

### Cache policies (vercel.json)

| Route                                                      | Cache                                       |
| ---------------------------------------------------------- | ------------------------------------------- |
| `/_astro/*`                                                | `immutable`, 1 year (content-hashed assets) |
| `/og.png`                                                  | 1 hour                                      |
| `/daniel-velandia-cv-es.pdf`, `/daniel-velandia-cv-en.pdf` | 1 hour + `noindex,nofollow`                 |
| `/favicon.ico`, `/img/icons/apple-touch-icon.png`          | 1 day                                       |

---

## Testing

```
tests/
├── e2e/          # Playwright tests (require server running)
│   ├── accessibility.spec.ts
│   ├── navigation.spec.ts
│   ├── not-found.spec.ts
│   └── portfolio.spec.ts
└── smoke/        # Node.js built-in test runner (runs on static build output)
    └── navigation.test.mjs
```

E2E tests cover: accessibility, theme toggle, language switch (ES↔EN), mobile menu behavior, 404 page.

---

## Key Conventions

- **Path alias:** `@/` maps to `src/` (configured in `tsconfig.json`).
- **Package manager:** `pnpm` only. Do not use npm or yarn.
- **Node.js:** >= 22.12.0 required (`engines` field in `package.json`).
- **Icon components:** Always spread `{...Astro.props}` on the SVG root so consumers can pass `class`, `aria-*`, etc.
- **Locale-aware content:** Use `getI18N({ currentLocale })` — never hardcode strings in components.
- **Content changes:** Both `es` and `en` arrays in `projects.json` and `experience.json` must be updated together to keep locales in sync.
- **Data-reveal animations:** Add `data-reveal` attribute to elements for scroll-based fade-in. Use `data-reveal="left"` for horizontal entry.
- **DOM helpers:** Use `$` and `$$` from `src/lib/dom.ts` in client scripts instead of raw `querySelector` — they're typed generics.
- **Blur placeholders:** `src/data/blur-placeholders.json` is auto-generated. Never edit it manually. Run `pnpm generate:blur` after adding/replacing project images.
- **Reduced motion:** All animations respect `prefers-reduced-motion` via CSS.
- **Accessibility:** Skip-to-content link at top of body, all icons have `aria-hidden="true"` with adjacent `sr-only` text where needed.
