import plugin from 'tailwindcss/plugin'

export type tailwindInstantDarkModeConfig = {
	colorMap: Record<string, string> | null
}

export const tailwindcssInstantDarkMode = (config?: tailwindInstantDarkModeConfig) => {
	// Helper to get the dark mode equivalent of a color
	const getDarkEquivalent = (color: string) => {
		// Map light colors to their dark equivalents
		if (!config)
			config = {
				colorMap: null,
			}

		if (!config.colorMap) {
			config.colorMap = {
				'50': '900',
				'100': '800',
				'200': '700',
				'300': '600',
				'400': '500',
				'500': '400',
				'600': '300',
				'700': '200',
				'800': '100',
				'900': '50',
			}
		}

		// Extract color base and shade
		const match = color.match(/^(.+)-(\d+)$/)
		if (!match) return color

		const [_, base, shade] = match
		const darkShade = config.colorMap[shade]

		return darkShade ? `${base}-${darkShade}` : color
	}

	return plugin(function ({ addComponents, theme }) {
		// Get all color utilities from theme
		const utilities = Object.entries(theme('colors') as Record<string, any>).reduce(
			(acc: Record<string, any>, [colorName, colorValues]) => {
				if (typeof colorValues === 'object') {
					Object.entries(colorValues).forEach(([shade, colorValue]) => {
						const properties = [
							['backgroundColor', 'bg'],
							['borderColor', 'border'],
							['color', 'text'],
							['ringColor', 'ring'],
							['divideColor', 'divide'],
							['placeholderColor', 'placeholder'],
						] as const

						properties.forEach(([prop, prefix]) => {
							const className = `${prefix}-${colorName}-${shade}-dark`

							const darkShadeKey = getDarkEquivalent(`${colorName}-${shade}`)
							const [darkColorName, darkShade] = darkShadeKey.split('-')

							const darkValue = theme('colors')?.[darkColorName]?.[darkShade]

							if (colorValue && darkValue) {
								acc[`.${className}`] = {
									[prop]: colorValue,
									'.dark &': {
										[prop]: darkValue,
									},
									transition: 'color 0.2s, background-color 0.2s, border-color 0.2s',
								}
							}
						})
					})
				}
				return acc
			},
			{}
		)

		addComponents(utilities)
	})
}
