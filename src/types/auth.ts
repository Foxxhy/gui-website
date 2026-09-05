import { IRole, type IUser } from './user'

export interface IAuthenticatedUser extends IUser {}

export interface ISession {
    user: IAuthenticatedUser
}

export interface ICredentials {
    login: string
    password: string
}

export const ADMINISTRATION_PERMISSIONS = {
    articles: [
        IRole.ADMIN,
        IRole.EDITOR,
    ],
    pages: [
        IRole.ADMIN,
        IRole.EDITOR,
    ],
    tags: [
        IRole.ADMIN,
        IRole.EDITOR,
    ],
    contactForm: [
        IRole.ADMIN,
        IRole.EDITOR,
    ],
    users: [IRole.ADMIN],
} as const