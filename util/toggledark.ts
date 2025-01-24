const apply = (isDark: boolean) => {
	const root = document.documentElement
	if (isDark) {
		root.classList.add('dark')
	} else {
		root.classList.remove('dark')
	}
}

const initDarkMode = () => {
	const userPref = localStorage.getItem('theme')
	const systemPref = window.matchMedia('(prefers-color-scheme: dark)').matches

	if (userPref === 'dark') {
		apply(true)
	} else if (userPref === 'light') {
		apply(false)
	} else {
		apply(systemPref)
	}

	const systemPrefListener = window.matchMedia('(prefers-color-scheme: dark)')
	systemPrefListener.addEventListener('change', (event) => {
		apply(event.matches)
		localStorage.setItem('theme', event.matches ? 'dark' : 'light')
	})
}

const toggleDarkMode = () => {
	const root = document.documentElement
	if (root.classList.contains('dark')) {
		root.classList.remove('dark')
		localStorage.setItem('theme', 'light')
	} else {
		root.classList.add('dark')
		localStorage.setItem('theme', 'dark')
	}
}

export { initDarkMode, toggleDarkMode }
