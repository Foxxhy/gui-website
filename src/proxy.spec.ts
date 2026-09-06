import { NextRequest } from 'next/server'

import { createSessionToken } from '@/services/auth/session-token'
import { mockStore } from '@/repositories/mock-store'
import { serviceSessionCookie } from '@/services/auth'
import { proxy, validateAdminSessionCookie } from '@/proxy'

describe('validateAdminSessionCookie', () => {
    beforeEach(() => {
        mockStore.reset()
    })

    it('accepts a valid session token for an active user', () => {
        const token = createSessionToken('user-admin')
        expect(validateAdminSessionCookie(token)).toBe(true)
    })

    it('rejects a missing cookie', () => {
        expect(validateAdminSessionCookie(undefined)).toBe(false)
    })

    it('rejects an invalid token', () => {
        expect(validateAdminSessionCookie('invalid-token')).toBe(false)
    })

    it('rejects a blocked user', () => {
        const token = createSessionToken('user-blocked')
        expect(validateAdminSessionCookie(token)).toBe(false)
    })
})

describe('proxy', () => {
    beforeEach(() => {
        mockStore.reset()
    })

    it('redirects unauthenticated visitors to login with returnTo', () => {
        const request = new NextRequest('http://localhost/administration/articles')
        const response = proxy(request)

        expect(response.status).toBe(307)
        expect(response.headers.get('location')).toBe(
            'http://localhost/connexion?returnTo=%2Fadministration%2Farticles'
        )
        expect(response.headers.get('Content-Security-Policy')).toContain("default-src 'self'")
    })

    it('allows authenticated requests through', () => {
        const token = createSessionToken('user-admin')
        const request = new NextRequest('http://localhost/administration', {
            headers: {
                cookie: `${serviceSessionCookie}=${token}`,
            },
        })
        const response = proxy(request)

        expect(response.status).toBe(200)
        expect(response.headers.get('Content-Security-Policy')).toContain("default-src 'self'")
    })
})
