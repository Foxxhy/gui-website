import { cookies } from 'next/headers'

import { serviceAuth, serviceSessionCookie } from '@/services/auth'
import { serviceGetCurrentSession } from './session'

jest.mock('next/headers', () => ({
    cookies: jest.fn(),
}))

describe('serviceGetCurrentSession', () => {
    it('returns the session for the cookie value', async () => {
        const getSessionFromLogin = jest.spyOn(serviceAuth, 'getSessionFromLogin')
        ;(cookies as jest.Mock).mockResolvedValue({
            get: (name: string) =>
                name === serviceSessionCookie ? { value: 'user-admin' } : undefined,
        })

        await expect(serviceGetCurrentSession()).resolves.toMatchObject({
            user: { id: 'user-admin' },
        })
        expect(getSessionFromLogin).toHaveBeenCalledWith('user-admin')
    })

    it('passes undefined when the cookie is missing', async () => {
        const getSessionFromLogin = jest.spyOn(serviceAuth, 'getSessionFromLogin')
        ;(cookies as jest.Mock).mockResolvedValue({
            get: () => undefined,
        })

        await serviceGetCurrentSession()
        expect(getSessionFromLogin).toHaveBeenCalledWith(undefined)
    })
})
