# Portfolio

Portfolio personal construido con Astro 6, Tailwind CSS 4, content collections y `pnpm`.

## Requisitos

- Node.js `>=22.12.0`
- pnpm `10.33.0`

## Comandos

Todos los comandos se ejecutan desde la raiz del proyecto:

| Comando           | Accion                                      |
| :---------------- | :------------------------------------------ |
| `pnpm install`    | Instala dependencias                        |
| `pnpm dev`        | Inicia el entorno local en `localhost:4321` |
| `pnpm dev:clean`  | Limpia cache Astro/Vite e inicia dev server |
| `pnpm build`      | Genera la salida de produccion en `dist/`   |
| `pnpm preview`    | Sirve localmente el build generado          |
| `pnpm check`      | Ejecuta `astro check` y `tsc --noEmit`      |
| `pnpm lint`       | Ejecuta ESLint                              |
| `pnpm test`       | Ejecuta build y smoke tests                 |
| `pnpm test:e2e`   | Ejecuta pruebas Playwright contra preview   |
| `pnpm csp:update` | Actualiza hashes CSP desde `dist/`          |
| `pnpm csp:check`  | Verifica que la CSP coincida con `dist/`    |
| `pnpm format`     | Formatea el proyecto con Prettier           |

## Stack

- Astro 6
- Tailwind CSS 4
- Astro Content Collections
- ESLint + Prettier
- Smoke tests con `node --test`
- GitHub Actions para quality gates
- Vercel Preview via GitHub Actions
- Playwright para pruebas E2E de interacciones reales

## Notas

- El proyecto usa `sharp` para optimizacion de imagenes con `astro:assets`.
- El gestor de paquetes oficial del repo es `pnpm`.
- La carpeta `.agents/` se versiona como soporte local, pero se excluye de lint y formato.
- El contenido validado por Astro Content Collections vive en `src/content/`.
- Si Astro/Vite muestra `Outdated Optimize Dep` en desarrollo, detener el dev server y
  ejecutar `pnpm dev:clean`.
- Si cambian scripts inline o JSON-LD, ejecutar `pnpm build` y luego `pnpm csp:update`.
- El workflow `CI` ejecuta formato, lint, typecheck, build, CSP check y smoke tests.
- El workflow `Vercel Preview` requiere los secrets `VERCEL_TOKEN`, `VERCEL_ORG_ID` y
  `VERCEL_PROJECT_ID` en GitHub.
