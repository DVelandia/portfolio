let revealObserver: IntersectionObserver | null = null

function initScrollReveal() {
	revealObserver?.disconnect()
	revealObserver = null

	document.documentElement.classList.add("js-reveal")

	const elements = document.querySelectorAll<HTMLElement>("[data-reveal]:not(.revealed)")
	if (elements.length === 0) return

	if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
		elements.forEach((el) => el.classList.add("revealed"))
		return
	}

	revealObserver = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (!entry.isIntersecting) return
				const el = entry.target
				if (!(el instanceof HTMLElement)) return

				const delay = Number(el.dataset.revealDelay ?? 0)
				if (delay > 0) {
					setTimeout(() => el.classList.add("revealed"), delay)
				} else {
					el.classList.add("revealed")
				}
				revealObserver?.unobserve(el)
			})
		},
		{ rootMargin: "0px 0px -60px 0px", threshold: 0.05 }
	)

	elements.forEach((el) => revealObserver?.observe(el))
}

initScrollReveal()
document.addEventListener("astro:page-load", initScrollReveal)
