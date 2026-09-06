import 'server-only'

import { getRepositories } from '@/repositories'
import { servicePasswordHashing } from '@/services/password-hashing'
import { serviceMapRepositoryErrorAs, type IRepositoryErrorResult } from '@/services/repository-errors'
import {
    serviceValidationLimits,
    serviceFieldErrors,
    serviceIsValidEmail,
    servicePasswordPolicy,
    serviceReadPassword,
    serviceToTrimmedString,
} from '@/services/validation'
import { IRole, type IActionResult, type IUser } from '@/types'

export interface ICreateUserInput extends Partial<IUser> {
    login?: string
    password?: string
}

const validateUserCreate = (values: Partial<IUser>): IActionResult<Partial<IUser>> | undefined => {
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

const validateUserUpdate = (values: Partial<IUser>): IActionResult<Partial<IUser>> | undefined => {
    const errors = serviceFieldErrors(
        ['name', values.name !== undefined
            ? (typeof values.name !== 'string' || !values.name.trim()
                ? 'Le nom est obligatoire.'
                : values.name.trim().length > serviceValidationLimits.name
                    ? 'Le nom est trop long.'
                    : undefined)
            : undefined],
        ['pseudonym', values.pseudonym !== undefined
            ? (typeof values.pseudonym !== 'string' || !values.pseudonym.trim()
                ? 'Le pseudonyme est obligatoire.'
                : values.pseudonym.trim().length > serviceValidationLimits.pseudonym
                    ? 'Le pseudonyme est trop long.'
                    : undefined)
            : undefined],
        ['email', values.email !== undefined
            ? (!serviceIsValidEmail(serviceToTrimmedString(values.email, serviceValidationLimits.email).toLocaleLowerCase('fr-FR'))
                ? 'L’adresse e-mail est invalide.'
                : undefined)
            : undefined],
        ['role', values.role !== undefined && !Object.values(IRole).includes(values.role) ? 'Le rôle est invalide.' : undefined],
    )
    return Object.keys(errors).length ? { success: false, message: 'L’utilisateur contient des erreurs.', errors } : undefined
}

const validateAccountCredentials = (login: string, password: string): IRepositoryErrorResult | undefined => {
    const errors = serviceFieldErrors(
        ['login', !login ? 'L’identifiant est obligatoire.' : login.length > 100 ? 'L’identifiant est trop long.' : undefined],
        ['password', !password
            ? 'Le mot de passe est obligatoire.'
            : password.length < servicePasswordPolicy.minLength
                ? `Le mot de passe doit contenir au moins ${servicePasswordPolicy.minLength} caractères.`
                : password.length > servicePasswordPolicy.maxLength
                    ? 'Le mot de passe est trop long.'
                    : undefined],
    )
    return Object.keys(errors).length ? { success: false, message: 'L’utilisateur contient des erreurs.', errors } : undefined
}

const mapRepositoryError = <T>(error: unknown): IActionResult<T> => {
    const mapped = serviceMapRepositoryErrorAs<T>(error)
    if (mapped) return mapped
    throw error
}

export const serviceUser = {
    getUsers: async (): Promise<IUser[]> => getRepositories().users.findUsers(),
    getUserById: async (id: string): Promise<IUser | undefined> =>
        getRepositories().users.findUserById(id),
    getAccountLoginByUserId: async (userId: string): Promise<string | undefined> => {
        const account = await getRepositories().users.findAccountByUserId(userId)
        return account?.login
    },
    createUser: async (values: ICreateUserInput): Promise<IActionResult<IUser>> => {
        const validation = validateUserCreate(values)
        if (validation) return validation as IActionResult<IUser>

        const login = serviceToTrimmedString(values.login, 100)
        const password = serviceReadPassword(values.password)
        const accountValidation = validateAccountCredentials(login, password)
        if (accountValidation) return accountValidation

        const existingLogin = await getRepositories().users.findAccountByLogin(login)
        if (existingLogin) {
            return {
                success: false,
                message: 'Cet identifiant est déjà utilisé.',
                errors: { login: 'Cet identifiant est déjà utilisé.' },
            }
        }

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

        try {
            const passwordHash = await servicePasswordHashing.hashPassword(password)
            const created = await getRepositories().users.createUserWithAccount(user, { login, passwordHash })
            return { success: true, message: 'Utilisateur créé.', data: created }
        } catch (error) {
            return mapRepositoryError<IUser>(error)
        }
    },
    updateUser: async (id: string, values: Partial<IUser>): Promise<IActionResult<IUser>> => {
        const userValues: Partial<IUser> = {}
        if (values.name !== undefined) userValues.name = values.name
        if (values.pseudonym !== undefined) userValues.pseudonym = values.pseudonym
        if (values.email !== undefined) userValues.email = values.email
        if (values.role !== undefined) userValues.role = values.role

        const validation = validateUserUpdate(userValues)
        if (validation) return validation as IActionResult<IUser>

        try {
            const updated = await getRepositories().users.updateUser(id, {
                name: typeof userValues.name === 'string' ? userValues.name.trim() : undefined,
                pseudonym: typeof userValues.pseudonym === 'string' ? userValues.pseudonym.trim() : undefined,
                email: userValues.email
                    ? serviceToTrimmedString(userValues.email, serviceValidationLimits.email).toLocaleLowerCase('fr-FR')
                    : undefined,
                role: userValues.role,
            })
            if (!updated) return { success: false, message: 'Utilisateur introuvable.' }
            return { success: true, message: 'Utilisateur modifié.', data: updated }
        } catch (error) {
            return mapRepositoryError<IUser>(error)
        }
    },
    deleteUser: async (id: string): Promise<IActionResult> => {
        const deleted = await getRepositories().users.deleteUser(id)
        if (!deleted) {
            return { success: false, message: 'Impossible de supprimer cet utilisateur.' }
        }
        return { success: true, message: 'Utilisateur supprimé.' }
    },
}
