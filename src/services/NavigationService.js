import Eitri from 'eitri-bifrost'

export const openHome = async (params = {}) => {
	try {
		await eitriNavigationOpen({
			slug: 'home',
			initParams: params,
			replace: true
		})
	} catch (e) {
		console.error('navigate to Home: Error', e)
		closeEitriApp()
	}
}

export const openProduct = async params => {
	try {
		await eitriNavigationOpen({
			slug: 'pdp',
			initParams: params,
			replace: true
		})
	} catch (e) {
		console.error('navigate to PDP: Error', e)
		closeEitriApp()
	}
}

export const openCart = async (params = {}) => {
	try {
		await eitriNavigationOpen({
			slug: 'cart',
			initParams: params,
			replace: true
		})
	} catch (e) {
		console.error('navigate to Cart: Error', e)
		closeEitriApp()
	}
}

export const openCheckout = async (params = {}) => {
	try {
		await eitriNavigationOpen({
			slug: 'checkout',
			initParams: params,
			replace: true
		})
	} catch (e) {
		console.error('navigate to Checkout: Error', e)
		closeEitriApp()
	}
}

export const openAccount = async (params = {}) => {
	try {
		await eitriNavigationOpen({
			slug: 'account',
			initParams: params,
			replace: true
		})
	} catch (e) {
		console.error('navigate to Account: Error', e)
		closeEitriApp()
	}
}

export const openEitriApp = async (slug, params) => {
	try {
		await eitriNavigationOpen({
			slug,
			initParams: params,
			replace: true
		})
	} catch (e) {
		console.error('navigate to Home: Error', e)
		closeEitriApp()
	}
}

export const openRedirectLinkBrowser = async deeplink => {
	try {
		const { applicationData } = await Eitri.getConfigs()
        let inApp = false

        if (deeplink.startsWith('webview/inapp/')) { inApp = true }
		let url =
			applicationData.platform === 'ios'
				? deeplink
				: `https://faststore-cms.s3.us-east-1.amazonaws.com/redirect.html?link=${btoa(deeplink)}`

		Eitri.openBrowser({
			url: url,
			inApp: inApp
		})
		closeEitriApp()
	} catch (error) {
		console.error('Erro ao processar o deep link de busca', error)
		closeEitriApp()
	}
}

export const openBrowser = async (url, inApp = true) => {
	try {
		// forçar sempre https
		const formatedUrl = new URL(url.startsWith('http') ? url : `https://${url}`);
    	formatedUrl.protocol = 'https:';
		
		Eitri.openBrowser({
			url: formatedUrl.toString(),
			inApp
		})
		closeEitriApp()
	} catch (error) {
		console.error('Erro ao processar o deep link de busca', error)
		closeEitriApp()
	}
}

let appIsOpen = true
// centralizando Eitri.navigation.open, para melhorar debug de codigo
export const eitriNavigationOpen = params => {
	if (appIsOpen) {
		// console.log('eitriNavigationOpen', params)
		return Eitri.navigation.open(params)
	} 
}

// centralizando Eitri.close, correção para condição de corrida
export const closeEitriApp = async () => {
	if (appIsOpen) {
		appIsOpen = false
		await Eitri.close()
	} 
}
