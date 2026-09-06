'use server'

import { cookies } from 'next/headers'
import { configApp } from '@/configs'
import { createSessionToken } from '@/services/auth/session-token'
import { serviceAuth, serviceGetCurrentSession, servicePassword, serviceReadPassword, serviceSessionCookie } from '@/services'
import type { IActionResult } from '@/types'

const refreshSessionCookie = async (userId: string, sessionVersion: number) => {
    const cookieStore = await cookies()
    cookieStore.set(
        serviceSessionCookie,
        createSessionToken(userId, sessionVersion),
        configApp.session.cookieOptions
    )
}

export const actionChangeOwnPassword = async (
    _previousState: IActionResult | undefined,
    formData: FormData
): Promise<IActionResult> => {
    const session = await serviceGetCurrentSession()
    if (!session) {
        return { success: false, message: 'Vous devez être connecté pour modifier votre mot de passe.' }
    }

    const result = await servicePassword.changeOwnPassword(session.user.id, {
        currentPassword: serviceReadPassword(formData.get('currentPassword')),
        newPassword: serviceReadPassword(formData.get('newPassword')),
        confirmPassword: serviceReadPassword(formData.get('confirmPassword')),
    })

    if (result.success && typeof result.sessionVersion === 'number') {
        await refreshSessionCookie(session.user.id, result.sessionVersion)
    }

    return result
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
