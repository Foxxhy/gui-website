import type { IRole, IServiceAdminArea } from '@/types'

export interface IAdminNavLink {
    href: string
    label: string
    area?: IServiceAdminArea
}

export interface IAdminNavGroup {
    label: string
    items: IAdminNavLink[]
}

export const adminDashboardLink: IAdminNavLink = {
    href: '/administration',
    label: 'Tableau de bord',
}

export const adminAccountLink: IAdminNavLink = {
    href: '/administration/compte',
    label: 'Mon compte',
}

export const adminContentGroup: IAdminNavGroup = {
    label: 'Gestion du contenu',
    items: [
        { href: '/administration/pages/page-home', label: 'Accueil', area: 'pages' },
        { href: '/administration/articles', label: 'Articles', area: 'articles' },
        { href: '/administration/tags', label: 'Tags', area: 'tags' },
        { href: '/administration/pages/page-association', label: 'L’association', area: 'pages' },
        {
            href: '/administration/pages/page-gestion-donnees',
            label: 'Gestion des données',
            area: 'pages',
        },
    ],
}

export const adminStandaloneLinks: IAdminNavLink[] = [
    { href: '/administration/utilisateurs', label: 'Gestion des utilisateurs', area: 'users' },
    { href: '/administration/formulaire-contact', label: 'Formulaire de contact', area: 'contactForm' },
    { href: '/administration/analytics', label: 'Analytics', area: 'analytics' },
]

const canAccessLink = (role: IRole, link: IAdminNavLink, canManage: (role: IRole, area: IServiceAdminArea) => boolean) =>
    !link.area || canManage(role, link.area)

export const buildAdminNavigation = (
    role: IRole,
    canManage: (role: IRole, area: IServiceAdminArea) => boolean
) => ({
    dashboard: adminDashboardLink,
    account: adminAccountLink,
    contentGroup: {
        ...adminContentGroup,
        items: adminContentGroup.items.filter((link) => canAccessLink(role, link, canManage)),
    },
    standaloneLinks: adminStandaloneLinks.filter((link) => canAccessLink(role, link, canManage)),
})

export type IAdminNavigation = ReturnType<typeof buildAdminNavigation>
