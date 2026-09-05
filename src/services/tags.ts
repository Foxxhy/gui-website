import { articles, tags } from '@/mocks'
import type { IActionResult, IFieldErrors, ITag } from '@/types'
import { VALIDATION_LIMITS, fieldErrors, isValidSlug, normalizeSlug, toTrimmedString } from './validation'

type TagInput = Pick<ITag, 'name' | 'slug' | 'style'> & Pick<ITag, 'description'>

const validate = (values: Partial<TagInput>, currentId?: string): IFieldErrors => {
    const rawName = typeof values.name === 'string' ? values.name.trim() : ''
    const rawDescription = typeof values.description === 'string' ? values.description.trim() : ''
    const name = toTrimmedString(values.name, VALIDATION_LIMITS.name)
    const slug = normalizeSlug(values.slug)
    const style = toTrimmedString(values.style, 32)
    const errors = fieldErrors(
        ['name', !name ? 'Le nom est obligatoire.' : rawName.length > VALIDATION_LIMITS.name ? 'Le nom est trop long.' : undefined],
        ['slug', !slug ? 'Le slug est obligatoire.' : !isValidSlug(slug) ? 'Le slug contient des caractères invalides.' : undefined],
        ['style', !['green', 'blue', 'purple', 'red', 'yellow'].includes(style) ? 'Le style est invalide.' : undefined],
        ['description', rawDescription.length > VALIDATION_LIMITS.description ? 'La description est trop longue.' : undefined],
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

export const tagService = {
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
            name: toTrimmedString(values.name, VALIDATION_LIMITS.name),
            slug: normalizeSlug(values.slug),
            style: toTrimmedString(values.style, 32),
            description: toTrimmedString(values.description, VALIDATION_LIMITS.description) || undefined,
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
            name: toTrimmedString(values.name, VALIDATION_LIMITS.name),
            slug: normalizeSlug(values.slug),
            style: toTrimmedString(values.style, 32),
            description: toTrimmedString(values.description, VALIDATION_LIMITS.description) || undefined,
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