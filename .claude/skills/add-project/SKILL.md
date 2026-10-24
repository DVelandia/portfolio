---
name: add-project
description: Add or replace a project in the portfolio's Projects section (projects.json, image, blur placeholder). Use when asked to add, remove or update a portfolio project or its screenshot.
---

# Add a project

1. Add the entry to BOTH the `es` and `en` arrays in `src/content/projects.json`, at the same position (array order = display order).
   Fields: `title`, `description`, `descriptionImage` (alt text), `image`, `tags: [{ "icon": "..." }]`, optional `role` (`FullStack` | `FrontEnd`), `visibility` (`public` default | `private`), `link`.
   A `public` project must have a valid URL in `link` (Zod `superRefine` in `content.config.ts`).
2. Put the screenshot in `src/assets/projects/` (WebP).
3. Add the filename to the `projectImages` const in `src/content.config.ts`.
4. Every tag icon must already be in `iconNames` (otherwise use the `add-icon` skill).
5. Run `pnpm generate:blur` (rewrites `src/data/blur-placeholders.json`; never edit it by hand).
6. Verify with `pnpm check` and `pnpm test` (a smoke test checks referenced project images exist).
