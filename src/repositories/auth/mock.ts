import { mockStore, mockStoreSync } from '@/repositories/mock-store'
import type { IAuthRepository } from './auth'

export const mockAuthRepository: IAuthRepository = {
    findAccountByLogin: (login) =>
        mockStore.getSnapshot().accounts.find((account) => account.login === login),
    findUserById: (id) => mockStoreSync.getUserById(id),
}
