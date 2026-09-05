'use server'

import { revalidatePath } from 'next/cache'
import { authService, contactService, contentService, featureService, getCurrentSession, tagService, userService } from '@/services'
import type { IActionResult } from '@/types'

type IAdminArea = 'articles' | 'pages' | 'contactForm' | 'tags' | 'users' | 'features'

const areas: IAdminArea[] = ['articles', 'pages', 'contactForm', 'tags', 'users', 'features']

export const submitAdminMutation = async (
    _previousState: IActionResult | undefined,
    formData: FormData
): Promise<IActionResult> => {
    const area = String(formData.get('area')) as IAdminArea
    const operation = String(formData.get('operation') ?? 'modifiée')
    const session = await getCurrentSession()

    if (!session || !areas.includes(area) || !authService.canPerform(session.user.role, area, operation)) {
        return { success: false, message: 'Vous n’êtes pas autorisé à effectuer cette opération.' }
    }

    const values = Object.fromEntries(formData.entries())
    if (area === 'articles') {
        const selectedTagIds = formData.getAll('tags').map(String)
        const availableTags = await tagService.getTags()
        const tags = availableTags.filter((tag) => selectedTagIds.includes(tag.id))
        const result = await contentService.simulateArticleMutation(`Article ${operation}.`, { ...values, tags })
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
            ? await tagService.deleteTag(String(formData.get('id') ?? ''))
            : formData.get('id')
                ? await tagService.updateTag(String(formData.get('id')), tagValues)
                : await tagService.createTag(tagValues)
        return { success: result.success, message: result.message, errors: result.errors }
    }
    if (area === 'pages') {
        const result = await contentService.simulatePageMutation(values)
        return { success: result.success, message: result.message, errors: result.errors }
    }
    if (area === 'users') {
        const result = await userService.simulateMutation(values)
        return { success: result.success, message: result.message, errors: result.errors }
    }
    if (area === 'features') {
        const enabled = formData.getAll('enabled').map(String).includes('true')
        const result = await featureService.updateFlag(String(formData.get('feature') ?? ''), enabled)
        if (result.success) {
            revalidatePath('/')
            revalidatePath('/articles')
            revalidatePath('/articles/[slug]', 'page')
            revalidatePath('/contact')
        }
        return { success: result.success, message: result.message, errors: result.errors }
    }
    return contactService.simulateConfigurationMutation()
}