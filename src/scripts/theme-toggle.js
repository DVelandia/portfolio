const THEME_STORAGE_KEY = "theme"
const themeMatchMedia = window.matchMedia("(prefers-color-scheme: dark)")
const reduceMotionMatchMedia = window.matchMedia("(prefers-reduced-motion: reduce)")
const availableThemes = new Set(["light", "dark", "system"])

function getThemeElements() {
	return {
		menu: document.getElementById("themes-menu"),
		options: Array.from(document.querySelectorAll(".theme-toggle-option")),
		toggle: document.getElementById("theme-toggle-btn"),
	}
}

function isTheme(value) {
	return value !== null && availableThemes.has(value)
}

function getStoredTheme() {
	const storedTheme = localStorage.getItem(THEME_STORAGE_KEY)

	if (isTheme(storedTheme)) {
		return storedTheme
	}

	localStorage.setItem(THEME_STORAGE_KEY, "system")
	return "system"
}

function getResolvedTheme(theme = getStoredTheme()) {
	return theme === "dark" || (theme === "system" && themeMatchMedia.matches)
}

function syncThemeUi(theme = getStoredTheme()) {
	const isDark = getResolvedTheme(theme)
	document.documentElement.classList.toggle("dark", isDark)
	document.documentElement.dataset.theme = theme

	document.querySelectorAll(".theme-toggle-icon").forEach((icon) => {
		const isActiveIcon = icon.id === theme
		icon.classList.toggle("scale-100", isActiveIcon)
		icon.classList.toggle("opacity-100", isActiveIcon)
		icon.classList.toggle("scale-0", !isActiveIcon)
		icon.classList.toggle("opacity-0", !isActiveIcon)
		icon.setAttribute("aria-hidden", String(!isActiveIcon))
	})

	getThemeElements().options.forEach((option) => {
		option.checked = option.value === theme
	})
}

function canAnimateThemeChange(theme) {
	const isDark = document.documentElement.classList.contains("dark")
	const nextIsDark = getResolvedTheme(theme)

	return (
		isDark !== nextIsDark &&
		!reduceMotionMatchMedia.matches &&
		typeof document.startViewTransition === "function"
	)
}

function updateTheme(theme, { animate = false } = {}) {
	if (!animate || !canAnimateThemeChange(theme)) {
		syncThemeUi(theme)
		return
	}

	document.documentElement.dataset.themeTransition = "running"

	const transition = document.startViewTransition(() => {
		syncThemeUi(theme)
	})

	transition.ready.then(() => {
		document.documentElement.animate(
			{
				clipPath: ["inset(0 0 100% 0)", "inset(0)"],
			},
			{
				duration: 450,
				easing: "cubic-bezier(0.22, 1, 0.36, 1)",
				pseudoElement: "::view-transition-new(root)",
			}
		)
	})

	transition.finished.finally(() => {
		delete document.documentElement.dataset.themeTransition
	})
}

function openThemeMenu() {
	const { menu, options, toggle } = getThemeElements()

	if (!(menu instanceof HTMLElement) || !(toggle instanceof HTMLButtonElement)) {
		return
	}

	menu.hidden = false
	toggle.setAttribute("aria-expanded", "true")
	const selectedOption = options.find((option) => option.checked)

	window.requestAnimationFrame(() => {
		selectedOption?.focus()
	})
}

function closeThemeMenu({ restoreFocus = false } = {}) {
	const { menu, toggle } = getThemeElements()

	if (menu instanceof HTMLElement) {
		menu.hidden = true
	}

	if (toggle instanceof HTMLButtonElement) {
		toggle.setAttribute("aria-expanded", "false")

		if (restoreFocus) {
			toggle.focus()
		}
	}
}

function initThemeToggle() {
	const { menu, options, toggle } = getThemeElements()

	if (!(toggle instanceof HTMLButtonElement) || !(menu instanceof HTMLElement)) {
		return
	}

	if (toggle.dataset.initialized === "true") {
		syncThemeUi()
		return
	}

	toggle.dataset.initialized = "true"

	toggle.addEventListener("click", (event) => {
		event.stopPropagation()
		const isExpanded = toggle.getAttribute("aria-expanded") === "true"

		if (isExpanded) {
			closeThemeMenu()
			return
		}

		openThemeMenu()
	})

	toggle.addEventListener("keydown", (event) => {
		if (event.key === "ArrowDown" || event.key === "ArrowUp") {
			event.preventDefault()
			openThemeMenu()
		}
	})

	options.forEach((option) => {
		option.addEventListener("change", () => {
			if (!isTheme(option.value)) {
				return
			}

			localStorage.setItem(THEME_STORAGE_KEY, option.value)
			updateTheme(option.value, { animate: true })
			closeThemeMenu({ restoreFocus: true })
		})

		option.addEventListener("keydown", (event) => {
			if (event.key === "Escape") {
				event.preventDefault()
				closeThemeMenu({ restoreFocus: true })
			}
		})
	})

	menu.hidden = true
	syncThemeUi()

	if (window.__portfolioThemeListenersInitialized) {
		return
	}

	document.addEventListener("click", (event) => {
		const { menu: currentMenu, toggle: currentToggle } = getThemeElements()
		if (!currentMenu || !currentToggle) {
			return
		}

		const target = event.target
		if (!(target instanceof Node)) {
			return
		}

		if (currentMenu.contains(target) || currentToggle.contains(target)) {
			return
		}

		closeThemeMenu()
	})

	document.addEventListener("keydown", (event) => {
		if (event.key !== "Escape") {
			return
		}

		const { menu: currentMenu } = getThemeElements()
		closeThemeMenu({
			restoreFocus: Boolean(currentMenu?.contains(document.activeElement)),
		})
	})

	themeMatchMedia.addEventListener("change", () => {
		syncThemeUi()
	})

	window.addEventListener("storage", (event) => {
		if (!event.key || event.key === THEME_STORAGE_KEY) {
			syncThemeUi()
		}
	})

	window.__portfolioThemeListenersInitialized = true
}

initThemeToggle()
document.addEventListener("astro:after-swap", () => {
	syncThemeUi()
})
document.addEventListener("astro:page-load", initThemeToggle)
