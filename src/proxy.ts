import { NextResponse, type NextRequest } from 'next/server'
import { configApp } from '@/configs'
import { users } from '@/mocks/data'
import { parseSessionToken } from '@/services/auth/session-token'
import { serviceSessionCookie } from '@/services/auth'
import { serviceCreateCsp } from '@/services/security'
import { IRole } from '@/types'
import crypto from 'node:crypto'

export const validateAdminSessionCookie = (cookieValue?: string): boolean => {
    const payload = parseSessionToken(cookieValue)
    if (!payload) return false
    const user = users.find((candidate) => candidate.id === payload.userId)
    return Boolean(user && user.role !== IRole.BLOCKED)
}

export const proxy = (request: NextRequest) => {
    const nonce = crypto.randomBytes(16).toString('base64')
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-nonce', nonce)
    const csp = serviceCreateCsp(nonce)
    const session = request.cookies.get(serviceSessionCookie)?.value
    if (!validateAdminSessionCookie(session)) {
        const loginUrl = new URL(configApp.routes.login, request.url)
        loginUrl.searchParams.set('returnTo', request.nextUrl.pathname)
        const response = NextResponse.redirect(loginUrl, { headers: requestHeaders })
        response.headers.set('Content-Security-Policy', csp)
        return response
    }
    const response = NextResponse.next({ request: { headers: requestHeaders } })
    response.headers.set('Content-Security-Policy', csp)
    return response
}

export const config = { matcher: ['/administration/:path*'] }
