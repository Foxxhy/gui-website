import { configApp } from '@/configs'
import { createSessionToken, parseSessionToken } from '@/services/auth/session-token'

describe('session-token', () => {
    const originalEnv = process.env

    beforeEach(() => {
        process.env = { ...originalEnv, AUTH_SECRET: 'test-secret-for-session-token' }
    })

    afterEach(() => {
        process.env = originalEnv
    })

    it('crée et parse un jeton valide avec version de session', () => {
        const token = createSessionToken('user-admin', 2)
        const parsed = parseSessionToken(token)
        expect(parsed).toEqual({ userId: 'user-admin', sessionVersion: 2 })
    })

    it('rejette un jeton expiré', () => {
        const expiredPayload = Buffer.from(JSON.stringify({
            userId: 'user-admin',
            exp: Math.floor(Date.now() / 1000) - 10,
            sessionVersion: 0,
        })).toString('base64url')
        const token = `${expiredPayload}.invalid-signature`
        expect(parseSessionToken(token)).toBeUndefined()
    })

    it('rejette une signature invalide', () => {
        const token = createSessionToken('user-admin', 0)
        const tampered = `${token.slice(0, -4)}xxxx`
        expect(parseSessionToken(tampered)).toBeUndefined()
    })

    it('accepte les jetons legacy sans sessionVersion', () => {
        const payload = Buffer.from(JSON.stringify({
            userId: 'user-admin',
            exp: Math.floor(Date.now() / 1000) + configApp.session.cookieOptions.maxAge,
        })).toString('base64url')
        const { createHmac } = require('node:crypto')
        const signature = createHmac('sha256', 'test-secret-for-session-token').update(payload).digest('base64url')
        const parsed = parseSessionToken(`${payload}.${signature}`)
        expect(parsed).toEqual({ userId: 'user-admin', sessionVersion: 0 })
    })

    it('exige AUTH_SECRET en production', () => {
        process.env.NODE_ENV = 'production'
        delete process.env.AUTH_SECRET
        expect(() => createSessionToken('user-admin', 0)).toThrow('AUTH_SECRET est obligatoire en production.')
    })
})
