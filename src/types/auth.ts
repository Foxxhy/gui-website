import { IRole, type IUser } from './user'

export type IAuthenticatedUser = IUser

export interface ISession {
    user: IAuthenticatedUser
}

export interface ICredentials {
    login: string
    password: string
}

export const ADMINISTRATION_PERMISSIONS = {
    articles: [IRole.ADMIN, IRole.EDITOR],
    pages: [IRole.ADMIN, IRole.EDITOR],
    tags: [IRole.ADMIN, IRole.EDITOR],
    contactForm: [IRole.ADMIN, IRole.EDITOR],
    users: [IRole.ADMIN],
    features: [IRole.ADMIN],
    analytics: [IRole.ADMIN, IRole.EDITOR],
} as const

export type IServiceAdminArea = keyof typeof ADMINISTRATION_PERMISSIONS

export const MUTATION_AREAS = [
    'articles',
    'pages',
    'contactForm',
    'tags',
    'users',
    'features',
] as const satisfies readonly IServiceAdminArea[]

export const ADMIN_OPERATIONS = [
    'créé',
    'modifiée',
    'modifié',
    'supprimé',
    'champ ajouté',
    'champ modifié',
    'champ supprimé',
    'ordre modifié',
] as const

export type IAdminOperation = (typeof ADMIN_OPERATIONS)[number]

export const isAdminOperation = (value: string): value is IAdminOperation =>
    (ADMIN_OPERATIONS as readonly string[]).includes(value)

export const canManageArea = (role: IRole, area: IServiceAdminArea): boolean => {
    if (role === IRole.BLOCKED) return false
    return (ADMINISTRATION_PERMISSIONS[area] as readonly IRole[]).includes(role)
}
