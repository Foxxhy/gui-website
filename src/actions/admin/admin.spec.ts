import { revalidatePath } from 'next/cache'

import {
    serviceAuth,
    serviceContact,
    serviceContent,
    serviceFeature,
    serviceGetCurrentSession,
    serviceTag,
    serviceUser,
} from '@/services'
import { IRole, type ISession } from '@/types'

import { actionSubmitAdminMutation } from './admin'

jest.mock('next/cache', () => ({
    revalidatePath: jest.fn(),
}))

jest.mock('@/services', () => ({
    serviceAuth: {
        canPerform: jest.fn(),
    },
    serviceContact: {
        mutateFromAdminForm: jest.fn(),
    },
    serviceContent: {
        mutateArticleFromFormData: jest.fn(),
        mutatePageFromFormData: jest.fn(),
    },
    serviceFeature: {
        updateFlag: jest.fn(),
    },
    serviceGetCurrentSession: jest.fn(),
    serviceTag: {
        mutateFromFormData: jest.fn(),
    },
    serviceUser: {
        mutateFromFormData: jest.fn(),
    },
}))

describe('actionSubmitAdminMutation', () => {
    const session = {
        user: {
            id: 'user-admin',
            role: IRole.ADMIN,
        },
    } as unknown as ISession

    const createFormData = (values: Record<string, string | string[]>) => {
        const data = new FormData()

        Object.entries(values).forEach(([key, value]) => {
            if (Array.isArray(value)) {
                for (const item of value) {
                    data.append(key, item)
                }
            } else {
                data.set(key, value)
            }
        })

        return data
    }

    beforeEach(() => {
        jest.clearAllMocks()
    })

    afterEach(() => {
        jest.restoreAllMocks()
    })

    it('rejects a mutation when there is no session', async () => {
        jest.mocked(serviceGetCurrentSession).mockResolvedValue(undefined)

        const result = await actionSubmitAdminMutation(
            undefined,
            createFormData({ area: 'articles' })
        )

        expect(result).toEqual({
            success: false,
            message: 'Vous n’êtes pas autorisé à effectuer cette opération.',
        })
    })

    it('rejects a mutation for an unknown administration area', async () => {
        jest.mocked(serviceGetCurrentSession).mockResolvedValue(session)
        const canPerform = jest.mocked(serviceAuth.canPerform)

        const result = await actionSubmitAdminMutation(
            undefined,
            createFormData({ area: 'unknown' })
        )

        expect(result).toEqual({
            success: false,
            message: 'Vous n’êtes pas autorisé à effectuer cette opération.',
        })
        expect(canPerform).not.toHaveBeenCalled()
    })

    it('rejects a mutation when the current user is not allowed to perform it', async () => {
        jest.mocked(serviceGetCurrentSession).mockResolvedValue(session)
        jest.mocked(serviceAuth.canPerform).mockReturnValue(false)

        const result = await actionSubmitAdminMutation(
            undefined,
            createFormData({ area: 'articles', operation: 'modifiée' })
        )

        expect(serviceAuth.canPerform).toHaveBeenCalledWith(
            IRole.ADMIN,
            'articles',
            'modifiée'
        )
        expect(result).toEqual({
            success: false,
            message: 'Vous n’êtes pas autorisé à effectuer cette opération.',
        })
    })

    it('delegates article mutations to serviceContent', async () => {
        jest.mocked(serviceGetCurrentSession).mockResolvedValue(session)
        jest.mocked(serviceAuth.canPerform).mockReturnValue(true)
        jest.mocked(serviceContent.mutateArticleFromFormData).mockResolvedValue({
            success: true,
            message: 'Article créé.',
        })

        const formData = createFormData({
            area: 'articles',
            operation: 'modifiée',
            title: 'Mon article',
            tags: ['tag-1', 'tag-3'],
        })

        const result = await actionSubmitAdminMutation(undefined, formData)

        expect(serviceContent.mutateArticleFromFormData).toHaveBeenCalledWith(formData, session.user)
        expect(result).toEqual({ success: true, message: 'Article créé.' })
    })

    it('delegates tag mutations to serviceTag', async () => {
        jest.mocked(serviceGetCurrentSession).mockResolvedValue(session)
        jest.mocked(serviceAuth.canPerform).mockReturnValue(true)
        jest.mocked(serviceTag.mutateFromFormData).mockResolvedValue({
            success: true,
            message: 'Tag créé.',
        })

        const formData = createFormData({
            area: 'tags',
            operation: 'créé',
            name: 'Tech',
            slug: 'tech',
            style: 'green',
            description: 'Technologie',
        })

        const result = await actionSubmitAdminMutation(undefined, formData)

        expect(serviceTag.mutateFromFormData).toHaveBeenCalledWith(formData, 'créé')
        expect(result).toEqual({ success: true, message: 'Tag créé.' })
    })

    it('delegates page mutations to serviceContent and revalidates public pages', async () => {
        jest.mocked(serviceGetCurrentSession).mockResolvedValue(session)
        jest.mocked(serviceAuth.canPerform).mockReturnValue(true)
        jest.mocked(serviceContent.mutatePageFromFormData).mockResolvedValue({
            success: true,
            message: 'Page enregistrée.',
        })

        const formData = createFormData({
            area: 'pages',
            id: 'page-home',
            title: 'Accueil',
            content: 'Contenu',
        })

        const result = await actionSubmitAdminMutation(undefined, formData)

        expect(serviceContent.mutatePageFromFormData).toHaveBeenCalledWith(formData)
        expect(revalidatePath).toHaveBeenCalledWith('/')
        expect(revalidatePath).toHaveBeenCalledWith('/association')
        expect(revalidatePath).toHaveBeenCalledWith('/gestion-des-donnees')
        expect(result).toEqual({ success: true, message: 'Page enregistrée.' })
    })

    it('delegates user mutations to serviceUser', async () => {
        jest.mocked(serviceGetCurrentSession).mockResolvedValue(session)
        jest.mocked(serviceAuth.canPerform).mockReturnValue(true)
        jest.mocked(serviceUser.mutateFromFormData).mockResolvedValue({
            success: true,
            message: 'Utilisateur modifié.',
        })

        const formData = createFormData({
            area: 'users',
            id: 'user-1',
            role: 'editor',
        })

        const result = await actionSubmitAdminMutation(undefined, formData)

        expect(serviceUser.mutateFromFormData).toHaveBeenCalledWith(formData, 'modifiée')
        expect(result).toEqual({ success: true, message: 'Utilisateur modifié.' })
    })

    it('enables a feature and revalidates affected pages', async () => {
        jest.mocked(serviceGetCurrentSession).mockResolvedValue(session)
        jest.mocked(serviceAuth.canPerform).mockReturnValue(true)
        jest.mocked(serviceFeature.updateFlag).mockResolvedValue({
            success: true,
            message: 'Feature activée.',
        })

        const result = await actionSubmitAdminMutation(
            undefined,
            createFormData({
                area: 'features',
                feature: 'articles',
                enabled: 'true',
            })
        )

        expect(serviceFeature.updateFlag).toHaveBeenCalledWith('articles', true)
        expect(revalidatePath).toHaveBeenCalledWith('/')
        expect(revalidatePath).toHaveBeenCalledWith('/articles')
        expect(revalidatePath).toHaveBeenCalledWith('/articles/[slug]', 'page')
        expect(revalidatePath).toHaveBeenCalledWith('/contact')
        expect(result).toEqual({ success: true, message: 'Feature activée.' })
    })

    it('delegates contact form mutations to serviceContact', async () => {
        jest.mocked(serviceGetCurrentSession).mockResolvedValue(session)
        jest.mocked(serviceAuth.canPerform).mockReturnValue(true)
        jest.mocked(serviceContact.mutateFromAdminForm).mockResolvedValue({
            success: true,
            message: 'Configuration enregistrée.',
        })

        const formData = createFormData({
            area: 'contactForm',
            operation: 'modifiée',
            title: 'Nouveau titre',
        })

        const result = await actionSubmitAdminMutation(undefined, formData)

        expect(serviceContact.mutateFromAdminForm).toHaveBeenCalledWith(formData, 'modifiée')
        expect(result).toEqual({ success: true, message: 'Configuration enregistrée.' })
    })
})
