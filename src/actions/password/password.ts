'use server'

import { serviceAuth, serviceGetCurrentSession, servicePassword, serviceReadPassword } from '@/services'
import type { IActionResult } from '@/types'

export const actionChangeOwnPassword = async (
    _previousState: IActionResult | undefined,
    formData: FormData
): Promise<IActionResult> => {
    const session = await serviceGetCurrentSession()
    if (!session) {
        return { success: false, message: 'Vous devez être connecté pour modifier votre mot de passe.' }
    }

    return servicePassword.changeOwnPassword(session.user.id, {
        currentPassword: serviceReadPassword(formData.get('currentPassword')),
        newPassword: serviceReadPassword(formData.get('newPassword')),
        confirmPassword: serviceReadPassword(formData.get('confirmPassword')),
    })
}

export const actionAdminChangeUserPassword = async (
    _previousState: IActionResult | undefined,
    formData: FormData
): Promise<IActionResult> => {
    const session = await serviceGetCurrentSession()
    if (!session || !serviceAuth.canManage(session.user.role, 'users')) {
        return { success: false, message: 'Vous n’êtes pas autorisé à effectuer cette opération.' }
    }

    const userId = typeof formData.get('userId') === 'string' ? formData.get('userId') as string : ''
    if (!userId) {
        return { success: false, message: 'Utilisateur introuvable.' }
    }

    return servicePassword.changeUserPasswordByAdmin(session.user.role, userId, {
        newPassword: serviceReadPassword(formData.get('newPassword')),
        confirmPassword: serviceReadPassword(formData.get('confirmPassword')),
    })
}
