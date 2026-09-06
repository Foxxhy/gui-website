import 'server-only'

import { getRepositories } from '@/repositories'
import { configApp } from '@/configs'
import { parseSessionToken } from '@/services/auth/session-token'
import { servicePasswordHashing } from '@/services/password-hashing'
import {
    ADMINISTRATION_PERMISSIONS,
    canManageArea,
    IRole,
    isAdminOperation,
    type IAdminOperation,
    type ICredentials,
    type IServiceAdminArea,
    type ISession,
} from '@/types'

export { ADMINISTRATION_PERMISSIONS, canManageArea }
export type { IServiceAdminArea }

export const serviceSessionCookie = configApp.session.cookieName

export const serviceAuth = {
    authenticate: async ({ login, password }: ICredentials) => {
        const account = await getRepositories().users.findAccountByLogin(login)
        if (!account) return undefined
        const isValid = await servicePasswordHashing.verifyPassword(password, account.passwordHash)
        if (!isValid) return undefined
        const user = await getRepositories().users.findUserById(account.userId)
        if (!user || user.role === IRole.BLOCKED) return undefined
        return user
    },
    getSessionFromToken: async (token?: string): Promise<ISession | undefined> => {
        const payload = parseSessionToken(token)
        if (!payload) return undefined
        const user = await getRepositories().users.findUserById(payload.userId)
        if (!user || user.role === IRole.BLOCKED) return undefined
        if (user.sessionVersion !== payload.sessionVersion) return undefined
        return { user }
    },
    canManage: (role: Parameters<typeof canManageArea>[0], area: IServiceAdminArea) =>
        canManageArea(role, area),
    canPerform: (role: Parameters<typeof canManageArea>[0], area: IServiceAdminArea, operation: string) => {
        if (!serviceAuth.canManage(role, area)) return false
        if (area === 'features' || area === 'users') return role === IRole.ADMIN
        return isAdminOperation(operation)
    },
    isAllowedOperation: (operation: string): operation is IAdminOperation => isAdminOperation(operation),
}
