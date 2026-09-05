import { articles, tags } from '@/mocks'
import type { IActionResult, IFieldErrors, ITag } from '@/types'

type TagInput = Pick<ITag, 'name' | 'slug' | 'style'> & Pick<ITag, 'description'>

const validate = (values: Partial<TagInput>, currentId?: string): IFieldErrors => {
    const errors: IFieldErrors = {}
    const name = String(values.name ?? '').trim()
    const slug = String(values.slug ?? '').trim()
    const style = String(values.style ?? '').trim()

    if (!name) errors.name = 'Le nom est obligatoire.'
    if (!slug) errors.slug = 'Le slug est obligatoire.'
    if (!style) errors.style = 'Le style est obligatoire.'
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
            name: String(values.name).trim(),
            slug: String(values.slug).trim(),
            style: String(values.style).trim(),
            description: String(values.description ?? '').trim() || undefined,
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
            name: String(values.name).trim(),
            slug: String(values.slug).trim(),
            style: String(values.style).trim(),
            description: String(values.description ?? '').trim() || undefined,
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