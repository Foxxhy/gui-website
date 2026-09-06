import { users } from '@/mocks'
import type { IUserRepository } from '@/repositories/types'

export const mockUserRepository: IUserRepository = {
    findAll: async () => users,
    findById: async (id) => users.find((user) => user.id === id),
}
