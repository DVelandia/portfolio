# Portfolio

Portfolio personal construido con Astro 6, Tailwind CSS 4 y `pnpm`.

## Requisitos

- Node.js `>=22.12.0`
- pnpm `10.33.0`

## Comandos

Todos los comandos se ejecutan desde la raiz del proyecto:

| Comando        | Accion                                      |
| :------------- | :------------------------------------------ |
| `pnpm install` | Instala dependencias                        |
| `pnpm dev`     | Inicia el entorno local en `localhost:4321` |
| `pnpm build`   | Genera la salida de produccion en `dist/`   |
| `pnpm preview` | Sirve localmente el build generado          |
| `pnpm check`   | Ejecuta `astro check` y `tsc --noEmit`      |
| `pnpm lint`    | Ejecuta ESLint                              |
| `pnpm format`  | Formatea `src/` con Prettier                |

## Stack

- Astro 6
- Tailwind CSS 4
- Astro Content Collections
- ESLint + Prettier

## Notas

- El proyecto usa `sharp` para optimizacion de imagenes con `astro:assets`.
- El gestor de paquetes oficial del repo es `pnpm`.
