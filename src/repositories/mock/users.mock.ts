import 'server-only'

import { accounts, users } from '@/mocks'
import { IRole, type IUser, type IUserCredentials, type IUserRepository } from '@/types'

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
    createUser: async (user) => {
        users.push(user)
        return user
    },
    createUserWithAccount: async (user, credentials) => {
        users.push(user)
        accounts.push({
            user,
            login: credentials.login,
            passwordHash: credentials.passwordHash,
        })
        return user
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
