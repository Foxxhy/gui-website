import { NextResponse, type NextRequest } from 'next/server'
import { appConfig } from '@/configs'
import { SESSION_COOKIE } from '@/services/auth'
import { createCsp } from '@/services/security'
import crypto from 'node:crypto'

export const proxy = (request: NextRequest) => {
    const nonce = crypto.randomBytes(16).toString('base64')
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-nonce', nonce)
    const csp = createCsp(nonce)
    const session = request.cookies.get(SESSION_COOKIE)?.value
    if (!session) {
        const loginUrl = new URL(appConfig.routes.login, request.url)
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