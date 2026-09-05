import { accounts, users } from '@/mocks'
import { appConfig } from '@/configs'
import { IRole, type ICredentials, type ISession } from '@/types'

export const SESSION_COOKIE = appConfig.session.cookieName

export const authService = {
    authenticate: async ({ login, password }: ICredentials) =>
        accounts.find(
            (account) => account.login === login && account.password === password
        )?.user,
    getSessionFromLogin: async (login?: string): Promise<ISession | undefined> => {
        const user = users.find((candidate) => candidate.id === login)
        if (!user || user.role === IRole.BLOCKED) return undefined
        return { user }
    },
    canManage: (role: IRole, area: 'articles' | 'pages' | 'contactForm' | 'tags' | 'users' | 'features' | 'analytics') => {
        if (role === IRole.BLOCKED) return false
        if (area === 'users' || area === 'features') return role === IRole.ADMIN
        return role === IRole.ADMIN || role === IRole.EDITOR
    },
    canPerform: (
        role: IRole,
        area: 'articles' | 'pages' | 'contactForm' | 'tags' | 'users' | 'features' | 'analytics',
        operation: string
    ) => {
        if (!authService.canManage(role, area)) return false
        if (area === 'features' || area === 'users') return role === IRole.ADMIN
        return operation.trim().length > 0 && operation.length <= 80
    },
}