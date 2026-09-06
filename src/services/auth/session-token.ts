import 'server-only'

import { createHmac, timingSafeEqual } from 'node:crypto'
import { configApp } from '@/configs'

const getAuthSecret = () => {
    const secret = process.env.AUTH_SECRET?.trim()
    if (secret) return secret
    if (process.env.NODE_ENV === 'production') {
        throw new Error('AUTH_SECRET est obligatoire en production.')
    }
    return 'association-poc-dev-secret'
}

const encodePayload = (payload: { userId: string; exp: number }) =>
    Buffer.from(JSON.stringify(payload)).toString('base64url')

const signPayload = (payload: string) =>
    createHmac('sha256', getAuthSecret()).update(payload).digest('base64url')

export const createSessionToken = (userId: string): string => {
    const exp = Math.floor(Date.now() / 1000) + configApp.session.cookieOptions.maxAge
    const payload = encodePayload({ userId, exp })
    return `${payload}.${signPayload(payload)}`
}

export const parseSessionToken = (token?: string): { userId: string } | undefined => {
    if (!token) return undefined

    const separatorIndex = token.lastIndexOf('.')
    if (separatorIndex <= 0) return undefined

    const payload = token.slice(0, separatorIndex)
    const signature = token.slice(separatorIndex + 1)
    const expectedSignature = signPayload(payload)

    const signatureBuffer = Buffer.from(signature)
    const expectedBuffer = Buffer.from(expectedSignature)
    if (signatureBuffer.length !== expectedBuffer.length) return undefined
    if (!timingSafeEqual(signatureBuffer, expectedBuffer)) return undefined

    try {
        const parsed = JSON.parse(Buffer.from(payload, 'base64url').toString()) as {
            userId?: string
            exp?: number
        }
        if (!parsed.userId || typeof parsed.exp !== 'number') return undefined
        if (parsed.exp < Math.floor(Date.now() / 1000)) return undefined
        return { userId: parsed.userId }
    } catch {
        return undefined
    }
}
