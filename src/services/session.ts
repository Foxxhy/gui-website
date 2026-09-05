import 'server-only'

import { cookies } from 'next/headers'
import { authService, SESSION_COOKIE } from './auth'
import type { ISession } from '@/types'

export const getCurrentSession = async (): Promise<ISession | undefined> => {
    const cookieStore = await cookies()
    return authService.getSessionFromLogin(cookieStore.get(SESSION_COOKIE)?.value)
}