import { articles, tags } from '@/mocks'
import { serviceValidationLimits, serviceFieldErrors, serviceIsValidSlug, serviceNormalizeSlug, serviceToTrimmedString } from '@/services/validation'
import type { IActionResult, IFieldErrors, ITag } from '@/types'

type TagInput = Pick<ITag, 'name' | 'slug' | 'style'> & Pick<ITag, 'description'>

const validate = (values: Partial<TagInput>, currentId?: string): IFieldErrors => {
    const rawName = typeof values.name === 'string' ? values.name.trim() : ''
    const rawDescription = typeof values.description === 'string' ? values.description.trim() : ''
    const name = serviceToTrimmedString(values.name, serviceValidationLimits.name)
    const slug = serviceNormalizeSlug(values.slug)
    const style = serviceToTrimmedString(values.style, 32)
    const errors = serviceFieldErrors(
        ['name', !name ? 'Le nom est obligatoire.' : rawName.length > serviceValidationLimits.name ? 'Le nom est trop long.' : undefined],
        ['slug', !slug ? 'Le slug est obligatoire.' : !serviceIsValidSlug(slug) ? 'Le slug contient des caractères invalides.' : undefined],
        ['style', !['green', 'blue', 'purple', 'red', 'yellow'].includes(style) ? 'Le style est invalide.' : undefined],
        ['description', rawDescription.length > serviceValidationLimits.description ? 'La description est trop longue.' : undefined],
    )
    if (slug && tags.some((tag) => tag.slug === slug && tag.id !== currentId)) {
        errors.slug = 'Ce slug est déjà utilisé.'
    }
    return errors
}

const result = <T>(message: string, data?: T): IActionResult<T> => ({
    success: true,
    message: `${message} La simulation sera réinitialisée au rechargement.`,
    data,
})

export const serviceTag = {
    getTags: async (): Promise<ITag[]> => tags,
    getTagById: async (id: string): Promise<ITag | undefined> =>
        tags.find((tag) => tag.id === id),
    createTag: async (values: Partial<TagInput>): Promise<IActionResult<ITag>> => {
        const errors = validate(values)
        if (Object.keys(errors).length > 0) {
            return { success: false, message: 'Le tag contient des erreurs.', errors }
        }
        const tag: ITag = {
            id: `tag-${Date.now()}`,
            name: serviceToTrimmedString(values.name, serviceValidationLimits.name),
            slug: serviceNormalizeSlug(values.slug),
            style: serviceToTrimmedString(values.style, 32),
            description: serviceToTrimmedString(values.description, serviceValidationLimits.description) || undefined,
        }
        tags.push(tag)
        return result('Tag créé.', tag)
    },
    updateTag: async (id: string, values: Partial<TagInput>): Promise<IActionResult<ITag>> => {
        const tag = tags.find((candidate) => candidate.id === id)
        if (!tag) return { success: false, message: 'Tag introuvable.' }
        const errors = validate(values, id)
        if (Object.keys(errors).length > 0) {
            return { success: false, message: 'Le tag contient des erreurs.', errors }
        }
        Object.assign(tag, {
            name: serviceToTrimmedString(values.name, serviceValidationLimits.name),
            slug: serviceNormalizeSlug(values.slug),
            style: serviceToTrimmedString(values.style, 32),
            description: serviceToTrimmedString(values.description, serviceValidationLimits.description) || undefined,
        })
        return result('Tag modifié.', tag)
    },
    deleteTag: async (id: string): Promise<IActionResult> => {
        const index = tags.findIndex((tag) => tag.id === id)
        if (index < 0) return { success: false, message: 'Tag introuvable.' }
        tags.splice(index, 1)
        for (const article of articles) {
            article.tags = article.tags?.filter((tag) => tag.id !== id)
        }
        return result('Tag supprimé et associations retirées.')
    },
}