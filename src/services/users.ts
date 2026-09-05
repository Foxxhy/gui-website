import { users } from '@/mocks'
import { IRole, type IActionResult, type IUser } from '@/types'
import { VALIDATION_LIMITS, fieldErrors, isValidEmail, toTrimmedString } from './validation'

export const userService = {
    getUsers: async (): Promise<IUser[]> => users,
    getUserById: async (id: string): Promise<IUser | undefined> =>
        users.find((user) => user.id === id),
    simulateMutation: async (
        values: Partial<IUser>
    ): Promise<IActionResult<Partial<IUser>>> => {
        const rawName = typeof values.name === 'string' ? values.name.trim() : ''
        const email = toTrimmedString(values.email, VALIDATION_LIMITS.email).toLocaleLowerCase('fr-FR')
        const errors = fieldErrors(
            ['name', !rawName ? 'Le nom est obligatoire.' : rawName.length > VALIDATION_LIMITS.name ? 'Le nom est trop long.' : undefined],
            ['email', !isValidEmail(email) ? 'L’adresse e-mail est invalide.' : undefined],
            ['role', values.role && !Object.values(IRole).includes(values.role) ? 'Le rôle est invalide.' : undefined],
        )
        if (Object.keys(errors).length) return { success: false, message: 'L’utilisateur contient des erreurs.', errors }
        return { success: true, message: 'Utilisateur mis à jour dans la simulation. La modification ne sera pas conservée.', data: values }
    },
}