/**
 * Typed shorthand for `document.querySelector`.
 * @example
 *   const btn = $<HTMLButtonElement>('#my-btn')
 */
export const $ = <T extends HTMLElement>(
	selector: string,
	context: Document | HTMLElement = document
): T | null => context.querySelector<T>(selector)

/**
 * Typed shorthand for `document.querySelectorAll`.
 * @example
 *   const items = $$<HTMLLIElement>('.nav-item')
 */
export const $$ = <T extends HTMLElement>(
	selector: string,
	context: Document | HTMLElement = document
): NodeListOf<T> => context.querySelectorAll<T>(selector)
