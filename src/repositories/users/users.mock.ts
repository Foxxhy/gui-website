import 'server-only'

import { accounts, users } from '@/mocks'
import type { IUser, IUserCredentials, IUserRepository } from '@/types'

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
}

export const repositoryUser = repositoryUserMock
