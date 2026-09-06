import { getRepositories } from '@/repositories'
import { serviceValidationLimits, serviceFieldErrors, serviceIsValidEmail, serviceToTrimmedString } from '@/services/validation'
import { IRole, type IActionResult, type IUser } from '@/types'

export const serviceUser = {
    getUsers: async (): Promise<IUser[]> => getRepositories().users.findAll(),
    getUserById: async (id: string): Promise<IUser | undefined> =>
        getRepositories().users.findById(id),
    simulateMutation: async (
        values: Partial<IUser>
    ): Promise<IActionResult<Partial<IUser>>> => {
        const rawName = typeof values.name === 'string' ? values.name.trim() : ''
        const email = serviceToTrimmedString(values.email, serviceValidationLimits.email).toLocaleLowerCase('fr-FR')
        const errors = serviceFieldErrors(
            ['name', !rawName ? 'Le nom est obligatoire.' : rawName.length > serviceValidationLimits.name ? 'Le nom est trop long.' : undefined],
            ['email', !serviceIsValidEmail(email) ? 'L’adresse e-mail est invalide.' : undefined],
            ['role', values.role && !Object.values(IRole).includes(values.role) ? 'Le rôle est invalide.' : undefined],
        )
        if (Object.keys(errors).length) return { success: false, message: 'L’utilisateur contient des erreurs.', errors }
        return { success: true, message: 'Utilisateur mis à jour dans la simulation. La modification ne sera pas conservée.', data: values }
    },
}
