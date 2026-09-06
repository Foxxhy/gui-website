import 'server-only'

import { getRepositories } from '@/repositories'
import { servicePasswordHashing } from '@/services/password-hashing'
import { serviceValidationLimits, serviceFieldErrors, serviceIsValidEmail, serviceIsValidSlug, serviceToTrimmedString } from '@/services/validation'
import { IRole, type IActionResult, type IUser } from '@/types'

const validateUser = (values: Partial<IUser> & { login?: string; password?: string }, requireCredentials = false): IActionResult<Partial<IUser>> | undefined => {
    const rawName = typeof values.name === 'string' ? values.name.trim() : ''
    const rawPseudonym = typeof values.pseudonym === 'string' ? values.pseudonym.trim() : ''
    const email = serviceToTrimmedString(values.email, serviceValidationLimits.email).toLocaleLowerCase('fr-FR')
    const login = serviceToTrimmedString(values.login, serviceValidationLimits.name)
    const password = typeof values.password === 'string' ? values.password : ''

    const errors = serviceFieldErrors(
        ['name', !rawName ? 'Le nom est obligatoire.' : rawName.length > serviceValidationLimits.name ? 'Le nom est trop long.' : undefined],
        ['pseudonym', !rawPseudonym ? 'Le pseudonyme est obligatoire.' : rawPseudonym.length > serviceValidationLimits.pseudonym ? 'Le pseudonyme est trop long.' : undefined],
        ['email', !serviceIsValidEmail(email) ? 'L’adresse e-mail est invalide.' : undefined],
        ['role', values.role && !Object.values(IRole).includes(values.role) ? 'Le rôle est invalide.' : undefined],
        ['login', requireCredentials && !login ? 'L’identifiant est obligatoire.' : login && !serviceIsValidSlug(login) ? 'L’identifiant est invalide.' : undefined],
        ['password', requireCredentials && password.length < 8 ? 'Le mot de passe doit contenir au moins 8 caractères.' : password.length > 200 ? 'Le mot de passe est trop long.' : undefined],
    )
    return Object.keys(errors).length ? { success: false, message: 'L’utilisateur contient des erreurs.', errors } : undefined
}

export const serviceUser = {
    getUsers: async (): Promise<IUser[]> => getRepositories().users.findUsers(),
    getUserById: async (id: string): Promise<IUser | undefined> =>
        getRepositories().users.findUserById(id),
    getAccountLoginByUserId: async (userId: string): Promise<string | undefined> => {
        const account = await getRepositories().users.findAccountByUserId(userId)
        return account?.login
    },
    createUser: async (values: Partial<IUser> & { login?: string; password?: string }): Promise<IActionResult<IUser>> => {
        const validation = validateUser(values, true)
        if (validation) return validation as IActionResult<IUser>

        const login = serviceToTrimmedString(values.login, serviceValidationLimits.name)
        const existingAccount = login ? await getRepositories().users.findAccountByLogin(login) : undefined
        if (existingAccount) {
            return { success: false, message: 'Cet identifiant est déjà utilisé.', errors: { login: 'Cet identifiant est déjà utilisé.' } }
        }

        const now = new Date().toISOString()
        const user: IUser = {
            id: `user-${Date.now()}`,
            name: String(values.name).trim(),
            pseudonym: String(values.pseudonym).trim(),
            email: serviceToTrimmedString(values.email, serviceValidationLimits.email).toLocaleLowerCase('fr-FR'),
            role: values.role ?? IRole.EDITOR,
            sessionVersion: 0,
            createdAt: now,
            updatedAt: now,
        }
        const created = await getRepositories().users.createUser(user)

        if (login && values.password) {
            const passwordHash = await servicePasswordHashing.hashPassword(values.password)
            await getRepositories().users.createAccount({
                userId: created.id,
                login,
                passwordHash,
            })
        }

        return { success: true, message: 'Utilisateur créé.', data: created }
    },
    updateUser: async (id: string, values: Partial<IUser>): Promise<IActionResult<IUser>> => {
        const validation = validateUser(values)
        if (validation) return validation as IActionResult<IUser>

        const updated = await getRepositories().users.updateUser(id, {
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
        const deleted = await getRepositories().users.deleteUser(id)
        if (!deleted) {
            return { success: false, message: 'Impossible de supprimer cet utilisateur.' }
        }
        return { success: true, message: 'Utilisateur supprimé.' }
    },
}
