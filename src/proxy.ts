import { NextResponse, type NextRequest } from 'next/server'
import { configApp } from '@/configs'
import { serviceAuth, serviceSessionCookie } from '@/services/auth'
import { serviceCreateCsp } from '@/services/security'
import crypto from 'node:crypto'

export const validateAdminSessionCookie = async (cookieValue?: string): Promise<boolean> => {
    const session = await serviceAuth.getSessionFromToken(cookieValue)
    return Boolean(session)
}

export const proxy = async (request: NextRequest) => {
    const nonce = crypto.randomBytes(16).toString('base64')
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-nonce', nonce)
    const csp = serviceCreateCsp(nonce)
    const session = request.cookies.get(serviceSessionCookie)?.value
    if (!(await validateAdminSessionCookie(session))) {
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
