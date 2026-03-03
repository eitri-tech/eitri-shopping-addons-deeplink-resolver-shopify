import Eitri from 'eitri-bifrost'

export const saveUtmParams = async params => {
    try {
        const utmParams = {}
        for (const key of Object.keys(params)) {
            const normalizedKey = key.replace(/[_-]/g, '').toLowerCase()

            if (normalizedKey.startsWith('utm')) {
                if (normalizedKey === 'utmcampaignid') {
                    utmParams['campaign_id'] = params[key]
                } else {
                    utmParams[normalizedKey.substring(3)] = params[key]
                }
            }
        }

        if (Object.keys(utmParams).length > 0) {
            Eitri.exposedApis.fb.logEvent({
                eventName: 'campaign_details',
                data: utmParams
            })
        }
    } catch (error) {
        console.error('Erro ao salvar os parametros UTM', error)
    }
}