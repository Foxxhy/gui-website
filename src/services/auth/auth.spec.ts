import { mockStore } from '@/repositories/mock-store'
import { IRole } from '@/types'
import { serviceAuth } from './auth'

describe('serviceAuth', () => {
    beforeEach(() => {
        mockStore.reset()
    })

    it('authenticates a valid mock account', async () => {
        await expect(serviceAuth.authenticate({ login: 'admin', password: 'admin' })).resolves.toMatchObject({
            id: 'user-admin',
        })
    })

    it('rejects invalid credentials', async () => {
        await expect(serviceAuth.authenticate({ login: 'admin', password: 'invalid' })).resolves.toBeUndefined()
    })

    it('does not create a session for a blocked user token', async () => {
        await expect(serviceAuth.getSessionFromToken(undefined)).resolves.toBeUndefined()
    })

    it.each([
        ['admin', IRole.ADMIN],
        ['editor', IRole.EDITOR],
    ])('recognizes %s as an allowed role', (_name, role) => {
        expect(serviceAuth.canManage(role, 'articles')).toBe(true)
    })

    it('rejects blocked users for every administration area', () => {
        expect(serviceAuth.canManage(IRole.BLOCKED, 'articles')).toBe(false)
        expect(serviceAuth.canManage(IRole.BLOCKED, 'users')).toBe(false)
    })

    it('restricts user and feature management to administrators', () => {
        expect(serviceAuth.canManage(IRole.EDITOR, 'users')).toBe(false)
        expect(serviceAuth.canManage(IRole.EDITOR, 'features')).toBe(false)
        expect(serviceAuth.canManage(IRole.ADMIN, 'users')).toBe(true)
        expect(serviceAuth.canManage(IRole.ADMIN, 'features')).toBe(true)
    })

    it('allows editors to access analytics', () => {
        expect(serviceAuth.canManage(IRole.EDITOR, 'analytics')).toBe(true)
    })

    it('rejects empty or oversized operations', () => {
        expect(serviceAuth.canPerform(IRole.EDITOR, 'articles', '')).toBe(false)
        expect(serviceAuth.canPerform(IRole.EDITOR, 'articles', 'x'.repeat(81))).toBe(false)
        expect(serviceAuth.canPerform(IRole.EDITOR, 'articles', 'modifiée')).toBe(true)
    })
})
