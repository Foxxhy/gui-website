import { repositoryUserMock } from './users.mock'

describe('repositoryUserMock', () => {
    it('finds users and accounts', async () => {
        await expect(repositoryUserMock.findUserById('user-admin')).resolves.toMatchObject({ id: 'user-admin' })
        await expect(repositoryUserMock.findAccountByLogin('admin')).resolves.toMatchObject({ userId: 'user-admin', login: 'admin' })
        await expect(repositoryUserMock.findAccountByUserId('user-editor')).resolves.toMatchObject({ userId: 'user-editor', login: 'editor' })
    })

    it('updates a password hash in memory', async () => {
        const account = await repositoryUserMock.findAccountByUserId('user-editor')
        const originalHash = account?.passwordHash
        expect(originalHash).toBeDefined()
        await expect(repositoryUserMock.updatePasswordHash('user-editor', 'scrypt:test:test')).resolves.toBe(true)
        await expect(repositoryUserMock.findAccountByUserId('user-editor')).resolves.toMatchObject({ passwordHash: 'scrypt:test:test' })
        if (originalHash) {
            await repositoryUserMock.updatePasswordHash('user-editor', originalHash)
        }
    })

    it('returns false when updating a missing user account', async () => {
        await expect(repositoryUserMock.updatePasswordHash('missing-user', 'scrypt:test:test')).resolves.toBe(false)
    })
})
