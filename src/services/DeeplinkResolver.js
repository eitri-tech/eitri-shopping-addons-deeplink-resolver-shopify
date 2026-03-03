import Eitri from 'eitri-bifrost'
import { closeEitriApp } from './NavigationService'

export const resolveDeeplinkStartParams = async deeplink => {
	const [baseUrl, ...queryParamsAux] = deeplink?.split('?')
	const queryParams = queryParamsAux?.join('&') || ''

	try {
		const utmParams = await resolveUtmParamsByQueryString(queryParams)
		saveUtmParams(utmParams)
	} catch (e) {
		console.error('Erro ao salvar os parâmetros UTM', e)
	}

	resolveDeeplinkPath(baseUrl, queryParams)
}

export const resolveDeeplinkPath = async (baseUrl, queryParams) => {
	closeEitriApp()
}
