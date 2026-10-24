---
paths:
  - "src/styles/**"
  - "src/**/*.astro"
---

# Styling

- Tailwind CSS v4 via the Vite plugin (no PostCSS, no `tailwind.config`). Tokens live in `src/styles/global.css` under `@theme`.
- Palettes are sparse; only these shades exist: `primary` 50/200/400/500/600/700/950, `daintree` 200/300/700/800, `crusta` 300/500/700/800, `dark` 50/100/200/300/400/700/800/900/950. Add a token before using a missing shade.
- Dark mode is class-based (`.dark` on `<html>`, `@custom-variant dark`), set by `scripts/theme-init.ts`; don't use `prefers-color-scheme` media queries for theming.
- Global CSS goes in `global.css`, not inline `style` attributes. Custom pieces there: `.hero-height` (100svh mobile / 100vh desktop), `@utility mask-fade-bottom` and `mask-fade-bottom-quick`, custom scrollbar.
- Keep the `prefers-reduced-motion: reduce` overrides in `global.css`; new animations must degrade under them.
- Fonts: Onest Variable (latin + latin-ext `@font-face` only) with the metric-adjusted `Adjusted Arial Fallback` to avoid CLS. Don't switch to a full `@fontsource` import.
- `theme-color` meta values (`#f8fafc` / `#020617`) in `SEO.astro` mirror `dark-50` / `dark-950`; keep them in sync if those tokens change.
