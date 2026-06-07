;(() => {
	const storedTheme = localStorage.getItem("theme")
	const theme =
		storedTheme === "light" || storedTheme === "dark" || storedTheme === "system"
			? storedTheme
			: "system"

	if (storedTheme !== theme) {
		localStorage.setItem("theme", theme)
	}

	const isDark =
		theme === "dark" ||
		(theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)

	document.documentElement.classList.toggle("dark", isDark)
	document.documentElement.dataset.theme = theme
})()
