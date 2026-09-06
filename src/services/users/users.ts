import { repositoryUser } from '@/repositories'
import type { IActionResult, IUser } from '@/types'

export const serviceUser = {
    getUsers: async (): Promise<IUser[]> => repositoryUser.findAll(),
    getUserById: async (id: string): Promise<IUser | undefined> => repositoryUser.findById(id),
    createUser: async (values: Partial<IUser>): Promise<IActionResult<IUser>> =>
        repositoryUser.create(values),
    updateUser: async (id: string, values: Partial<IUser>): Promise<IActionResult<IUser>> =>
        repositoryUser.update(id, values),
    deleteUser: async (id: string): Promise<IActionResult> => repositoryUser.delete(id),
}
