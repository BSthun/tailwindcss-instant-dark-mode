import plugin from 'tailwindcss/plugin'

export type tailwindInstantDarkModeConfig = {
	colorMap: Record<string, string> | null
}

export const tailwindcssInstantDarkMode = (config?: tailwindInstantDarkModeConfig) => {=
	const getDarkEquivalent = (color: string) => {=
		if (!config)
			config = {
				colorMap: null,
			}

		if (!config.colorMap) {
			config.colorMap = {
				'50': '950',
				'100': '900',
				'200': '800',
				'300': '700',
				'400': '600',
				'500': '500',
				'600': '400',
				'700': '300',
				'800': '200',
				'900': '100',
				'950': '50',
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
