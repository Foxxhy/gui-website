import 'server-only'

import { accounts, users } from '@/mocks'
import { IRole, type IUser, type IUserCredentials } from '@/types'
import type { IUserRepository } from '@/repositories/types'

const toCredentials = (account: (typeof accounts)[number]): IUserCredentials => ({
    userId: account.user.id,
    login: account.login,
    passwordHash: account.passwordHash,
})

export const repositoryUserMock: IUserRepository = {
    findUserById: async (id: string): Promise<IUser | undefined> =>
        users.find((user) => user.id === id),
    findUsers: async (): Promise<IUser[]> => users,
    findAccountByLogin: async (login: string): Promise<IUserCredentials | undefined> => {
        const account = accounts.find((candidate) => candidate.login === login)
        return account ? toCredentials(account) : undefined
    },
    findAccountByUserId: async (userId: string): Promise<IUserCredentials | undefined> => {
        const account = accounts.find((candidate) => candidate.user.id === userId)
        return account ? toCredentials(account) : undefined
    },
    updatePasswordHash: async (userId: string, passwordHash: string): Promise<boolean> => {
        const account = accounts.find((candidate) => candidate.user.id === userId)
        if (!account) return false
        account.passwordHash = passwordHash
        return true
    },
    incrementSessionVersion: async (userId: string): Promise<number> => {
        const user = users.find((candidate) => candidate.id === userId)
        if (!user) return 0
        user.sessionVersion += 1
        user.updatedAt = new Date().toISOString()
        return user.sessionVersion
    },
    createUser: async (user) => {
        users.push(user)
        return user
    },
    createAccount: async (credentials) => {
        const user = users.find((candidate) => candidate.id === credentials.userId)
        if (!user) {
            throw new Error('Utilisateur introuvable pour la création du compte.')
        }
        if (accounts.some((account) => account.login === credentials.login)) {
            throw new Error('Cet identifiant est déjà utilisé.')
        }
        accounts.push({
            user,
            login: credentials.login,
            passwordHash: credentials.passwordHash,
        })
        return credentials
    },
    updateUser: async (id, values) => {
        const user = users.find((candidate) => candidate.id === id)
        if (!user) return undefined
        Object.assign(user, values, { updatedAt: new Date().toISOString() })
        return user
    },
    deleteUser: async (id) => {
        const userIndex = users.findIndex((user) => user.id === id)
        if (userIndex < 0) return false

        const adminCount = users.filter((user) => user.role === IRole.ADMIN).length
        if (users[userIndex].role === IRole.ADMIN && adminCount <= 1) return false

        users.splice(userIndex, 1)
        const accountIndex = accounts.findIndex((account) => account.user.id === id)
        if (accountIndex >= 0) accounts.splice(accountIndex, 1)
        return true
    },
}
