import { users } from '@/mocks'
import type { IActionResult, IUser } from '@/types'

export const userService = {
    getUsers: async (): Promise<IUser[]> => users,
    getUserById: async (id: string): Promise<IUser | undefined> =>
        users.find((user) => user.id === id),
    simulateMutation: async (
        values: Partial<IUser>
    ): Promise<IActionResult<Partial<IUser>>> => ({
        success: true,
        message: 'Utilisateur mis à jour dans la simulation. La modification ne sera pas conservée.',
        data: values,
    }),
}