import Eitri from 'eitri-bifrost'
import { closeEitriApp, openHome, openProduct } from './NavigationService'

export const deeplinkActionsExecutor = async content => {
	if (!content || !content.action) {
		console.error('Deeplink action inválida ou ausente:', content)
		return false
	}

	const { action, value, order, filter, title = '' } = content

	try {
		switch (action) {
			case 'search':
				openHome({...content, route: 'Search', searchTerm: decodeURIComponent(value)})
				break
			case 'collection':
				openHome(content)
				break
			case 'category':
				openHome(content)
				break
			case 'brand':
				openHome(content)
				break
			case 'product':
				openProduct(content)
				break
			default:
				console.error(`Unknown action type: ${action}`)
				closeEitriApp()
				return false
		}
		return true
	} catch (error) {
		console.error('Erro ao executar deeplink:', error)
		return false
	}
}
