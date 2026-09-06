import 'server-only'

import { repositoryUser } from '@/repositories/users'
import { configApp } from '@/configs'
import { servicePasswordHashing } from '@/services/password-hashing'
import { IRole, type ICredentials, type ISession } from '@/types'

export const serviceSessionCookie = configApp.session.cookieName

export type IServiceAdminArea =
    | 'articles'
    | 'pages'
    | 'contactForm'
    | 'tags'
    | 'users'
    | 'features'
    | 'analytics'

export const serviceAuth = {
    authenticate: async ({ login, password }: ICredentials) => {
        const account = await repositoryUser.findAccountByLogin(login)
        if (!account) return undefined
        const isValid = await servicePasswordHashing.verifyPassword(password, account.passwordHash)
        if (!isValid) return undefined
        return repositoryUser.findUserById(account.userId)
    },
    getSessionFromLogin: async (login?: string): Promise<ISession | undefined> => {
        const user = await repositoryUser.findUserById(login ?? '')
        if (!user || user.role === IRole.BLOCKED) return undefined
        return { user }
    },
    canManage: (role: IRole, area: IServiceAdminArea) => {
        if (role === IRole.BLOCKED) return false
        if (area === 'users' || area === 'features') return role === IRole.ADMIN
        return role === IRole.ADMIN || role === IRole.EDITOR
    },
    canPerform: (role: IRole, area: IServiceAdminArea, operation: string) => {
        if (!serviceAuth.canManage(role, area)) return false
        if (area === 'features' || area === 'users') return role === IRole.ADMIN
        return operation.trim().length > 0 && operation.length <= 80
    },
}
