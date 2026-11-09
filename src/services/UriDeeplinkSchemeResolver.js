import Eitri from 'eitri-bifrost'
import { closeEitriApp, openAccount, openBrowser, openCart, openEitriApp, openHome, openProduct } from './NavigationService'

/**
 * Lê a query do deeplink como parâmetros de inicialização.
 * Os valores chegam como string: quem recebe converte o que precisar ser número ou booleano.
 * @param {string | undefined} queryString
 * @returns {Record<string, string>} `{}` quando não há query ou ela não pode ser lida
 */
const queryParamsOf = queryString => {
	if (!queryString) return {}
	try {
		return Object.fromEntries(new URLSearchParams(queryString))
	} catch (error) {
		console.error('Erro ao ler os parâmetros do deeplink', error)
		return {}
	}
}

/**
 * Abre a tela do app para um deeplink de esquema próprio. O esquema aceita hífen e número
 * (ex.: `renovabe-dev://`).
 *
 * `<esquema>://app/<slug-do-eitri-app>?chave=valor` abre aquele Eitri-app com a query como
 * parâmetros de inicialização, lidos lá com `Eitri.getInitializationInfos()`.
 * @param {string} deeplink
 */
export const resolveUriDeeplinkScheme = async deeplink => {
	const fullPath = deeplink.replace(/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//, '')

	if (!fullPath) {
		closeEitriApp()
		return
	}

	let [path, queryString] = fullPath.split('?')
	console.log('path', path, queryString)
	if (!path) {
		closeEitriApp()
		return
	}
	
	if (path.toLowerCase().startsWith('product/id/')) {
		let id = path.replace(/product\/id\//i, '').replace(/\/$/g, '')
		if (id) {
			if (!isNaN(id)) {
				id = `gid://shopify/Product/${id}`
			}
			await openProduct({id: id})
			return
		}
		closeEitriApp()
		return
	}

	if (path.startsWith('product/slug/')) {
		let handle = path.replace(/product\/slug\//i, '').replace(/\/$/g, '')
		if (handle) {
			await openProduct({handle})
			return
		}
		closeEitriApp()
		return
	}

	if (path.startsWith('category/') || path.startsWith('collection/')) {
		const handle = path.replace(/^(category\/|collection\/)/, '')
		await openHome({
			route: 'ProductCatalog',
			params: {
				type: 'collection',
				handle
			}
		})
		closeEitriApp()
		return
	}

	// // export type ActionType = 'collection' | 'search' | 'product'
	if (path.startsWith('search/')) {
		const searchTerm = path.replace(/^(search\/)/, '')
		await openHome({
			route: 'Search',
			params: {
				type: 'search',
				query: searchTerm
			}
		})
		return
	}

	if (path === 'home') {
		await Eitri.exposedApis.appState.goHome()
		return
	}
	
	if (path.startsWith('cart/') || path === 'cart') {
		const checkoutId = path.replace('cart/', '')
		await openCart({checkoutId})
		return
	}
	
	if (path.startsWith('account/') || path === 'account') {
		const page = path.replace('account/', '')
		await openAccount({page})
		return
	}
	
	if (path.startsWith('app/')) {
		const slug = path.replace(/^app\//, '').replace(/\/$/g, '')
		if (slug) {
			await openEitriApp(slug, queryParamsOf(queryString))
			return
		}
		closeEitriApp()
		return
	}

	if (path.startsWith('webview/')) {
		const url = path.replace(/^(webview\/)/i, '')

		if (url?.startsWith('inapp/')) {
			const formatedUrl = decodeURIComponent(url.replace(/^inapp\//i, ''))
			openBrowser(formatedUrl, true)
		} else {
			openBrowser(decodeURIComponent(url), false)
		}
		return
	}

	closeEitriApp()
}