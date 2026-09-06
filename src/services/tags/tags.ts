import { getRepositories } from '@/repositories'
import { serviceValidationLimits, serviceFieldErrors, serviceIsValidSlug, serviceNormalizeSlug, serviceToTrimmedString } from '@/services/validation'
import type { IActionResult, IFieldErrors, ITag } from '@/types'

type TagInput = Pick<ITag, 'name' | 'slug' | 'style'> & Pick<ITag, 'description'>

const validate = async (values: Partial<TagInput>, currentId?: string): Promise<IFieldErrors> => {
    const { tags } = getRepositories()
    const allTags = await tags.findAll()
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
    if (slug && allTags.some((tag) => tag.slug === slug && tag.id !== currentId)) {
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
    getTags: async (): Promise<ITag[]> => getRepositories().tags.findAll(),
    getTagById: async (id: string): Promise<ITag | undefined> =>
        getRepositories().tags.findById(id),
    createTag: async (values: Partial<TagInput>): Promise<IActionResult<ITag>> => {
        const errors = await validate(values)
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
        const created = await getRepositories().tags.create(tag)
        return result('Tag créé.', created)
    },
    updateTag: async (id: string, values: Partial<TagInput>): Promise<IActionResult<ITag>> => {
        const { tags } = getRepositories()
        const tag = await tags.findById(id)
        if (!tag) return { success: false, message: 'Tag introuvable.' }
        const errors = await validate(values, id)
        if (Object.keys(errors).length > 0) {
            return { success: false, message: 'Le tag contient des erreurs.', errors }
        }
        const updated = await tags.update(id, {
            name: serviceToTrimmedString(values.name, serviceValidationLimits.name),
            slug: serviceNormalizeSlug(values.slug),
            style: serviceToTrimmedString(values.style, 32),
            description: serviceToTrimmedString(values.description, serviceValidationLimits.description) || undefined,
        })
        return result('Tag modifié.', updated)
    },
    deleteTag: async (id: string): Promise<IActionResult> => {
        const { tags } = getRepositories()
        const deleted = await tags.delete(id)
        if (!deleted) return { success: false, message: 'Tag introuvable.' }
        await tags.removeTagFromArticles(id)
        return result('Tag supprimé et associations retirées.')
    },
}
