import 'server-only'

const DEFAULT_SITE_TITLE = 'Association POC'
const DEFAULT_SITE_DESCRIPTION = 'Proof of concept du site de l’association'
const DEFAULT_SESSION_COOKIE_NAME = 'association_poc_session'
const DEFAULT_SESSION_MAX_AGE = 60 * 60 * 24

const envOrDefault = (name: string, fallback: string) => {
    const value = process.env[name]?.trim()
    return value || fallback
}

const optionalEnv = (name: string) => {
    const value = process.env[name]?.trim()
    return value || undefined
}

const positiveIntegerEnvOrDefault = (name: string, fallback: number) => {
    const value = process.env[name]?.trim()
    if (!value) return fallback

    const parsed = Number(value)
    if (!Number.isInteger(parsed) || parsed <= 0) {
        throw new Error(`${name} doit être un entier strictement positif.`)
    }
    return parsed
}

export const configApp = {
    site: {
        title: envOrDefault('SITE_TITLE', DEFAULT_SITE_TITLE),
        description: envOrDefault('SITE_DESCRIPTION', DEFAULT_SITE_DESCRIPTION),
    },
    routes: {
        home: '/',
        login: '/connexion',
        administration: '/administration',
    },
    articles: {
        pageSize: positiveIntegerEnvOrDefault('ARTICLES_PAGE_SIZE', 10),
    },
    session: {
        cookieName: envOrDefault('SESSION_COOKIE_NAME', DEFAULT_SESSION_COOKIE_NAME),
        cookieOptions: {
            httpOnly: true,
            sameSite: 'lax' as const,
            path: '/',
            secure: process.env.NODE_ENV === 'production',
            maxAge: positiveIntegerEnvOrDefault(
                'SESSION_COOKIE_MAX_AGE',
                DEFAULT_SESSION_MAX_AGE
            ),
            domain: optionalEnv('SESSION_COOKIE_DOMAIN'),
        },
    },
} as const

export type IConfigApp = typeof configApp
