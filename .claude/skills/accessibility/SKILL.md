---
name: accessibility
description: Audit and fix accessibility (WCAG 2.2 AA) of this static Astro portfolio - alt text, color contrast in light and dark themes, keyboard navigation of the header menus, focus styles, headings, landmarks, reduced motion, axe/Lighthouse violations. Use when asked to "improve accessibility", "revisa accesibilidad", "audit a11y", "a11y", "WCAG", "contraste", "contrast", "screen reader", "keyboard navigation", "focus visible", "aria", "lighthouse accessibility" or "make it accessible".
license: MIT. Adapted from addyosmani/web-quality-skills (accessibility), author web-quality-skills.
metadata:
  author: web-quality-skills (adapted for portfolio-dvelandia)
  version: "1.2-portfolio"
---

# Accessibility (static Astro site)

Scope: WCAG 2.2 level AA for a static, bilingual portfolio with no forms, no auth, no media players and no
drag interactions. Interactive surface = header nav, mobile menu, theme toggle, language selector, anchor
links, external links and scroll-reveal animations. Read the references only when needed:

- `references/WCAG.md`: success criteria table (A/AA) filtered to what applies here, and testing tools.
- `references/A11Y-PATTERNS.md`: markup for skip link, icon buttons, menu buttons, external links, focus and
  motion CSS, screen reader shortcuts.

## What the repo already has

- Skip link to `#main-content` in `Layout.astro` (Tailwind `sr-only focus:not-sr-only`); keep it and give
  every new page a `<main id="main-content">`.
- `prefers-reduced-motion: reduce` overrides and `scroll-margin` for the fixed header in `global.css`;
  scroll reveal (`data-reveal`) renders content visible under reduced motion.
- Decorative SVG icons get `aria-hidden="true"`; `Icon.astro` spreads props so callers can pass `aria-*`.
- External links: `rel="noopener noreferrer"` + `sr-only` label from `i18n.projects.newTab`.
- Menu buttons (`ThemeToggle.astro`, `LanguageSelector.astro`, mobile menu in `Header.astro`) use
  `aria-expanded`, `aria-controls` / `aria-haspopup` and localized `aria-label`s from `src/i18n/*.json`.
- Automated gates: `tests/e2e/accessibility.spec.ts` (axe-core on `/` and `/en/`, zero violations) and
  `lighthouserc.json` (accessibility category must score >= 0.9).

## Audit checklist (WCAG 2.2 AA)

- Perceivable: every `<img>` has a meaningful `alt` (projects: `descriptionImage` in `projects.json`, both
  locales); decorative SVGs are `aria-hidden`; text contrast >= 4.5:1 (3:1 for >= 24px / 19px bold) and UI
  contrast >= 3:1 in BOTH light and dark themes; information is not conveyed by color alone (tags, active nav).
- Operable: everything reachable and usable with Tab/Shift+Tab/Enter/Space/Escape, including opening and
  closing the mobile menu, theme menu and language menu; visible `:focus-visible` ring on every control in both
  themes; focused element not hidden behind the fixed header (`scroll-margin-top`); targets >= 24x24 px; no
  animation under `prefers-reduced-motion: reduce`.
- Understandable: `<html lang>` matches the locale; one `<h1>`, `<h2>` per section, no skipped levels; link
  text says where it goes (no "click here" / "ver mas" alone); `aria-current="page"`/`location` on the active
  nav item when applicable; navigation order identical in es/en.
- Robust: native `<button>` / `<a>` instead of `role` on `<div>`; `aria-expanded` is toggled by the scripts in
  `src/scripts/*.ts`; landmarks `<header>`, `<nav aria-label>`, `<main>`, `<footer>` exist once each (two
  `<nav>`s need distinct labels, which `Header.astro` already does).

## How to verify

```bash
pnpm test:e2e -- tests/e2e/accessibility.spec.ts   # axe-core; builds and previews on 127.0.0.1:4321
pnpm build && pnpm test:lighthouse                  # Lighthouse accessibility >= 0.9 on / and /en/
```

- Manual keyboard pass: `pnpm dev`, Tab through the page in light and dark mode, open and close each menu,
  press Escape, follow an anchor link and confirm the heading is visible under the header.
- Contrast: read the tokens from `@theme` in `src/styles/global.css` and check pairs with
  https://webaim.org/resources/contrastchecker/ (or the Chrome DevTools color picker) for both themes.
- Screen reader spot check: NVDA on Windows (headings list `H`, links list `K`, landmarks `D`).
- Zoom to 200% and the 375px viewport (Playwright mobile project) without horizontal scroll.

## How to fix (Astro + Tailwind)

- Labels and announcements: add keys to BOTH `src/i18n/es.json` and `en.json` and read them with
  `getI18N`; never hardcode an `aria-label` string in a component.
- Visually hidden text: Tailwind `sr-only` (`focus:not-sr-only` for the skip link). No custom class needed.
- Icon-only buttons: `<button aria-label={t.x}>` + `<Icon name="..." aria-hidden="true" />`.
- Focus styles: use `focus-visible:outline-2 focus-visible:outline-offset-2` with a token that passes 3:1 on
  both backgrounds; never `outline-none` without a replacement. Global rules belong in `global.css`.
- Contrast: adjust the palette tokens in `global.css` `@theme` (see `.claude/rules/styles.md` for the allowed
  shades) rather than one-off hex values; keep `theme-color` metas in sync.
- Menus and toggles: state lives in `src/scripts/*.ts` (`header.ts`, `theme-toggle.ts`,
  `language-selector.ts`); toggle `aria-expanded`, close on Escape and on outside click, return focus to the
  trigger. Use the typed `$` / `$$` helpers from `src/lib/dom.ts`.
- Motion: new animations go through CSS and must be neutralized by the existing reduced-motion block; do not
  add JS-driven animation that ignores the media query.
- Headings: content sections render through `SectionContainer.astro` (`<h2>`); nested titles are `<h3>`.
- After changing inline scripts (`theme-init.ts`) run `pnpm build && pnpm csp:update`.

## Report format

Group findings as Critical (missing alt, contrast, keyboard trap, no focus indicator), Serious (lang, heading
structure, link text, landmarks) and Moderate (aria on icons, target size, motion). Give file + WCAG criterion
+ fix for each, apply the fixes, then paste the axe and Lighthouse results.
