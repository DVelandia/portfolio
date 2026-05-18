# CLAUDE.md — AI Agent Context

> Este archivo proporciona contexto esencial para agentes de IA (Claude Code, Gemini CLI,
> OpenAI Codex, Windsurf, Cursor, etc.) que trabajen en este repositorio.

## Proyecto

Portfolio personal de Daniel Velandia, construido con **Astro 6**, **Tailwind CSS 4** y
desplegado en Vercel. Es un site **estático** (SSG), multilenguaje (ES / EN), con
Content Collections, Playwright E2E y una pipeline de CI robusta en GitHub Actions.

**URL en producción:** inferida desde `astro.config.ts` → `site`

---

## Stack

| Capa | Tecnología |
|------|-----------|
| Framework | Astro 6 (SSG) |
| Estilos | Tailwind CSS 4 (config en `src/styles/global.css`) |
| Contenido | Astro Content Collections (`src/content/`) |
| i18n | Manual en `src/i18n/es.json` + `en.json` |
| Testing | Node `--test` smoke tests + Playwright E2E |
| Linting | ESLint (`eslint.config.mjs`) + Prettier |
| Deploy | Vercel (SSG, headers en `vercel.json`) |
| Package manager | **pnpm** — no usar npm ni yarn |

---

## Comandos esenciales

```bash
pnpm dev               # dev server en localhost:4321
pnpm build             # build estático → dist/
pnpm check             # astro check + tsc --noEmit (0 errores esperados)
pnpm lint              # ESLint
pnpm format            # Prettier (--write)
pnpm test              # build + csp:check + smoke tests (13 tests)
pnpm test:e2e          # Playwright E2E (8 tests, necesita servidor activo)
pnpm csp:update        # OBLIGATORIO tras agregar cualquier <script> inline
pnpm csp:check         # verifica que los hashes CSP en vercel.json estén actualizados
pnpm dev:clean         # limpia caché Astro/Vite y reinicia dev
```

---

## ⚠️ Flujo crítico — CSP (Content Security Policy)

Este proyecto tiene una CSP estricta en `vercel.json` que valida cada script inline por hash.

**Cada vez que agregues o modifiques un `<script>` inline en cualquier archivo `.astro`:**

```bash
pnpm build && pnpm csp:update
```

El script `scripts/csp-hashes.mjs` extrae los hashes SHA-256 de los scripts inline
generados en `dist/` y los escribe en `vercel.json`. El smoke test `pnpm test` verifica
que estén en sync — fallará si no actualizas.

---

## Arquitectura

```
src/
├── components/        # Astro components por dominio (about/, experiences/, projects/, stack/, ui/)
├── content/           # Datos (projects.json, experience.json, stack.json) — fuente de verdad
├── content.config.ts  # Schema de validación de Content Collections
├── data/              # publicProfile.ts — datos estáticos del perfil
├── i18n/              # es.json + en.json — todas las cadenas de texto
├── icons/             # SVG inline como componentes .astro
├── layouts/           # Layout.astro — layout base único
├── pages/             # index.astro (ES), en/index.astro (EN), 404.astro
├── scripts/           # JS vanilla (header.js, scroll-reveal.js, theme-*.js)
└── styles/            # global.css — design tokens Tailwind + override globales
```

### Patrones establecidos

- **Contenido:** Modificar SIEMPRE en `src/content/*.json` — nunca hardcodear en componentes
- **Textos:** Todas las cadenas van en `src/i18n/es.json` Y `src/i18n/en.json`
- **Iconos:** Crear como `src/icons/NombreIcono.astro` — exportan SVG como slot
- **Scripts JS:** En `src/scripts/`. Importar con `?url` para scripts externos, `?raw` para inline
- **i18n:** `getI18N({ currentLocale })` en el frontmatter de cada componente que lo necesite
- **Rutas:** ES en `/`, EN en `/en/` — el locale se infiere de `Astro.currentLocale`

---

## Testing

```
Pipeline: pnpm build → pnpm csp:check → pnpm test:smoke → pnpm test:e2e (manual)
```

| Capa | Archivo | Qué valida |
|------|---------|-----------|
| Smoke (13 tests) | `tests/smoke/navigation.test.mjs` | Build, SEO meta, CSP hashes, sitemap, font preload, seguridad de links |
| E2E (8 tests) | `tests/e2e/*.spec.ts` | Theme toggle, idioma, menú móvil, nav anchors, 404 |

**Antes de hacer commit:** `pnpm test` debe pasar con 0 failures.

---

## Accesibilidad (WCAG 2.2 AA)

- Skip link en `Layout.astro` → `#main-content`
- `prefers-reduced-motion` global en `global.css`
- `aria-hidden="true"` en SVGs decorativos
- `scroll-margin-top: 5rem` en `section[id]` para header fijo

---

## Seguridad

- CSP estricta en `vercel.json` (hash-based para scripts inline)
- HSTS con `preload`
- `Cross-Origin-Opener-Policy: same-origin`
- Todos los `target="_blank"` requieren `rel="noopener noreferrer"` — el smoke test lo valida

---

## Convenciones de código

- **TypeScript**: `pnpm check` debe pasar sin errores. Usar `as string` para imports `?url` de Vite
- **Linting**: ESLint con `unused-imports` como error (no warnings)
- **Formato**: Prettier auto-formatea — `pnpm format` antes de revisar diffs
- **Commits**: No hay convención estricta de commit messages, pero cada commit debería pasar `pnpm test`
- **Iconos nuevos**: El schema de `content.config.ts` tiene un enum `iconNames` — actualizar si se agrega un icono nuevo

---

## Gotchas conocidos

1. **Vite `?url` imports y TypeScript:** usar `as string` → `href={fontUrl as string}`
2. **Lighthouse CI genera artifacts en `.lighthouseci/`** → están en `.gitignore`, no commitear
3. **`pnpm dev:clean`** si el dev server muestra errores de dep optimización stale
4. **El `IntersectionObserver` del header** usa `rootMargin: "-40% 0px -40% 0px"` (no threshold) — importante para secciones de altura variable
5. **Scroll-reveal:** usa clase `.js-reveal` en `<html>` para evitar FOUC — no eliminar esa lógica
