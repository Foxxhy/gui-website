import 'server-only'

import { getRepositories } from '@/repositories'
import { servicePasswordHashing } from '@/services/password-hashing'
import { serviceValidateNewPassword } from '@/services/validation'
import { IRole, type IActionResult } from '@/types'

type IChangeOwnPasswordInput = {
    currentPassword: string
    newPassword: string
    confirmPassword: string
}

type IChangeUserPasswordByAdminInput = {
    newPassword: string
    confirmPassword: string
}

export const servicePassword = {
    changeOwnPassword: async (
        actorUserId: string,
        input: IChangeOwnPasswordInput
    ): Promise<IActionResult & { sessionVersion?: number }> => {
        const errors = serviceValidateNewPassword(
            input.newPassword,
            input.confirmPassword,
            true,
            input.currentPassword
        )
        if (Object.keys(errors).length > 0) {
            return { success: false, message: 'Le mot de passe contient des erreurs.', errors }
        }

        const account = await getRepositories().users.findAccountByUserId(actorUserId)
        if (!account) {
            return { success: false, message: 'Compte introuvable.' }
        }

        const isCurrentValid = await servicePasswordHashing.verifyPassword(input.currentPassword, account.passwordHash)
        if (!isCurrentValid) {
            return {
                success: false,
                message: 'Le mot de passe actuel est incorrect.',
                errors: { currentPassword: 'Le mot de passe actuel est incorrect.' },
            }
        }

        const passwordHash = await servicePasswordHashing.hashPassword(input.newPassword)
        const updated = await getRepositories().users.updatePasswordHash(actorUserId, passwordHash)
        if (!updated) {
            return { success: false, message: 'Impossible de mettre à jour le mot de passe.' }
        }

        const sessionVersion = await getRepositories().users.incrementSessionVersion(actorUserId)
        return { success: true, message: 'Votre mot de passe a été modifié.', sessionVersion }
    },
    changeUserPasswordByAdmin: async (
        actorRole: IRole,
        targetUserId: string,
        input: IChangeUserPasswordByAdminInput
    ): Promise<IActionResult & { sessionVersion?: number }> => {
        if (actorRole !== IRole.ADMIN) {
            return { success: false, message: 'Vous n’êtes pas autorisé à effectuer cette opération.' }
        }

        const errors = serviceValidateNewPassword(input.newPassword, input.confirmPassword)
        if (Object.keys(errors).length > 0) {
            return { success: false, message: 'Le mot de passe contient des erreurs.', errors }
        }

        const user = await getRepositories().users.findUserById(targetUserId)
        if (!user) {
            return { success: false, message: 'Utilisateur introuvable.' }
        }

        const account = await getRepositories().users.findAccountByUserId(targetUserId)
        if (!account) {
            return { success: false, message: 'Ce compte ne possède pas d’identifiants configurés.' }
        }

        const passwordHash = await servicePasswordHashing.hashPassword(input.newPassword)
        const updated = await getRepositories().users.updatePasswordHash(targetUserId, passwordHash)
        if (!updated) {
            return { success: false, message: 'Impossible de mettre à jour le mot de passe.' }
        }

        const sessionVersion = await getRepositories().users.incrementSessionVersion(targetUserId)
        return { success: true, message: `Le mot de passe de ${user.name} a été modifié.`, sessionVersion }
    },
}
