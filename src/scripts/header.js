const focusableSelector =
	'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'

function initHeader() {
	const menuToggle = document.getElementById("menu-toggle")
	const mobileMenu = document.getElementById("mobile-menu")
	const menuItems = Array.from(document.querySelectorAll(".menu-item"))
	const navItems = Array.from(document.querySelectorAll("[data-nav-target]"))
	const sections = Array.from(document.querySelectorAll("main > section[id]"))

	if (!(menuToggle instanceof HTMLButtonElement) || !(mobileMenu instanceof HTMLElement)) {
		return
	}

	if (menuToggle.dataset.initialized === "true") {
		return
	}

	menuToggle.dataset.initialized = "true"

	const desktopMediaQuery = window.matchMedia("(min-width: 1024px)")
	let hideMenuTimeout = 0
	let observer = null

	const getFocusableMenuElements = () =>
		Array.from(mobileMenu.querySelectorAll(focusableSelector)).filter(
			(element) =>
				!element.hasAttribute("disabled") && element.getAttribute("aria-hidden") !== "true"
		)

	const focusPrimaryMenuElement = () => {
		const firstMenuItem = menuItems[0]
		const firstFocusable = getFocusableMenuElements()[0]
		;(firstMenuItem ?? firstFocusable)?.focus()
	}

	const setCurrentSection = (currentSectionId) => {
		navItems.forEach((item) => {
			const isCurrent = currentSectionId !== null && item.dataset.navTarget === currentSectionId
			item.classList.toggle("text-primary-600", isCurrent)
			item.classList.toggle("dark:text-primary-400", isCurrent)

			if (isCurrent) {
				item.setAttribute("aria-current", "location")
				return
			}

			item.removeAttribute("aria-current")
		})
	}

	const setMenuState = (isOpen) => {
		window.clearTimeout(hideMenuTimeout)
		document.body.classList.toggle("overflow-hidden", isOpen)
		menuToggle.classList.toggle("open", isOpen)
		menuToggle.setAttribute("aria-expanded", String(isOpen))
		menuToggle.setAttribute(
			"aria-label",
			isOpen ? "Cerrar menú de navegación" : "Abrir menú de navegación"
		)

		if (isOpen) {
			mobileMenu.setAttribute("aria-hidden", "false")
			mobileMenu.classList.remove("hidden", "menu-close")
			mobileMenu.classList.add("menu-open")
			window.requestAnimationFrame(focusPrimaryMenuElement)
			return
		}

		mobileMenu.setAttribute("aria-hidden", "true")
		mobileMenu.classList.remove("menu-open")
		mobileMenu.classList.add("menu-close")
		hideMenuTimeout = window.setTimeout(() => {
			mobileMenu.classList.add("hidden")
		}, 200)
	}

	const closeMenu = (restoreFocus = false) => {
		setMenuState(false)

		if (restoreFocus) {
			menuToggle.focus()
		}
	}

	const syncDesktopObserver = () => {
		observer?.disconnect()
		observer = null

		if (!desktopMediaQuery.matches || sections.length === 0) {
			setCurrentSection(null)
			return
		}

		observer = new IntersectionObserver(
			(entries) => {
				const activeSection = entries.find((entry) => entry.isIntersecting)

				if (!activeSection) {
					return
				}

				setCurrentSection(activeSection.target.id)
			},
			{
				rootMargin: "-40% 0px -40% 0px",
				threshold: 0,
			}
		)

		sections.forEach((section) => {
			observer?.observe(section)
		})
	}

	menuToggle.addEventListener("click", () => {
		const isOpen = menuToggle.classList.contains("open")
		setMenuState(!isOpen)
	})

	mobileMenu.addEventListener("keydown", (event) => {
		if (event.key === "Escape") {
			event.preventDefault()
			closeMenu(true)
			return
		}

		if (event.key !== "Tab" || menuToggle.getAttribute("aria-expanded") !== "true") {
			return
		}

		const focusableElements = getFocusableMenuElements()
		if (focusableElements.length === 0) {
			event.preventDefault()
			return
		}

		const firstElement = focusableElements[0]
		const lastElement = focusableElements.at(-1)
		const activeElement = document.activeElement

		if (event.shiftKey && activeElement === firstElement) {
			event.preventDefault()
			lastElement?.focus()
			return
		}

		if (!event.shiftKey && activeElement === lastElement) {
			event.preventDefault()
			firstElement.focus()
		}
	})

	menuItems.forEach((item) => {
		item.addEventListener("click", () => {
			closeMenu()
		})
	})

	desktopMediaQuery.addEventListener("change", () => {
		closeMenu()
		syncDesktopObserver()
	})

	syncDesktopObserver()

	// Header scroll state — adds visual depth when content scrolls behind the header
	const headerEl = document.querySelector("header")
	let headerScrollTicking = false
	const updateHeaderState = () => {
		headerEl?.classList.toggle("scrolled", window.scrollY > 10)
		headerScrollTicking = false
	}
	window.addEventListener(
		"scroll",
		() => {
			if (!headerScrollTicking) {
				window.requestAnimationFrame(updateHeaderState)
				headerScrollTicking = true
			}
		},
		{ passive: true }
	)
	updateHeaderState()
}

initHeader()
document.addEventListener("astro:page-load", initHeader)
