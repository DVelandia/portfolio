---
name: frontend-design
description: Design and build distinctive, production-grade UI for this Astro + Tailwind portfolio - new sections, components, hero/cards/layout redesigns, micro-interactions and visual polish, within the repo's design tokens. Use when asked to "redesign", "rediseña", "mejora el diseño", "make it look better", "hazlo más bonito", "polish the UI", "new section", "nueva sección", "landing", "hero", "card", "layout", "animation" or "styling". Not for SEO or accessibility audits (use those skills).
license: Apache 2.0, complete terms in LICENSE.txt. Adapted from anthropics/skills (frontend-design), author Anthropic.
---

This skill guides creation of distinctive, production-grade frontend interfaces that avoid generic "AI slop"
aesthetics. Implement real working code with exceptional attention to aesthetic details and creative choices.

**This repo first.** The portfolio already has a design system: read `.claude/rules/styles.md` before
styling anything. Tailwind v4 tokens (`@theme` in `src/styles/global.css`), the sparse palette (`primary`,
`daintree`, `crusta`, `dark`), class-based dark mode, the Onest Variable font with its metric-adjusted
fallback and the `prefers-reduced-motion` overrides are fixed constraints. The guidance below about picking
fonts and palettes applies only within those tokens: add a token before inventing a color, and do not swap
the font. Keep the `data-reveal` scroll-reveal system, the skip link and `#main-content`, and the i18n rule
(no hardcoded UI strings; add keys to both `src/i18n/es.json` and `en.json`).

The user provides frontend requirements: a component, page, application, or interface to build. They may
include context about the purpose, audience, or technical constraints.

## Design Thinking

Before coding, understand the context and commit to a BOLD aesthetic direction:

- **Purpose**: What problem does this interface solve? Who uses it?
- **Tone**: Pick an extreme: brutally minimal, maximalist chaos, retro-futuristic, organic/natural,
  luxury/refined, playful/toy-like, editorial/magazine, brutalist/raw, art deco/geometric, soft/pastel,
  industrial/utilitarian, etc. Use these for inspiration but design one that is true to the aesthetic direction.
- **Constraints**: Technical requirements (Astro static output, Tailwind v4, strict CSP: no inline `style`
  attributes or inline event handlers, accessibility AA, both themes).
- **Differentiation**: What makes this UNFORGETTABLE? What's the one thing someone will remember?

**CRITICAL**: Choose a clear conceptual direction and execute it with precision. Bold maximalism and refined
minimalism both work - the key is intentionality, not intensity.

Then implement working code (`.astro` components, Tailwind classes, CSS in `global.css`, TypeScript in
`src/scripts/`) that is production-grade and functional, visually striking and memorable, cohesive with a
clear aesthetic point-of-view, and meticulously refined in every detail.

## Frontend Aesthetics Guidelines

Focus on:

- **Typography**: Pair weights, sizes, tracking and optical alignment of Onest Variable; use scale and
  hierarchy, not a new typeface, to create character.
- **Color & Theme**: Commit to a cohesive aesthetic using the existing tokens. Dominant colors with sharp
  accents outperform timid, evenly-distributed palettes. Design for light AND dark mode at the same time.
- **Motion**: CSS-only animations and micro-interactions; one well-orchestrated page load with staggered
  reveals (`data-reveal` + `data-reveal-delay`) creates more delight than scattered effects. Every animation
  must degrade under `prefers-reduced-motion: reduce`.
- **Spatial Composition**: Unexpected layouts. Asymmetry. Overlap. Diagonal flow. Grid-breaking elements.
  Generous negative space OR controlled density.
- **Backgrounds & Visual Details**: Create atmosphere and depth rather than defaulting to solid colors:
  gradient meshes, noise textures, geometric patterns, layered transparencies, dramatic shadows, decorative
  borders, grain overlays - as CSS, not images, where possible.

NEVER use generic AI-generated aesthetics: cliched color schemes (particularly purple gradients on white
backgrounds), predictable layouts and component patterns, and cookie-cutter design that lacks
context-specific character.

**IMPORTANT**: Match implementation complexity to the aesthetic vision. Maximalist designs need elaborate code
with extensive animations and effects. Minimalist or refined designs need restraint, precision, and careful
attention to spacing, typography, and subtle details. Elegance comes from executing the vision well.

Verify with `pnpm check`, `pnpm lint`, `pnpm format:check` and a visual pass in both themes at 375px and
desktop (`pnpm dev`); run `pnpm build && pnpm csp:update` if an inline script changed.
