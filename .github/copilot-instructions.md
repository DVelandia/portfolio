# GitHub Copilot — Project Instructions

## Project

Personal portfolio built with **Astro 6** (SSG), **Tailwind CSS 4**, Playwright E2E, and deployed to Vercel.
Static site, bilingual (ES/EN), strict CSP, WCAG 2.2 AA compliant.

## Package manager

Always use **pnpm**. Never suggest `npm install` or `yarn`.

## Language & framework conventions

- Components are `.astro` files — use Astro component syntax
- Data lives in `src/content/*.json` (Content Collections) — never hardcode content in components
- All UI strings go in `src/i18n/es.json` AND `src/i18n/en.json`
- Icons are SVG components in `src/icons/NombreIcono.astro`
- Client-side TS goes in `src/scripts/` as `.ts` files (bundled by Astro)

## Styling

- Tailwind CSS 4 utility classes — config/tokens in `src/styles/global.css` under `@theme`
- Custom global CSS also in `global.css` (not arbitrary inline styles)
- Dark mode via `html.dark` class (not `prefers-color-scheme` media query)

## Security rules

- Every `target="_blank"` link MUST have `rel="noopener noreferrer"` — validated by smoke test
- After adding any inline `<script>` in an `.astro` file: run `pnpm build && pnpm csp:update`

## Accessibility rules

- Decorative SVGs must have `aria-hidden="true"`
- Links opening in new tabs need a visually-hidden `(abre en nueva pestaña)` span with class `sr-only`
- Never remove `prefers-reduced-motion` overrides in `global.css`

## Testing

Run `pnpm test` (build + CSP check + 13 smoke tests) before suggesting any commit.
Run `pnpm check` to verify 0 TypeScript errors.

## What NOT to do

- Do not add `npm-lock.json` or `yarn.lock`
- Do not hardcode strings — always add to both i18n files
- Do not add a new icon without updating the `iconNames` enum in `src/content.config.ts`
- Do not add inline `<script>` without running `pnpm csp:update` afterwards
