function updateScrollUi() {
	const header = document.querySelector("header")
	const progressBar = document.getElementById("scroll-progress")

	header?.classList.toggle("scrolled", window.scrollY > 10)

	if (progressBar) {
		const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight
		const progress = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0
		progressBar.style.transform = `scaleX(${Math.min(1, progress)})`
	}
}

function initScrollUi() {
	updateScrollUi()

	if (window.__portfolioScrollUiInitialized) {
		return
	}

	let ticking = false

	window.addEventListener(
		"scroll",
		() => {
			if (ticking) {
				return
			}

			window.requestAnimationFrame(() => {
				updateScrollUi()
				ticking = false
			})
			ticking = true
		},
		{ passive: true }
	)

	window.addEventListener("resize", updateScrollUi, { passive: true })
	window.__portfolioScrollUiInitialized = true
}

initScrollUi()
document.addEventListener("astro:page-load", initScrollUi)
