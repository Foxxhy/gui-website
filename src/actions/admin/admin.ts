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
import { MUTATION_AREAS, type IActionResult } from '@/types'

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

    if (area === 'articles') {
        const result = await serviceContent.mutateArticleFromFormData(formData, session.user)
        return { success: result.success, message: result.message, errors: result.errors }
    }
    if (area === 'tags') {
        const result = await serviceTag.mutateFromFormData(formData, operation)
        return { success: result.success, message: result.message, errors: result.errors }
    }
    if (area === 'pages') {
        const result = await serviceContent.mutatePageFromFormData(formData)
        if (result.success) {
            revalidatePath('/')
            revalidatePath('/association')
            revalidatePath('/gestion-des-donnees')
        }
        return { success: result.success, message: result.message, errors: result.errors }
    }
    if (area === 'users') {
        const result = await serviceUser.mutateFromFormData(formData, operation)
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
    const result = await serviceContact.mutateFromAdminForm(formData, operation)
    return { success: result.success, message: result.message, errors: result.errors }
}
