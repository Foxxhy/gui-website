import { mockStore } from '@/repositories/mock-store'
import { serviceValidationLimits, serviceFieldErrors, serviceIsValidEmail, serviceToTrimmedString } from '@/services/validation'
import { IRole, type IActionResult, type IUser } from '@/types'
import type { IUserRepository } from './users'

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

export const mockUserRepository: IUserRepository = {
    findAll: () => mockStore.getSnapshot().users,
    findById: (id) => mockStore.getSnapshot().users.find((user) => user.id === id),
    create: (values) => {
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
        mockStore.getSnapshot().users.push(user)
        return { success: true, message: 'Utilisateur créé.', data: user }
    },
    update: (id, values) => {
        const store = mockStore.getSnapshot()
        const user = store.users.find((candidate) => candidate.id === id)
        if (!user) return { success: false, message: 'Utilisateur introuvable.' }

        const validation = validateUser(values)
        if (validation) return validation as IActionResult<IUser>

        Object.assign(user, {
            name: typeof values.name === 'string' ? values.name.trim() : user.name,
            pseudonym: typeof values.pseudonym === 'string' ? values.pseudonym.trim() : user.pseudonym,
            email: values.email
                ? serviceToTrimmedString(values.email, serviceValidationLimits.email).toLocaleLowerCase('fr-FR')
                : user.email,
            role: values.role ?? user.role,
            updatedAt: new Date().toISOString(),
        })
        return { success: true, message: 'Utilisateur modifié.', data: user }
    },
    delete: (id) => {
        const store = mockStore.getSnapshot()
        const userIndex = store.users.findIndex((user) => user.id === id)
        if (userIndex < 0) return { success: false, message: 'Utilisateur introuvable.' }

        const adminCount = store.users.filter((user) => user.role === IRole.ADMIN).length
        if (store.users[userIndex].role === IRole.ADMIN && adminCount <= 1) {
            return { success: false, message: 'Impossible de supprimer le dernier administrateur.' }
        }

        store.users.splice(userIndex, 1)
        store.accounts = store.accounts.filter((account) => account.userId !== id)
        for (const article of store.articles) {
            if (article.author?.id === id) {
                article.author = undefined
            }
        }
        return { success: true, message: 'Utilisateur supprimé.' }
    },
}
