import Eitri from 'eitri-bifrost'
import { App } from 'eitri-shopping-shopify-shared'
import { deeplinkActionsExecutor } from '../services/NotificationDeepLinkService'
import { resolveDeeplinkStartParams } from '../services/DeeplinkResolver'
import { resolveUriDeeplinkScheme } from '../services/UriDeeplinkSchemeResolver'
import { closeEitriApp } from '../services/NavigationService'
import { processParams, resolveDeeplinkUtmParams } from '../services/UtilService'
import { saveUtmParams } from '../services/TrackingService'

export default function Home(props) {
	useEffect(() => {
		startHome()
		Eitri.navigation.setOnResumeListener(() => {
			closeEitriApp()
		})
	}, [])

	const startHome = async () => {
		await loadConfigs()
		await resolveContent()
	}

	const loadConfigs = async () => {
		try {
			await App.configure({ verbose: false })
		} catch (error) {
			console.error('Erro ao buscar configurações', error)
		}
	}

	const resolveContent = async () => {
		try {
			const startParams = await Eitri.getInitializationInfos()
			if (!startParams) {
				closeEitriApp()
				return
			}

			await processStartParams(startParams)
		} catch (error) {
			console.error('Erro ao resolver parâmetros de inicialização:', error)
			closeEitriApp()
		}
	}

	const processStartParams = async startParams => {
		try {
			const { action, value, title, deeplink } = startParams
			
			if (deeplink) {
				if (deeplink.startsWith('http') || deeplink.startsWith('www')) {
					await resolveDeeplinkStartParams(deeplink)
				} else {
					await resolveUriDeeplinkScheme(deeplink)
				}
				return
			}

			if (action && value) {
				const utmParams = await resolveDeeplinkUtmParams(startParams)
				saveUtmParams(utmParams)

				const processedParameters = processParams(startParams)
				deeplinkActionsExecutor(startParams)
			}

			closeEitriApp()
		} catch (error) {
			console.error('Erro ao processar os parametros de inicializacao', error)
			closeEitriApp()
		}
	}

	return (
		<Window>
			<Text></Text>
		</Window>
	)
}
