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
import type { ISession } from '@/types'

import { actionSubmitAdminMutation } from './admin'

jest.mock('next/cache', () => ({
revalidatePath: jest.fn(),
}))

jest.mock('@/services', () => ({
serviceAuth: {
canPerform: jest.fn(),
},
serviceContact: {
simulateConfigurationMutation: jest.fn(),
},
serviceContent: {
simulateArticleMutation: jest.fn(),
simulatePageMutation: jest.fn(),
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
simulateMutation: jest.fn(),
},
}))

describe('actionSubmitAdminMutation', () => {
const session = {
user: {
role: 'ADMIN',
},
} as unknown as ISession

const createFormData = (
    values: Record<string, string | string[]>
) => {
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
        createFormData({
            area: 'articles',
        })
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
        createFormData({
            area: 'unknown',
        })
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
        createFormData({
            area: 'articles',
            operation: 'modifiée',
        })
    )

    expect(serviceAuth.canPerform).toHaveBeenCalledWith(
        'ADMIN',
        'articles',
        'modifiée'
    )

    expect(result).toEqual({
        success: false,
        message: 'Vous n’êtes pas autorisé à effectuer cette opération.',
    })
})

it('simulates an article mutation with selected tags', async () => {
    jest.mocked(serviceGetCurrentSession).mockResolvedValue(session)
    jest.mocked(serviceAuth.canPerform).mockReturnValue(true)

    jest.mocked(serviceTag.getTags).mockResolvedValue([
        { id: 'tag-1', name: 'Tech' },
        { id: 'tag-2', name: 'News' },
        { id: 'tag-3', name: 'Other' },
    ] as never)

    jest.mocked(serviceContent.simulateArticleMutation).mockResolvedValue({
        success: true,
        message: 'Article modifiée.',
        errors: undefined,
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

    expect(serviceTag.getTags).toHaveBeenCalled()

    expect(serviceContent.simulateArticleMutation).toHaveBeenCalledWith(
        'Article modifiée.',
        expect.objectContaining({
            title: 'Mon article',
            tags: [
                { id: 'tag-1', name: 'Tech' },
                { id: 'tag-3', name: 'Other' },
            ],
        })
    )

    expect(result).toEqual({
        success: true,
        message: 'Article modifiée.',
        errors: undefined,
    })
})

it('creates a tag when no tag id is provided', async () => {
    jest.mocked(serviceGetCurrentSession).mockResolvedValue(session)
    jest.mocked(serviceAuth.canPerform).mockReturnValue(true)

    jest.mocked(serviceTag.createTag).mockResolvedValue({
        success: true,
        message: 'Tag créé.',
        errors: undefined,
    })

    const result = await actionSubmitAdminMutation(
        undefined,
        createFormData({
            area: 'tags',
            operation: 'créé',
            name: 'Tech',
            slug: 'tech',
            style: 'default',
            description: 'Technologie',
        })
    )

    expect(serviceTag.createTag).toHaveBeenCalledWith({
        name: 'Tech',
        slug: 'tech',
        style: 'default',
        description: 'Technologie',
    })

    expect(result).toEqual({
        success: true,
        message: 'Tag créé.',
        errors: undefined,
    })
})

it('updates a tag when an id is provided', async () => {
    jest.mocked(serviceGetCurrentSession).mockResolvedValue(session)
    jest.mocked(serviceAuth.canPerform).mockReturnValue(true)

    jest.mocked(serviceTag.updateTag).mockResolvedValue({
        success: true,
        message: 'Tag modifié.',
        errors: undefined,
    })

    const result = await actionSubmitAdminMutation(
        undefined,
        createFormData({
            area: 'tags',
            operation: 'modifié',
            id: 'tag-1',
            name: 'Tech',
            slug: 'tech',
            style: 'default',
            description: 'Technologie',
        })
    )

    expect(serviceTag.updateTag).toHaveBeenCalledWith(
        'tag-1',
        {
            name: 'Tech',
            slug: 'tech',
            style: 'default',
            description: 'Technologie',
        }
    )

    expect(result).toEqual({
        success: true,
        message: 'Tag modifié.',
        errors: undefined,
    })
})

it('deletes a tag when the operation is suppressed', async () => {
    jest.mocked(serviceGetCurrentSession).mockResolvedValue(session)
    jest.mocked(serviceAuth.canPerform).mockReturnValue(true)

    jest.mocked(serviceTag.deleteTag).mockResolvedValue({
        success: true,
        message: 'Tag supprimé.',
        errors: undefined,
    })

    const result = await actionSubmitAdminMutation(
        undefined,
        createFormData({
            area: 'tags',
            operation: 'supprimé',
            id: 'tag-1',
        })
    )

    expect(serviceTag.deleteTag).toHaveBeenCalledWith('tag-1')

    expect(result).toEqual({
        success: true,
        message: 'Tag supprimé.',
        errors: undefined,
    })
})

it('simulates a page mutation', async () => {
    jest.mocked(serviceGetCurrentSession).mockResolvedValue(session)
    jest.mocked(serviceAuth.canPerform).mockReturnValue(true)

    jest.mocked(serviceContent.simulatePageMutation).mockResolvedValue({
        success: true,
        message: 'Page modifiée.',
        errors: undefined,
    })

    const result = await actionSubmitAdminMutation(
        undefined,
        createFormData({
            area: 'pages',
            title: 'Accueil',
            content: 'Contenu',
        })
    )

    expect(serviceContent.simulatePageMutation).toHaveBeenCalledWith({
        area: 'pages',
        title: 'Accueil',
        content: 'Contenu',
    })

    expect(result).toEqual({
        success: true,
        message: 'Page modifiée.',
        errors: undefined,
    })
})

it('simulates a user mutation', async () => {
    jest.mocked(serviceGetCurrentSession).mockResolvedValue(session)
    jest.mocked(serviceAuth.canPerform).mockReturnValue(true)

    jest.mocked(serviceUser.simulateMutation).mockResolvedValue({
        success: true,
        message: 'Utilisateur modifié.',
        errors: undefined,
    })

    const result = await actionSubmitAdminMutation(
        undefined,
        createFormData({
            area: 'users',
            id: 'user-1',
            role: 'EDITOR',
        })
    )

    expect(serviceUser.simulateMutation).toHaveBeenCalledWith({
        area: 'users',
        id: 'user-1',
        role: 'EDITOR',
    })

    expect(result).toEqual({
        success: true,
        message: 'Utilisateur modifié.',
        errors: undefined,
    })
})

it('enables a feature and revalidates affected pages', async () => {
    jest.mocked(serviceGetCurrentSession).mockResolvedValue(session)
    jest.mocked(serviceAuth.canPerform).mockReturnValue(true)

    jest.mocked(serviceFeature.updateFlag).mockResolvedValue({
        success: true,
        message: 'Feature activée.',
        errors: undefined,
    })

    const result = await actionSubmitAdminMutation(
        undefined,
        createFormData({
            area: 'features',
            feature: 'articles',
            enabled: 'true',
        })
    )

    expect(serviceFeature.updateFlag).toHaveBeenCalledWith(
        'articles',
        true
    )

    expect(revalidatePath).toHaveBeenCalledWith('/')
    expect(revalidatePath).toHaveBeenCalledWith('/articles')
    expect(revalidatePath).toHaveBeenCalledWith(
        '/articles/[slug]',
        'page'
    )
    expect(revalidatePath).toHaveBeenCalledWith('/contact')

    expect(result).toEqual({
        success: true,
        message: 'Feature activée.',
        errors: undefined,
    })
})

it('does not revalidate pages when a feature update fails', async () => {
    jest.mocked(serviceGetCurrentSession).mockResolvedValue(session)
    jest.mocked(serviceAuth.canPerform).mockReturnValue(true)

    jest.mocked(serviceFeature.updateFlag).mockResolvedValue({
        success: false,
        message: 'Feature introuvable.',
        errors: { feature: 'Feature introuvable.' },
    })

    const result = await actionSubmitAdminMutation(
        undefined,
        createFormData({
            area: 'features',
            feature: 'unknown',
            enabled: 'false',
        })
    )

    expect(serviceFeature.updateFlag).toHaveBeenCalledWith(
        'unknown',
        false
    )

    expect(revalidatePath).not.toHaveBeenCalled()

    expect(result).toEqual({
        success: false,
        message: 'Feature introuvable.',
        errors: { feature: 'Feature introuvable.' },
    })
})

it('simulates a contact form configuration mutation', async () => {
    jest.mocked(serviceGetCurrentSession).mockResolvedValue(session)
    jest.mocked(serviceAuth.canPerform).mockReturnValue(true)

    jest.mocked(serviceContact.simulateConfigurationMutation).mockResolvedValue({
        success: true,
        message: 'Configuration enregistrée.',
        errors: undefined,
    })

    const result = await actionSubmitAdminMutation(
        undefined,
        createFormData({
            area: 'contactForm',
        })
    )

    expect(
        serviceContact.simulateConfigurationMutation
    ).toHaveBeenCalled()

    expect(result).toEqual({
        success: true,
        message: 'Configuration enregistrée.',
        errors: undefined,
    })
})
})
