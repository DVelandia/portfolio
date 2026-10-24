# Accessibility patterns (Astro + Tailwind, this repo)

Adapted from addyosmani/web-quality-skills (`accessibility`), MIT license. Patterns for modals, forms, error
handling, drag alternatives and ARIA tabs were removed: the site has none of those widgets. Load from
`SKILL.md` when you need exact markup.

## Contents

- [Skip link](#skip-link)
- [Icon-only buttons and decorative icons](#icon-only-buttons-and-decorative-icons)
- [Menu button (theme toggle, language selector, mobile menu)](#menu-button)
- [External links](#external-links)
- [Focus styles and focus not obscured](#focus-styles-and-focus-not-obscured)
- [Reduced motion](#reduced-motion)
- [Status messages](#status-messages)
- [Screen reader shortcuts](#screen-reader-shortcuts)

## Skip link

Already in `src/layouts/Layout.astro`; every page must render `<main id="main-content">`.

```astro
<a href="#main-content" class="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 ...">
  {i18n.skipToContent}
</a>
<main id="main-content">...</main>
```

## Icon-only buttons and decorative icons

```astro
---
import SunIcon from "@/icons/Sun.astro"
const t = getI18N({ currentLocale: Astro.currentLocale })
---
<button type="button" aria-label={t.theme.spanTheme}>
  <SunIcon class="size-5" aria-hidden="true" />
</button>
```

- Label text comes from `src/i18n/{es,en}.json`, never hardcoded.
- Icons from `src/icons/*.astro` spread `{...Astro.props}` on `<svg>`, so `aria-hidden` reaches the root.
- Visually hidden text alternative: `<span class="sr-only">{t.label}</span>` inside the button.

## Menu button

Used by `ThemeToggle.astro`, `LanguageSelector.astro` and the mobile menu in `Header.astro`; logic in
`src/scripts/{theme-toggle,language-selector,header}.ts`.

```astro
<button type="button" id="theme-toggle-btn" aria-controls="themes-menu" aria-expanded="false" aria-haspopup="true">
  <span class="sr-only">{t.theme.spanTheme}</span>
  <SunIcon aria-hidden="true" />
</button>
<ul id="themes-menu" role="menu" hidden>
  <li role="none"><button role="menuitem" type="button">{t.theme.light}</button></li>
</ul>
```

Script contract (`src/lib/dom.ts` helpers `$` / `$$`):

- Click toggles `hidden` on the panel and sets `aria-expanded` to `"true"` / `"false"` on the trigger.
- `Escape` closes the panel and returns focus to the trigger; click outside closes it.
- Arrow Up/Down move between `menuitem`s when `role="menu"` is used; otherwise keep plain buttons/links and
  let Tab do the work (simpler and valid).
- Re-bind on `astro:page-load` (ClientRouter) so listeners survive view transitions.

## External links

```astro
<a href={project.link} target="_blank" rel="noopener noreferrer">
  {project.title}
  <span class="sr-only">{t.projects.newTab}</span>
</a>
```

A smoke test fails on any `target="_blank"` without `rel="noopener noreferrer"`.

## Focus styles and focus not obscured

```css
/* global.css: never remove outlines without a replacement */
:focus-visible {
  outline: 2px solid var(--color-primary-500);
  outline-offset: 2px;
}

/* fixed header must not cover the focused/targeted element (2.4.11) */
:target,
:focus {
  scroll-margin-top: 5rem;
}
```

Tailwind equivalent on a control: `focus-visible:outline-2 focus-visible:outline-offset-2
focus-visible:outline-primary-500`. Check the ring has 3:1 against both `dark-50` and `dark-950`.

## Reduced motion

`global.css` already neutralizes animations and forces `[data-reveal]` content visible under
`prefers-reduced-motion: reduce`. New animation must live in CSS so that block covers it:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

For JS-driven motion check `window.matchMedia("(prefers-reduced-motion: reduce)").matches` first.

## Status messages

Only needed if the UI reports a result without moving focus (e.g. "Enlace copiado").

```html
<p id="status" role="status" aria-live="polite" class="sr-only"></p>
```

Clear `textContent` before setting the new message so repeated messages are announced again.

## Screen reader shortcuts

| Action          | NVDA (Windows)  | VoiceOver (Mac)     |
| --------------- | --------------- | ------------------- |
| Start / stop    | Ctrl + Alt + N  | Cmd + F5            |
| Next item       | Down arrow      | VO + Right          |
| Headings list   | H / Shift + H   | VO + U, then arrows |
| Links list      | K / Shift + K   | VO + U              |
| Landmarks       | D / Shift + D   | VO + U              |
| Activate        | Enter           | VO + Space          |
