import { cookies } from 'next/headers'

import { createSessionToken } from '@/services/auth/session-token'
import { mockStore } from '@/repositories/mock-store'
import { serviceAuth, serviceSessionCookie } from '@/services/auth'
import { serviceGetCurrentSession } from './session'

jest.mock('next/headers', () => ({
    cookies: jest.fn(),
}))

describe('serviceGetCurrentSession', () => {
    beforeEach(() => {
        mockStore.reset()
    })

    it('returns the session for a valid token', async () => {
        const token = createSessionToken('user-admin')
        const getSessionFromToken = jest.spyOn(serviceAuth, 'getSessionFromToken')
        ;(cookies as jest.Mock).mockResolvedValue({
            get: (name: string) =>
                name === serviceSessionCookie ? { value: token } : undefined,
        })

        await expect(serviceGetCurrentSession()).resolves.toMatchObject({
            user: { id: 'user-admin' },
        })
        expect(getSessionFromToken).toHaveBeenCalledWith(token)
    })

    it('passes undefined when the cookie is missing', async () => {
        const getSessionFromToken = jest.spyOn(serviceAuth, 'getSessionFromToken')
        ;(cookies as jest.Mock).mockResolvedValue({
            get: () => undefined,
        })

        await serviceGetCurrentSession()
        expect(getSessionFromToken).toHaveBeenCalledWith(undefined)
    })
})
