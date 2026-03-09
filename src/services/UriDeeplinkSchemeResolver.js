import Eitri from 'eitri-bifrost'
import { closeEitriApp, openAccount, openBrowser, openCart, openHome, openProduct } from './NavigationService'

export const resolveUriDeeplinkScheme = async deeplink => {
	const fullPath = deeplink.replace(/^[a-zA-Z]+:\/\//, '')

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