'use server'

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
import { parsePageSectionsFromFormData } from '@/services/content/page-sections'
import { IStatus, MUTATION_AREAS, TAG_STYLES, type IActionResult, type ITagStyle } from '@/types'

export const actionSubmitAdminMutation = async (
    _previousState: IActionResult | undefined,
    formData: FormData
): Promise<IActionResult> => {
    const area = String(formData.get('area')) as (typeof MUTATION_AREAS)[number]
    const operation = String(formData.get('operation') ?? 'modifiée')
    const session = await serviceGetCurrentSession()

    if (!session || !MUTATION_AREAS.includes(area) || !serviceAuth.canPerform(session.user.role, area, operation)) {
        return { success: false, message: 'Vous n’êtes pas autorisé à effectuer cette opération.' }
    }

    const values = Object.fromEntries(formData.entries())
    if (area === 'articles') {
        const selectedTagIds = formData.getAll('tags').map(String)
        const availableTags = await serviceTag.getTags()
        const tags = availableTags.filter((tag) => selectedTagIds.includes(tag.id))
        const rawStatus = typeof values.status === 'string' ? values.status : undefined
        const status = rawStatus && Object.values(IStatus).includes(rawStatus as IStatus)
            ? rawStatus as IStatus
            : undefined
        const articleValues = { ...values, tags, status }
        const result = formData.get('id')
            ? await serviceContent.updateArticle(String(formData.get('id')), articleValues, session.user)
            : await serviceContent.createArticle(articleValues, session.user)
        return { success: result.success, message: result.message, errors: result.errors }
    }
    if (area === 'tags') {
        const rawStyle = String(formData.get('style') ?? '')
        const style = TAG_STYLES.includes(rawStyle as ITagStyle) ? rawStyle as ITagStyle : 'green'
        const tagValues = {
            name: String(formData.get('name') ?? ''),
            slug: String(formData.get('slug') ?? ''),
            style,
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
        const pageId = String(formData.get('id') ?? '')
        const existing = (await serviceContent.getPages()).find((page) => page.id === pageId)
        if (!existing) return { success: false, message: 'Page introuvable.' }

        const sections = parsePageSectionsFromFormData(formData, existing.sections)
        const result = await serviceContent.updatePage(pageId, { ...values, sections })
        if (result.success) {
            revalidatePath('/')
            revalidatePath('/association')
            revalidatePath('/gestion-des-donnees')
        }
        return { success: result.success, message: result.message, errors: result.errors }
    }
    if (area === 'users') {
        if (operation === 'supprimé') {
            const result = await serviceUser.deleteUser(String(formData.get('id') ?? ''))
            return { success: result.success, message: result.message, errors: result.errors }
        }
        const result = formData.get('id')
            ? await serviceUser.updateUser(String(formData.get('id')), values)
            : await serviceUser.createUser(values)
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
    const result = await serviceContact.updateConfiguration(values)
    return { success: result.success, message: result.message, errors: result.errors }
}
