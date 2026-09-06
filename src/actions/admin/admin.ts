'use server'

import { revalidatePath } from 'next/cache'
import { serviceAuth, serviceContact, serviceContent, serviceFeature, serviceGetCurrentSession, serviceTag, serviceUser } from '@/services'
import type { IActionResult } from '@/types'

type IServiceAdminArea = 'articles' | 'pages' | 'contactForm' | 'tags' | 'users' | 'features'

const areas: IServiceAdminArea[] = ['articles', 'pages', 'contactForm', 'tags', 'users', 'features']

export const actionSubmitAdminMutation = async (
    _previousState: IActionResult | undefined,
    formData: FormData
): Promise<IActionResult> => {
    const area = String(formData.get('area')) as IServiceAdminArea
    const operation = String(formData.get('operation') ?? 'modifiée')
    const session = await serviceGetCurrentSession()

    if (!session || !areas.includes(area) || !serviceAuth.canPerform(session.user.role, area, operation)) {
        return { success: false, message: 'Vous n’êtes pas autorisé à effectuer cette opération.' }
    }

    const values = Object.fromEntries(formData.entries())
    if (area === 'articles') {
        const selectedTagIds = formData.getAll('tags').map(String)
        const availableTags = await serviceTag.getTags()
        const tags = availableTags.filter((tag) => selectedTagIds.includes(tag.id))
        const result = await serviceContent.simulateArticleMutation(`Article ${operation}.`, { ...values, tags })
        return { success: result.success, message: result.message, errors: result.errors }
    }
    if (area === 'tags') {
        const tagValues = {
            name: String(formData.get('name') ?? ''),
            slug: String(formData.get('slug') ?? ''),
            style: String(formData.get('style') ?? ''),
            description: String(formData.get('description') ?? ''),
        }
        const result = operation === 'supprimé'
            ? await serviceTag.deleteTag(String(formData.get('id') ?? ''))
            : formData.get('id')
                ? await serviceTag.updateTag(String(formData.get('id')), tagValues)
                : await serviceTag.createTag(tagValues)
        return { success: result.success, message: result.message, errors: result.errors }
    }
    if (area === 'pages') {
        const result = await serviceContent.simulatePageMutation(values)
        return { success: result.success, message: result.message, errors: result.errors }
    }
    if (area === 'users') {
        const result = await serviceUser.simulateMutation(values)
        return { success: result.success, message: result.message, errors: result.errors }
    }
    if (area === 'features') {
        const enabled = formData.getAll('enabled').map(String).includes('true')
        const result = await serviceFeature.updateFlag(String(formData.get('feature') ?? ''), enabled)
        if (result.success) {
            revalidatePath('/')
            revalidatePath('/articles')
            revalidatePath('/articles/[slug]', 'page')
            revalidatePath('/contact')
        }
        return { success: result.success, message: result.message, errors: result.errors }
    }
    return serviceContact.simulateConfigurationMutation()
}