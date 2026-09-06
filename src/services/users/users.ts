import 'server-only'

import { repositoryUser } from '@/repositories/users'
import { serviceValidationLimits, serviceFieldErrors, serviceIsValidEmail, serviceToTrimmedString } from '@/services/validation'
import { IRole, type IActionResult, type IUser } from '@/types'

const validateUser = (values: Partial<IUser>): IActionResult<Partial<IUser>> | undefined => {
    const rawName = typeof values.name === 'string' ? values.name.trim() : ''
    const rawPseudonym = typeof values.pseudonym === 'string' ? values.pseudonym.trim() : ''
    const email = serviceToTrimmedString(values.email, serviceValidationLimits.email).toLocaleLowerCase('fr-FR')
    const errors = serviceFieldErrors(
        ['name', !rawName ? 'Le nom est obligatoire.' : rawName.length > serviceValidationLimits.name ? 'Le nom est trop long.' : undefined],
        ['pseudonym', !rawPseudonym ? 'Le pseudonyme est obligatoire.' : rawPseudonym.length > serviceValidationLimits.pseudonym ? 'Le pseudonyme est trop long.' : undefined],
        ['email', !serviceIsValidEmail(email) ? 'L’adresse e-mail est invalide.' : undefined],
        ['role', values.role && !Object.values(IRole).includes(values.role) ? 'Le rôle est invalide.' : undefined],
    )
    return Object.keys(errors).length ? { success: false, message: 'L’utilisateur contient des erreurs.', errors } : undefined
}

export const serviceUser = {
    getUsers: async (): Promise<IUser[]> => repositoryUser.findUsers(),
    getUserById: async (id: string): Promise<IUser | undefined> =>
        repositoryUser.findUserById(id),
    createUser: async (values: Partial<IUser>): Promise<IActionResult<IUser>> => {
        const validation = validateUser(values)
        if (validation) return validation as IActionResult<IUser>

        const now = new Date().toISOString()
        const user: IUser = {
            id: `user-${Date.now()}`,
            name: String(values.name).trim(),
            pseudonym: String(values.pseudonym).trim(),
            email: serviceToTrimmedString(values.email, serviceValidationLimits.email).toLocaleLowerCase('fr-FR'),
            role: values.role ?? IRole.EDITOR,
            createdAt: now,
            updatedAt: now,
        }
        const created = await repositoryUser.createUser(user)
        return { success: true, message: 'Utilisateur créé.', data: created }
    },
    updateUser: async (id: string, values: Partial<IUser>): Promise<IActionResult<IUser>> => {
        const validation = validateUser(values)
        if (validation) return validation as IActionResult<IUser>

        const updated = await repositoryUser.updateUser(id, {
            name: typeof values.name === 'string' ? values.name.trim() : undefined,
            pseudonym: typeof values.pseudonym === 'string' ? values.pseudonym.trim() : undefined,
            email: values.email
                ? serviceToTrimmedString(values.email, serviceValidationLimits.email).toLocaleLowerCase('fr-FR')
                : undefined,
            role: values.role,
        })
        if (!updated) return { success: false, message: 'Utilisateur introuvable.' }
        return { success: true, message: 'Utilisateur modifié.', data: updated }
    },
    deleteUser: async (id: string): Promise<IActionResult> => {
        const deleted = await repositoryUser.deleteUser(id)
        if (!deleted) {
            return { success: false, message: 'Impossible de supprimer cet utilisateur.' }
        }
        return { success: true, message: 'Utilisateur supprimé.' }
    },
}
