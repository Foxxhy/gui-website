import { NextResponse, type NextRequest } from 'next/server'
import crypto from 'node:crypto'

import { configApp } from '@/configs'
import { serviceAuth, serviceSessionCookie } from '@/services/auth'
import { serviceCreateCsp } from '@/services/security'

export const validateAdminSessionCookie = async (cookieValue?: string): Promise<boolean> => {
    const session = await serviceAuth.getSessionFromToken(cookieValue)
    return Boolean(session)
}

const createSecureResponse = (request: NextRequest, baseResponse: NextResponse) => {
    const nonce = crypto.randomBytes(16).toString('base64')
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-nonce', nonce)
    const csp = serviceCreateCsp(nonce)

    const location = baseResponse.headers.get('location')
    if (location) {
        const redirect = NextResponse.redirect(new URL(location), baseResponse.status)
        redirect.headers.set('Content-Security-Policy', csp)
        return redirect
    }

    const response = NextResponse.next({ request: { headers: requestHeaders } })
    response.headers.set('Content-Security-Policy', csp)
    return response
}

export const proxy = async (request: NextRequest) => {
    const isAdminRoute = request.nextUrl.pathname.startsWith(configApp.routes.administration)

    if (isAdminRoute) {
        const session = request.cookies.get(serviceSessionCookie)?.value
        if (!(await validateAdminSessionCookie(session))) {
            const loginUrl = new URL(configApp.routes.login, request.url)
            loginUrl.searchParams.set('returnTo', request.nextUrl.pathname)
            return createSecureResponse(request, NextResponse.redirect(loginUrl))
        }
    }

    return createSecureResponse(request, NextResponse.next())
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
