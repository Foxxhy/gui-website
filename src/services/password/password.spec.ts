import { getRepositories } from '@/repositories'
import { servicePasswordHashing } from '@/services/password-hashing'
import { IRole } from '@/types'
import { servicePassword } from './password'

describe('servicePassword', () => {
    it('changes own password when current password is valid', async () => {
        const account = await getRepositories().users.findAccountByUserId('user-editor')
        const originalHash = account?.passwordHash
        expect(originalHash).toBeDefined()

        await expect(
            servicePassword.changeOwnPassword('user-editor', {
                currentPassword: 'editor',
                newPassword: 'new-editor-password',
                confirmPassword: 'new-editor-password',
            })
        ).resolves.toMatchObject({ success: true })

        const updatedAccount = await getRepositories().users.findAccountByUserId('user-editor')
        expect(updatedAccount?.passwordHash).not.toBe(originalHash)
        await expect(servicePasswordHashing.verifyPassword('new-editor-password', updatedAccount?.passwordHash ?? '')).resolves.toBe(true)

        if (originalHash) {
            await getRepositories().users.updatePasswordHash('user-editor', originalHash)
        }
    })

    it('rejects an incorrect current password', async () => {
        await expect(
            servicePassword.changeOwnPassword('user-admin', {
                currentPassword: 'wrong-password',
                newPassword: 'new-admin-password',
                confirmPassword: 'new-admin-password',
            })
        ).resolves.toMatchObject({
            success: false,
            errors: { currentPassword: 'Le mot de passe actuel est incorrect.' },
        })
    })

    it('validates password confirmation', async () => {
        await expect(
            servicePassword.changeOwnPassword('user-admin', {
                currentPassword: 'admin',
                newPassword: 'new-admin-password',
                confirmPassword: 'different-password',
            })
        ).resolves.toMatchObject({
            success: false,
            errors: { confirmPassword: 'La confirmation ne correspond pas au nouveau mot de passe.' },
        })
    })

    it('allows an admin to change another user password', async () => {
        const account = await getRepositories().users.findAccountByUserId('user-editor')
        const originalHash = account?.passwordHash
        expect(originalHash).toBeDefined()

        await expect(
            servicePassword.changeUserPasswordByAdmin(IRole.ADMIN, 'user-editor', {
                newPassword: 'admin-reset-password',
                confirmPassword: 'admin-reset-password',
            })
        ).resolves.toMatchObject({ success: true })

        const updatedAccount = await getRepositories().users.findAccountByUserId('user-editor')
        await expect(servicePasswordHashing.verifyPassword('admin-reset-password', updatedAccount?.passwordHash ?? '')).resolves.toBe(true)

        if (originalHash) {
            await getRepositories().users.updatePasswordHash('user-editor', originalHash)
        }
    })

    it('rejects password changes by non-admin users', async () => {
        await expect(
            servicePassword.changeUserPasswordByAdmin(IRole.EDITOR, 'user-admin', {
                newPassword: 'forbidden-password',
                confirmPassword: 'forbidden-password',
            })
        ).resolves.toMatchObject({
            success: false,
            message: 'Vous n’êtes pas autorisé à effectuer cette opération.',
        })
    })
})
