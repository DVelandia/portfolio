---
name: add-icon
description: Add a new SVG icon component and/or a new technology to the stack, experience or project tags. Use when asked to add an icon, logo or technology to the portfolio.
---

# Add an icon / technology

1. Create `src/icons/<Name>.astro` with the raw `<svg>`, spreading `{...Astro.props}` on the `<svg>` root so callers can pass `class` and `aria-*`.
   Use `currentColor` where the icon should follow the theme. `Icon.astro` picks it up automatically via `import.meta.glob`.
2. If the icon is referenced from content JSON (`stack.json`, `projects.json` tags, `experience.json` `icon`/`tags`), add `<Name>` to the `iconNames` array in `src/content.config.ts`. UI-only icons imported directly don't need this.
3. To show it in the tech stack, add `<Name>` to the right category's `icons` array in `src/content/stack.json`.
   A new category also needs a `gradient` (`light`/`dark` hex pairs) and a label in `technologies.categories.<id>` in both `src/i18n/es.json` and `en.json`.
4. Verify with `pnpm check` (unknown names in content fail the Zod enum; in `Icon.astro` they only render a 2-letter placeholder).
