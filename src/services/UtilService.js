export const delay = async (ms) => {
    return new Promise((resolve, _reject) => setTimeout(resolve, ms))
}

export const processParams = (input) => {
    const { action, value, title, utm, ...others } = input

    // Concatena os outros parâmetros com &
    const additionalParams = Object.entries(others)
        .map(([key, val]) => `${encodeURIComponent(key)}=${encodeURIComponent(val)}`)
        .join('&')

    const finalValue = additionalParams ? `${value}&${additionalParams}` : value

    return {
        ...(action && { action }),
        value: finalValue,
        ...(utm && { utm }),
        ...(title && { title })
    }
}

export const resolveDeeplinkUtmParams = (startParams) => {
    const utmParams = Object.fromEntries(Object.entries(startParams).filter(([key]) => key.includes('utm')))
    return utmParams
}

export const resolveUtmParamsByQueryString = async queryString => {
    if (!queryString) return
    const paramsArray = queryString.split('&')
    const paramsObject = {}
    paramsArray.forEach(param => {
        const [key, value] = param.split('=')
        if (key.startsWith('utm')) {
            paramsObject[key] = value
        }
    })

    // o utm_source será definido pelo app
    paramsObject.utm_source = null

    return paramsObject
}