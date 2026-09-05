'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { appConfig } from '@/configs'
import { authService, SESSION_COOKIE } from '@/services'
import type { IActionResult } from '@/types'

export const loginAction = async (
    _previousState: IActionResult | undefined,
    formData: FormData
): Promise<IActionResult> => {
    const login = String(formData.get('login') ?? '').trim()
    const password = String(formData.get('password') ?? '')
    const returnTo = String(
        formData.get('returnTo') ?? appConfig.routes.administration
    )
    const user = await authService.authenticate({ login, password })

    if (!user) {
        return { success: false, message: 'Identifiants invalides.' }
    }

    const cookieStore = await cookies()
    cookieStore.set(SESSION_COOKIE, user.id, appConfig.session.cookieOptions)
    redirect(
        returnTo.startsWith(appConfig.routes.administration)
            ? returnTo
            : appConfig.routes.administration
    )
}

export const logoutAction = async () => {
    const cookieStore = await cookies()
    cookieStore.delete(SESSION_COOKIE)
    redirect(appConfig.routes.home)
}