import { IRole, type IUser } from './user'

export interface IAuthenticatedUser extends IUser {}

export interface ISession {
    user: IAuthenticatedUser
}

export interface ICredentials {
    login: string
    password: string
}

export interface IAccount {
    id: string
    userId: string
    login: string
    passwordHash: string
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

export const canManageArea = (role: IRole, area: IServiceAdminArea): boolean => {
    if (role === IRole.BLOCKED) return false
    return (ADMINISTRATION_PERMISSIONS[area] as readonly IRole[]).includes(role)
}
