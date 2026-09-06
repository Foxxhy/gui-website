import 'server-only'

import { verifyPassword } from '@/services/auth/password'
import { parseSessionToken } from '@/services/auth/session-token'
import { configApp } from '@/configs'
import { repositoryAuth } from '@/repositories'
import {
    ADMINISTRATION_PERMISSIONS,
    canManageArea,
    IRole,
    type ICredentials,
    type IServiceAdminArea,
    type ISession,
} from '@/types'

export { ADMINISTRATION_PERMISSIONS, canManageArea }
export type { IServiceAdminArea }

export const serviceSessionCookie = configApp.session.cookieName

export const serviceAuth = {
    authenticate: async ({ login, password }: ICredentials) => {
        const account = repositoryAuth.findAccountByLogin(login)
        if (!account || !verifyPassword(password, account.passwordHash)) return undefined
        return repositoryAuth.findUserById(account.userId)
    },
    getSessionFromToken: async (token?: string): Promise<ISession | undefined> => {
        const payload = parseSessionToken(token)
        if (!payload) return undefined
        const user = repositoryAuth.findUserById(payload.userId)
        if (!user) return undefined
        return { user }
    },
    canManage: (role: Parameters<typeof canManageArea>[0], area: IServiceAdminArea) =>
        canManageArea(role, area),
    canPerform: (role: Parameters<typeof canManageArea>[0], area: IServiceAdminArea, operation: string) => {
        if (!serviceAuth.canManage(role, area)) return false
        if (area === 'features' || area === 'users') return role === IRole.ADMIN
        return operation.trim().length > 0 && operation.length <= 80
    },
}
