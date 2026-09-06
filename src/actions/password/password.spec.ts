import { serviceAuth, serviceGetCurrentSession, servicePassword } from '@/services'
import { IRole } from '@/types'
import { actionAdminChangeUserPassword, actionChangeOwnPassword } from './password'

jest.mock('@/services', () => ({
    serviceGetCurrentSession: jest.fn(),
    serviceAuth: {
        canManage: jest.fn(),
    },
    servicePassword: {
        changeOwnPassword: jest.fn(),
        changeUserPasswordByAdmin: jest.fn(),
    },
    serviceReadPassword: jest.requireActual('@/services/validation').serviceReadPassword,
}))

describe('actionChangeOwnPassword', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('rejects unauthenticated users', async () => {
        ;(serviceGetCurrentSession as jest.Mock).mockResolvedValue(undefined)
        const formData = new FormData()

        await expect(actionChangeOwnPassword(undefined, formData)).resolves.toEqual({
            success: false,
            message: 'Vous devez être connecté pour modifier votre mot de passe.',
        })
    })

    it('delegates to servicePassword for authenticated users', async () => {
        ;(serviceGetCurrentSession as jest.Mock).mockResolvedValue({ user: { id: 'user-editor' } })
        ;(servicePassword.changeOwnPassword as jest.Mock).mockResolvedValue({ success: true, message: 'ok' })
        const formData = new FormData()
        formData.set('currentPassword', 'editor')
        formData.set('newPassword', 'new-password-123')
        formData.set('confirmPassword', 'new-password-123')

        await expect(actionChangeOwnPassword(undefined, formData)).resolves.toEqual({ success: true, message: 'ok' })
        expect(servicePassword.changeOwnPassword).toHaveBeenCalledWith('user-editor', {
            currentPassword: 'editor',
            newPassword: 'new-password-123',
            confirmPassword: 'new-password-123',
        })
    })
})

describe('actionAdminChangeUserPassword', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('rejects non-admin users', async () => {
        ;(serviceGetCurrentSession as jest.Mock).mockResolvedValue({ user: { id: 'user-editor', role: IRole.EDITOR } })
        ;(serviceAuth.canManage as jest.Mock).mockReturnValue(false)
        const formData = new FormData()

        await expect(actionAdminChangeUserPassword(undefined, formData)).resolves.toEqual({
            success: false,
            message: 'Vous n’êtes pas autorisé à effectuer cette opération.',
        })
    })

    it('delegates to servicePassword for admin users', async () => {
        ;(serviceGetCurrentSession as jest.Mock).mockResolvedValue({ user: { id: 'user-admin', role: IRole.ADMIN } })
        ;(serviceAuth.canManage as jest.Mock).mockReturnValue(true)
        ;(servicePassword.changeUserPasswordByAdmin as jest.Mock).mockResolvedValue({ success: true, message: 'ok' })
        const formData = new FormData()
        formData.set('userId', 'user-editor')
        formData.set('newPassword', 'reset-password-123')
        formData.set('confirmPassword', 'reset-password-123')

        await expect(actionAdminChangeUserPassword(undefined, formData)).resolves.toEqual({ success: true, message: 'ok' })
        expect(servicePassword.changeUserPasswordByAdmin).toHaveBeenCalledWith(IRole.ADMIN, 'user-editor', {
            newPassword: 'reset-password-123',
            confirmPassword: 'reset-password-123',
        })
    })
})
