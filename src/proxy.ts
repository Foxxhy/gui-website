import { NextResponse, type NextRequest } from 'next/server'
import { appConfig } from '@/configs'
import { SESSION_COOKIE } from '@/services/auth'

export const proxy = (request: NextRequest) => {
    const session = request.cookies.get(SESSION_COOKIE)?.value
    if (!session) {
        const loginUrl = new URL(appConfig.routes.login, request.url)
        loginUrl.searchParams.set('returnTo', request.nextUrl.pathname)
        return NextResponse.redirect(loginUrl)
    }
    return NextResponse.next()
}

export const config = { matcher: ['/administration/:path*'] }