import type { IFeatureFlags, IFeatureKey } from '@/types'

export interface IPublicNavLink {
    href: string
    label: string
    feature?: IFeatureKey
    highlighted?: boolean
}

export const publicNavLinks: IPublicNavLink[] = [
    { href: '/', label: 'Accueil', feature: 'home' },
    { href: '/articles', label: 'Articles', feature: 'articles' },
    { href: '/association', label: 'L’association' },
    { href: '/contact', label: 'Témoigner', feature: 'contact', highlighted: true },
]

export const publicFooterLinks: IPublicNavLink[] = [
    ...publicNavLinks,
    { href: '/gestion-des-donnees', label: 'Gestion des données' },
]

export const filterPublicLinks = (links: IPublicNavLink[], features: IFeatureFlags) =>
    links.filter((link) => !link.feature || features[link.feature])
