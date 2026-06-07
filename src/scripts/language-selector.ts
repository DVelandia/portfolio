const languageSelectorQuery = ".language-selector"

function getLanguageSelectorElements(selector: HTMLDetailsElement) {
	return {
		items: Array.from(selector.querySelectorAll<HTMLAnchorElement>("a[hreflang]")),
		menu: selector.querySelector<HTMLElement>(".language-menu"),
		summary: selector.querySelector<HTMLElement>("summary"),
	}
}

function setLanguageSelectorOpen(selector: HTMLDetailsElement, isOpen: boolean) {
	const { summary } = getLanguageSelectorElements(selector)

	selector.open = isOpen
	summary?.setAttribute("aria-expanded", String(isOpen))
}

function focusLanguageMenuItem(selector: HTMLDetailsElement, index: number) {
	const { items } = getLanguageSelectorElements(selector)
	const item = items[index]

	if (!item) {
		return
	}

	setLanguageSelectorOpen(selector, true)
	window.requestAnimationFrame(() => item.focus())
}

function initLanguageSelector() {
	const selectors = Array.from(document.querySelectorAll<HTMLDetailsElement>(languageSelectorQuery))

	selectors.forEach((selector) => {
		if (selector.dataset.initialized === "true") {
			return
		}

		const { items, menu, summary } = getLanguageSelectorElements(selector)

		if (!summary || !menu) {
			return
		}

		selector.dataset.initialized = "true"
		summary.setAttribute("aria-expanded", String(selector.open))

		selector.addEventListener("toggle", () => {
			summary.setAttribute("aria-expanded", String(selector.open))
		})

		summary.addEventListener("keydown", (event) => {
			if (event.key === "ArrowDown") {
				event.preventDefault()
				focusLanguageMenuItem(selector, 0)
				return
			}

			if (event.key === "ArrowUp") {
				event.preventDefault()
				focusLanguageMenuItem(selector, items.length - 1)
			}
		})

		menu.addEventListener("keydown", (event) => {
			const activeIndex = items.indexOf(document.activeElement as HTMLAnchorElement)

			if (event.key === "Escape") {
				event.preventDefault()
				setLanguageSelectorOpen(selector, false)
				summary.focus()
				return
			}

			if (event.key === "Home") {
				event.preventDefault()
				focusLanguageMenuItem(selector, 0)
				return
			}

			if (event.key === "End") {
				event.preventDefault()
				focusLanguageMenuItem(selector, items.length - 1)
				return
			}

			if (event.key !== "ArrowDown" && event.key !== "ArrowUp") {
				return
			}

			event.preventDefault()
			const direction = event.key === "ArrowDown" ? 1 : -1
			const nextIndex = (activeIndex + direction + items.length) % items.length
			focusLanguageMenuItem(selector, nextIndex)
		})

		selector.addEventListener("focusout", (event) => {
			const nextTarget = event.relatedTarget

			if (nextTarget instanceof Node && selector.contains(nextTarget)) {
				return
			}

			setLanguageSelectorOpen(selector, false)
		})
	})

	if (window.__portfolioLanguageSelectorListenersInitialized) {
		return
	}

	document.addEventListener("click", (event) => {
		const target = event.target

		if (!(target instanceof Node)) {
			return
		}

		document.querySelectorAll<HTMLDetailsElement>(languageSelectorQuery).forEach((selector) => {
			if (!selector.contains(target)) {
				setLanguageSelectorOpen(selector, false)
			}
		})
	})

	window.__portfolioLanguageSelectorListenersInitialized = true
}

initLanguageSelector()
document.addEventListener("astro:page-load", initLanguageSelector)
