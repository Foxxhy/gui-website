'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { configApp } from '@/configs'
import { serviceAuth, serviceSessionCookie } from '@/services'
import { serviceToTrimmedString } from '@/services'
import type { IActionResult } from '@/types'

export const actionLogin = async (
    _previousState: IActionResult | undefined,
    formData: FormData
): Promise<IActionResult> => {
    const login = serviceToTrimmedString(formData.get('login'), 100)
    const password = typeof formData.get('password') === 'string' ? formData.get('password') as string : ''
    const returnTo = serviceToTrimmedString(formData.get('returnTo'), 300)
    if (!login || !password || password.length > 200) {
        return { success: false, message: 'Les identifiants sont invalides.' }
    }
    const user = await serviceAuth.authenticate({ login, password })

    if (!user) {
        return { success: false, message: 'Identifiants invalides.' }
    }

    const cookieStore = await cookies()
    cookieStore.set(serviceSessionCookie, user.id, configApp.session.cookieOptions)
    redirect(
        returnTo === configApp.routes.administration || returnTo.startsWith(`${configApp.routes.administration}/`)
            ? returnTo
            : configApp.routes.administration
    )
}

export const actionLogout = async () => {
    const cookieStore = await cookies()
    cookieStore.delete(serviceSessionCookie)
    redirect(configApp.routes.home)
}
