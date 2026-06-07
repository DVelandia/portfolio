# Portfolio — Daniel Velandia

Portfolio personal construido con Astro 6, Tailwind CSS 4 y desplegado en Vercel.
Site estático (SSG), multilenguaje (ES/EN), con pipeline de calidad completa.

[![CI](https://github.com/DVelandia/portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/DVelandia/portfolio/actions/workflows/ci.yml)

## Tech Stack

- **Astro 6** — SSG con Content Collections e i18n manual
- **Tailwind CSS 4** — utility-first, tokens en `src/styles/global.css`
- **Playwright** — pruebas E2E de interacciones reales
- **Node `--test`** — smoke tests del build (SEO, CSP, sitemap, seguridad)
- **GitHub Actions** — CI con lint, typecheck, build, CSP check y Lighthouse
- **Vercel** — deploy con headers de seguridad estrictos (CSP, HSTS, COOP)

## Comandos

| Comando                | Acción                                                               |
| :--------------------- | :------------------------------------------------------------------- |
| `pnpm install`         | Instala dependencias                                                 |
| `pnpm dev`             | Dev server en `localhost:4321`                                       |
| `pnpm dev:clean`       | Limpia caché y reinicia dev server                                   |
| `pnpm build`           | Build estático → `dist/`                                             |
| `pnpm preview`         | Sirve el build generado localmente                                   |
| `pnpm check`           | TypeScript + Astro check (0 errores)                                 |
| `pnpm lint`            | ESLint                                                               |
| `pnpm format`          | Prettier (--write)                                                   |
| `pnpm test`            | Build → CSP check → 13 smoke tests                                   |
| `pnpm test:e2e`        | 8 pruebas Playwright E2E                                             |
| `pnpm test:lighthouse` | Auditoría Lighthouse CI local sobre `dist/`                          |
| `pnpm csp:update`      | Actualiza hashes CSP en `vercel.json` tras cambios en scripts inline |

## Requisitos

- Node.js `>=22.12.0`
- pnpm `10.33.0`

## Estructura

```
src/
├── components/        # Componentes Astro por sección
├── content/           # Datos: projects.json, experience.json, stack.json
├── i18n/              # Traducciones: es.json + en.json
├── icons/             # SVGs como componentes .astro
├── layouts/           # Layout.astro — layout base
├── pages/             # index.astro (ES), en/index.astro (EN), 404.astro
├── scripts/           # TypeScript cliente: header, scroll, idioma, theme
└── styles/            # global.css — tokens Tailwind + overrides globales
```

## Notas

- El gestor de paquetes oficial es **pnpm** — no usar npm ni yarn.
- Si Astro/Vite muestra errores de dependencias stale en dev, usar `pnpm dev:clean`.
- Al agregar o modificar cualquier `<script>` inline, ejecutar `pnpm build && pnpm csp:update`.
- El workflow de CI ejecuta formato, lint, typecheck, build, CSP check, smoke tests y Lighthouse.
- Los secrets de Vercel (`VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`) van en GitHub Actions — nunca en el código.
- Ver `CLAUDE.md` para contexto detallado de arquitectura y convenciones.
