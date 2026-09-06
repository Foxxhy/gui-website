import { NextRequest } from 'next/server'

import { createSessionToken } from '@/services/auth/session-token'
import { serviceSessionCookie } from '@/services/auth'
import { proxy, validateAdminSessionCookie } from '@/proxy'

describe('validateAdminSessionCookie', () => {
    it('accepts a valid session token for an active user', async () => {
        const token = createSessionToken('user-admin', 0)
        await expect(validateAdminSessionCookie(token)).resolves.toBe(true)
    })

    it('rejects a missing cookie', async () => {
        await expect(validateAdminSessionCookie(undefined)).resolves.toBe(false)
    })

    it('rejects an invalid token', async () => {
        await expect(validateAdminSessionCookie('invalid-token')).resolves.toBe(false)
    })

    it('rejects a blocked user', async () => {
        const token = createSessionToken('user-blocked', 0)
        await expect(validateAdminSessionCookie(token)).resolves.toBe(false)
    })
})

describe('proxy', () => {
    it('redirects unauthenticated visitors to login with returnTo', async () => {
        const request = new NextRequest('http://localhost/administration/articles')
        const response = await proxy(request)

        expect(response.status).toBe(307)
        expect(response.headers.get('location')).toBe(
            'http://localhost/connexion?returnTo=%2Fadministration%2Farticles'
        )
        expect(response.headers.get('Content-Security-Policy')).toContain("default-src 'self'")
    })

    it('allows authenticated requests through', async () => {
        const token = createSessionToken('user-admin', 0)
        const request = new NextRequest('http://localhost/administration', {
            headers: {
                cookie: `${serviceSessionCookie}=${token}`,
            },
        })
        const response = await proxy(request)

        expect(response.status).toBe(200)
        expect(response.headers.get('Content-Security-Policy')).toContain("default-src 'self'")
    })
})
