import { mockStore } from '@/repositories/mock-store'
import { serviceValidationLimits, serviceFieldErrors, serviceIsValidSlug, serviceNormalizeSlug, serviceToTrimmedString } from '@/services/validation'
import { TAG_STYLES, type IFieldErrors, type ITag } from '@/types'
import type { ITagInput, ITagRepository } from './tags'

const validate = (values: Partial<ITagInput>, tags: ITag[], currentId?: string): IFieldErrors => {
    const rawName = typeof values.name === 'string' ? values.name.trim() : ''
    const rawDescription = typeof values.description === 'string' ? values.description.trim() : ''
    const name = serviceToTrimmedString(values.name, serviceValidationLimits.name)
    const slug = serviceNormalizeSlug(values.slug)
    const style = serviceToTrimmedString(values.style, 32)
    const errors = serviceFieldErrors(
        ['name', !name ? 'Le nom est obligatoire.' : rawName.length > serviceValidationLimits.name ? 'Le nom est trop long.' : undefined],
        ['slug', !slug ? 'Le slug est obligatoire.' : !serviceIsValidSlug(slug) ? 'Le slug contient des caractères invalides.' : undefined],
        ['style', !TAG_STYLES.includes(style as ITag['style']) ? 'Le style est invalide.' : undefined],
        ['description', rawDescription.length > serviceValidationLimits.description ? 'La description est trop longue.' : undefined],
    )
    if (slug && tags.some((tag) => tag.slug === slug && tag.id !== currentId)) {
        errors.slug = 'Ce slug est déjà utilisé.'
    }
    return errors
}

export const mockTagRepository: ITagRepository = {
    findAll: () => mockStore.getSnapshot().tags,
    findById: (id) => mockStore.getSnapshot().tags.find((tag) => tag.id === id),
    findBySlug: (slug) => mockStore.getSnapshot().tags.find((tag) => tag.slug === slug),
    create: (values) => {
        const store = mockStore.getSnapshot()
        const errors = validate(values, store.tags)
        if (Object.keys(errors).length > 0) {
            return { success: false, message: 'Le tag contient des erreurs.', errors }
        }
        const tag: ITag = {
            id: `tag-${Date.now()}`,
            name: serviceToTrimmedString(values.name, serviceValidationLimits.name),
            slug: serviceNormalizeSlug(values.slug),
            style: serviceToTrimmedString(values.style, 32) as ITag['style'],
            description: serviceToTrimmedString(values.description, serviceValidationLimits.description) || undefined,
        }
        store.tags.push(tag)
        return { success: true, message: 'Tag créé.', data: tag }
    },
    update: (id, values) => {
        const store = mockStore.getSnapshot()
        const tag = store.tags.find((candidate) => candidate.id === id)
        if (!tag) return { success: false, message: 'Tag introuvable.' }
        const errors = validate(values, store.tags, id)
        if (Object.keys(errors).length > 0) {
            return { success: false, message: 'Le tag contient des erreurs.', errors }
        }
        Object.assign(tag, {
            name: serviceToTrimmedString(values.name, serviceValidationLimits.name),
            slug: serviceNormalizeSlug(values.slug),
            style: serviceToTrimmedString(values.style, 32) as ITag['style'],
            description: serviceToTrimmedString(values.description, serviceValidationLimits.description) || undefined,
        })
        return { success: true, message: 'Tag modifié.', data: tag }
    },
    delete: (id) => {
        const store = mockStore.getSnapshot()
        const index = store.tags.findIndex((tag) => tag.id === id)
        if (index < 0) return { success: false, message: 'Tag introuvable.' }
        store.tags.splice(index, 1)
        for (const article of store.articles) {
            article.tags = article.tags?.filter((tag) => tag.id !== id)
        }
        return { success: true, message: 'Tag supprimé et associations retirées.' }
    },
}
