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
        updateConfiguration: jest.fn(),
    },
    serviceContent: {
        createArticle: jest.fn(),
        updateArticle: jest.fn(),
        updatePage: jest.fn(),
        getPages: jest.fn(),
    },
    serviceFeature: {
        updateFlag: jest.fn(),
    },
    serviceGetCurrentSession: jest.fn(),
    serviceTag: {
        getTags: jest.fn(),
        createTag: jest.fn(),
        updateTag: jest.fn(),
        deleteTag: jest.fn(),
    },
    serviceUser: {
        createUser: jest.fn(),
        updateUser: jest.fn(),
        deleteUser: jest.fn(),
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

    it('creates an article with selected tags', async () => {
        jest.mocked(serviceGetCurrentSession).mockResolvedValue(session)
        jest.mocked(serviceAuth.canPerform).mockReturnValue(true)
        jest.mocked(serviceTag.getTags).mockResolvedValue([
            { id: 'tag-1', name: 'Tech' },
            { id: 'tag-2', name: 'News' },
            { id: 'tag-3', name: 'Other' },
        ] as never)
        jest.mocked(serviceContent.createArticle).mockResolvedValue({
            success: true,
            message: 'Article créé.',
        })

        const result = await actionSubmitAdminMutation(
            undefined,
            createFormData({
                area: 'articles',
                operation: 'modifiée',
                title: 'Mon article',
                tags: ['tag-1', 'tag-3'],
            })
        )

        expect(serviceContent.createArticle).toHaveBeenCalledWith(
            expect.objectContaining({
                title: 'Mon article',
                tags: [
                    { id: 'tag-1', name: 'Tech' },
                    { id: 'tag-3', name: 'Other' },
                ],
            }),
            session.user
        )
        expect(result).toEqual({ success: true, message: 'Article créé.' })
    })

    it('creates a tag when no tag id is provided', async () => {
        jest.mocked(serviceGetCurrentSession).mockResolvedValue(session)
        jest.mocked(serviceAuth.canPerform).mockReturnValue(true)
        jest.mocked(serviceTag.createTag).mockResolvedValue({
            success: true,
            message: 'Tag créé.',
        })

        const result = await actionSubmitAdminMutation(
            undefined,
            createFormData({
                area: 'tags',
                operation: 'créé',
                name: 'Tech',
                slug: 'tech',
                style: 'green',
                description: 'Technologie',
            })
        )

        expect(serviceTag.createTag).toHaveBeenCalledWith({
            name: 'Tech',
            slug: 'tech',
            style: 'green',
            description: 'Technologie',
        })
        expect(result).toEqual({ success: true, message: 'Tag créé.' })
    })

    it('updates a page', async () => {
        jest.mocked(serviceGetCurrentSession).mockResolvedValue(session)
        jest.mocked(serviceAuth.canPerform).mockReturnValue(true)
        jest.mocked(serviceContent.getPages).mockResolvedValue([
            {
                id: 'page-home',
                title: 'Accueil',
                slug: 'accueil',
                content: 'Ancien contenu',
                sections: [
                    { id: 'home-hero', type: 'hero', title: 'Association POC', content: 'Intro', order: 1 },
                ],
                seo: {},
                createdAt: '2026-01-01T09:00:00.000Z',
                updatedAt: '2026-01-01T09:00:00.000Z',
            },
        ])
        jest.mocked(serviceContent.updatePage).mockResolvedValue({
            success: true,
            message: 'Page enregistrée.',
        })

        const result = await actionSubmitAdminMutation(
            undefined,
            createFormData({
                area: 'pages',
                id: 'page-home',
                title: 'Accueil',
                content: 'Contenu',
                'section-home-hero-title': 'Nouveau titre',
                'section-home-hero-content': 'Nouvelle intro',
            })
        )

        expect(serviceContent.updatePage).toHaveBeenCalledWith(
            'page-home',
            expect.objectContaining({
                area: 'pages',
                title: 'Accueil',
                content: 'Contenu',
                sections: [
                    {
                        id: 'home-hero',
                        type: 'hero',
                        title: 'Nouveau titre',
                        content: 'Nouvelle intro',
                        order: 1,
                    },
                ],
            })
        )
        expect(revalidatePath).toHaveBeenCalledWith('/')
        expect(revalidatePath).toHaveBeenCalledWith('/association')
        expect(revalidatePath).toHaveBeenCalledWith('/gestion-des-donnees')
        expect(result).toEqual({ success: true, message: 'Page enregistrée.' })
    })

    it('rejects a page mutation when the page is missing', async () => {
        jest.mocked(serviceGetCurrentSession).mockResolvedValue(session)
        jest.mocked(serviceAuth.canPerform).mockReturnValue(true)
        jest.mocked(serviceContent.getPages).mockResolvedValue([])

        const result = await actionSubmitAdminMutation(
            undefined,
            createFormData({
                area: 'pages',
                id: 'page-missing',
                title: 'Titre',
                content: 'Contenu',
            })
        )

        expect(serviceContent.updatePage).not.toHaveBeenCalled()
        expect(result).toEqual({ success: false, message: 'Page introuvable.' })
    })

    it('updates a user when an id is provided', async () => {
        jest.mocked(serviceGetCurrentSession).mockResolvedValue(session)
        jest.mocked(serviceAuth.canPerform).mockReturnValue(true)
        jest.mocked(serviceUser.updateUser).mockResolvedValue({
            success: true,
            message: 'Utilisateur modifié.',
        })

        const result = await actionSubmitAdminMutation(
            undefined,
            createFormData({
                area: 'users',
                id: 'user-1',
                role: 'editor',
            })
        )

        expect(serviceUser.updateUser).toHaveBeenCalledWith(
            'user-1',
            expect.objectContaining({ area: 'users', id: 'user-1', role: 'editor' })
        )
        expect(result).toEqual({ success: true, message: 'Utilisateur modifié.' })
    })

    it('deletes a user when the operation is suppressed', async () => {
        jest.mocked(serviceGetCurrentSession).mockResolvedValue(session)
        jest.mocked(serviceAuth.canPerform).mockReturnValue(true)
        jest.mocked(serviceUser.deleteUser).mockResolvedValue({
            success: true,
            message: 'Utilisateur supprimé.',
        })

        const result = await actionSubmitAdminMutation(
            undefined,
            createFormData({
                area: 'users',
                operation: 'supprimé',
                id: 'user-1',
            })
        )

        expect(serviceUser.deleteUser).toHaveBeenCalledWith('user-1')
        expect(result).toEqual({ success: true, message: 'Utilisateur supprimé.' })
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

    it('updates contact form configuration', async () => {
        jest.mocked(serviceGetCurrentSession).mockResolvedValue(session)
        jest.mocked(serviceAuth.canPerform).mockReturnValue(true)
        jest.mocked(serviceContact.updateConfiguration).mockResolvedValue({
            success: true,
            message: 'Configuration enregistrée.',
        })

        const result = await actionSubmitAdminMutation(
            undefined,
            createFormData({
                area: 'contactForm',
                title: 'Nouveau titre',
            })
        )

        expect(serviceContact.updateConfiguration).toHaveBeenCalledWith(
            expect.objectContaining({ area: 'contactForm', title: 'Nouveau titre' })
        )
        expect(result).toEqual({ success: true, message: 'Configuration enregistrée.' })
    })
})
