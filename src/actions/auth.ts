'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { appConfig } from '@/configs'
import { authService, SESSION_COOKIE } from '@/services'
import { toTrimmedString } from '@/services'
import type { IActionResult } from '@/types'

export const loginAction = async (
    _previousState: IActionResult | undefined,
    formData: FormData
): Promise<IActionResult> => {
    const login = toTrimmedString(formData.get('login'), 100)
    const password = typeof formData.get('password') === 'string' ? formData.get('password') as string : ''
    const returnTo = toTrimmedString(formData.get('returnTo'), 300)
    if (!login || !password || password.length > 200) {
        return { success: false, message: 'Les identifiants sont invalides.' }
    }
    const user = await authService.authenticate({ login, password })

    if (!user) {
        return { success: false, message: 'Identifiants invalides.' }
    }

    const cookieStore = await cookies()
    cookieStore.set(SESSION_COOKIE, user.id, appConfig.session.cookieOptions)
    redirect(
        returnTo === appConfig.routes.administration || returnTo.startsWith(`${appConfig.routes.administration}/`)
            ? returnTo
            : appConfig.routes.administration
    )
}

export const logoutAction = async () => {
    const cookieStore = await cookies()
    cookieStore.delete(SESSION_COOKIE)
    redirect(appConfig.routes.home)
}