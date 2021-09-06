import colors from 'vuetify/es5/util/colors'

export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
	head: {
		titleTemplate: '%s - bandeiras-nuxt',
		title: 'bandeiras-nuxt',
		htmlAttrs: {
			lang: 'en'
		},
		meta: [
			{ charset: 'utf-8' },
			{ name: 'viewport', content: 'width=device-width, initial-scale=1' },
			{ hid: 'description', name: 'description', content: '' },
			{ name: 'format-detection', content: 'telephone=no' }
		],
		link: [
			{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
		]
	},

  // Global CSS: https://go.nuxtjs.dev/config-css
	css: [

	],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
	plugins: [
		
	],

  // Auto import components: https://go.nuxtjs.dev/config-components
	components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
	buildModules: [
    // https://go.nuxtjs.dev/vuetify
		'@nuxtjs/vuetify',
	],

  // Modules: https://go.nuxtjs.dev/config-modules
	modules: [
		'@nuxtjs/axios'
	],

    // Axios module configuration: https://go.nuxtjs.dev/config-axios
	axios: {
		baseUrl: 'https://restcountries.eu/rest/v2',
		// browserBaseURL: 'https://restcountries.eu/rest/v2'
	},

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
	vuetify: {
		customVariables: ['~/assets/variables.scss'],
		theme: {
			dark: false,
			themes: {
				dark: {
					primary: colors.blue.darken2,
					accent: colors.grey.darken3,
					secondary: colors.amber.darken3,
					info: colors.teal.lighten1,
					warning: colors.amber.base,
					error: colors.deepOrange.accent4,
					success: colors.green.accent3
				},
				light: {
					primary: '#0081a7', // Degree 1
					accent: '#00afb9', // Degree 2
					secondary: '#fdfcdc', // Degree 3
					info: '#fed9b7', // Degree 4
					warning: '#f07167', // Degree 5
					error: '#f07167',
					success: '#0081a7'
				},
			}
		}
	},

  // Build Configuration: https://go.nuxtjs.dev/config-build
	build: {
		
	}
}
