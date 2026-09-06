import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { configApp } from '@/configs'
import { serviceAuth, serviceSessionCookie } from '@/services'

import { actionLogin, actionLogout } from './auth'

jest.mock('next/headers', () => ({
    cookies: jest.fn(),
}))

jest.mock('next/navigation', () => ({
    redirect: jest.fn(),
}))

jest.mock('@/services', () => ({
    serviceAuth: {
        authenticate: jest.fn(),
    },
    serviceSessionCookie: 'association_poc_session',
    serviceToTrimmedString: jest.requireActual('@/services/validation').serviceToTrimmedString,
}))

describe('actionLogin', () => {
    const cookieStore = {
        set: jest.fn(),
        delete: jest.fn(),
    }

    beforeEach(() => {
        jest.clearAllMocks()
            ; (cookies as jest.Mock).mockResolvedValue(cookieStore)
            ; (redirect as unknown as jest.Mock).mockImplementation(() => {
                throw new Error('NEXT_REDIRECT')
            })
    })

    it('rejects missing credentials', async () => {
        const formData = new FormData()
        formData.set('login', '')
        formData.set('password', '')

        await expect(actionLogin(undefined, formData)).resolves.toEqual({
            success: false,
            message: 'Les identifiants sont invalides.',
        })
        expect(serviceAuth.authenticate).not.toHaveBeenCalled()
    })

    it('rejects invalid credentials', async () => {
        ; (serviceAuth.authenticate as jest.Mock).mockResolvedValue(undefined)
        const formData = new FormData()
        formData.set('login', 'admin')
        formData.set('password', 'wrong')

        await expect(actionLogin(undefined, formData)).resolves.toEqual({
            success: false,
            message: 'Identifiants invalides.',
        })
    })

    it('sets the session cookie and redirects on success', async () => {
        ; (serviceAuth.authenticate as jest.Mock).mockResolvedValue({ id: 'user-admin' })
        const formData = new FormData()
        formData.set('login', 'admin')
        formData.set('password', 'admin')
        formData.set('returnTo', '/administration/articles')

        await expect(actionLogin(undefined, formData)).rejects.toThrow('NEXT_REDIRECT')
        expect(cookieStore.set).toHaveBeenCalledWith(
            serviceSessionCookie,
            'user-admin',
            configApp.session.cookieOptions
        )
        expect(redirect).toHaveBeenCalledWith('/administration/articles')
    })

    it('redirects to administration when returnTo is not an admin path', async () => {
        ; (serviceAuth.authenticate as jest.Mock).mockResolvedValue({ id: 'user-admin' })
        const formData = new FormData()
        formData.set('login', 'admin')
        formData.set('password', 'admin')
        formData.set('returnTo', '/articles')

        await expect(actionLogin(undefined, formData)).rejects.toThrow('NEXT_REDIRECT')
        expect(redirect).toHaveBeenCalledWith(configApp.routes.administration)
    })
})

describe('actionLogout', () => {
    const cookieStore = {
        set: jest.fn(),
        delete: jest.fn(),
    }

    beforeEach(() => {
        jest.clearAllMocks()
            ; (cookies as jest.Mock).mockResolvedValue(cookieStore)
            ; (redirect as unknown as jest.Mock).mockImplementation(() => {
                throw new Error('NEXT_REDIRECT')
            })
    })

    it('deletes the session cookie and redirects home', async () => {
        await expect(actionLogout()).rejects.toThrow('NEXT_REDIRECT')
        expect(cookieStore.delete).toHaveBeenCalledWith(serviceSessionCookie)
        expect(redirect).toHaveBeenCalledWith(configApp.routes.home)
    })
})
