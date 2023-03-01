import { trimEnd } from 'lodash'

const defaultBase = `${import.meta.env.MODE === 'development' ? 'http' : 'https'}://${import.meta.env.VITE_BASE}`

const extension = path => {
    const paths = path.split('.')

    if (paths.length === 1) {
        return null
    }

    return paths.pop()
}

export default (pathname, options = {}, base = defaultBase) => {
    const original = new URL(pathname, base).pathname

    const path = trimEnd(original, `.${extension(original)}`)

    try {
        options = {
            ...options,
            ...JSON.parse(atob(extension(path)))
        }
    } catch {}

    if (! Object.keys(options).length) {
        return new URL(original, base)
    }

    const builder = [
        trimEnd(path.replace(extension(path), ''), '.'),
        trimEnd(btoa(JSON.stringify(options)), '='),
        extension(original)
    ]

    return new URL(builder.join('.'), base)
}
