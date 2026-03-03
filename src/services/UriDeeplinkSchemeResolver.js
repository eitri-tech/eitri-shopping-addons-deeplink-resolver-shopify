import Eitri from 'eitri-bifrost'
import { closeEitriApp, openAccount, openBrowser, openCart, openHome, openProduct } from './NavigationService'

export const resolveUriDeeplinkScheme = async deeplink => {
	const fullPath = deeplink.replace(/^[a-zA-Z]+:\/\//, '')

	if (!fullPath) {
		closeEitriApp()
		return
	}

	let [path, queryString] = fullPath.split('?')
	if (!path) {
		closeEitriApp()
		return
	}
	
	path = path.toLowerCase()

	if (path.startsWith('product/id/')) {
		const productId = path.replace('product/id/', '')
		if (productId) {
			await openProduct({productId})
			return
		}
		closeEitriApp()
		return
	}

	if (path.startsWith('product/slug/')) {
		const match = path.match(/-(\d+)$/)
		const productSlug = match ? match[1] : null
		if (productSlug) {
			await openProduct({productSlug})
			return
		}
		closeEitriApp()
		return
	}

	if (path.startsWith('category/') || path.startsWith('collection/')) {
		const url = fullPath.replace(/^(category\/|collection\/)/, '')
		await openHome({url})
		return
	}

	if (path.startsWith('search/')) {
		const searchTerm = path.replace(/^(search\/)/, '')
		await openHome({searchTerm})
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