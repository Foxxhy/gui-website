import 'server-only'

import { cookies } from 'next/headers'
import { serviceAuth, serviceSessionCookie } from '@/services/auth'
import type { ISession } from '@/types'

export const serviceGetCurrentSession = async (): Promise<ISession | undefined> => {
    const cookieStore = await cookies()
    return serviceAuth.getSessionFromToken(cookieStore.get(serviceSessionCookie)?.value)
}
