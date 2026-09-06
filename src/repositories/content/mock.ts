import { mockStore } from '@/repositories/mock-store'
import { serviceValidationLimits, serviceFieldErrors, serviceIsValidSlug, serviceNormalizeSlug } from '@/services/validation'
import { IStatus, type IActionResult, type IArticle, type IPage } from '@/types'
import type { IContentRepository } from './content'

const validateArticle = (values: Partial<IArticle>, articles: IArticle[]): IActionResult<Partial<IArticle>> | undefined => {
    const slug = serviceNormalizeSlug(values.slug)
    const rawTitle = typeof values.title === 'string' ? values.title.trim() : ''
    const rawContent = typeof values.content === 'string' ? values.content.trim() : ''
    const errors = serviceFieldErrors(
        ['title', !rawTitle ? 'Le titre est obligatoire.' : rawTitle.length > serviceValidationLimits.title ? 'Le titre est trop long.' : undefined],
        ['slug', !serviceIsValidSlug(slug) ? 'Le slug est invalide.' : undefined],
        ['content', !rawContent ? 'Le contenu est obligatoire.' : rawContent.length > serviceValidationLimits.content ? 'Le contenu est trop long.' : undefined],
        ['status', values.status && !Object.values(IStatus).includes(values.status) ? 'Le statut est invalide.' : undefined],
    )
    if (articles.some((article) => article.slug === slug && article.id !== values.id)) {
        errors.slug = 'Ce slug est déjà utilisé.'
    }
    return Object.keys(errors).length ? { success: false, message: 'L’article contient des erreurs.', errors } : undefined
}

const validatePage = (values: Partial<IPage>, pages: IPage[]): IActionResult<Partial<IPage>> | undefined => {
    const slug = serviceNormalizeSlug(values.slug)
    const rawTitle = typeof values.title === 'string' ? values.title.trim() : ''
    const rawContent = typeof values.content === 'string' ? values.content.trim() : ''
    const errors = serviceFieldErrors(
        ['title', !rawTitle ? 'Le titre est obligatoire.' : rawTitle.length > serviceValidationLimits.title ? 'Le titre est trop long.' : undefined],
        ['slug', !serviceIsValidSlug(slug) ? 'Le slug est invalide.' : undefined],
        ['content', !rawContent ? 'Le contenu est obligatoire.' : rawContent.length > serviceValidationLimits.content ? 'Le contenu est trop long.' : undefined],
    )
    if (pages.some((page) => page.slug === slug && page.id !== values.id)) {
        errors.slug = 'Ce slug est déjà utilisé.'
    }
    return Object.keys(errors).length ? { success: false, message: 'La page contient des erreurs.', errors } : undefined
}

const filterPublishedArticles = (articles: IArticle[], query: { search?: string; tagSlugs?: string[]; page: number; limit: number }) => {
    const search = query.search?.trim().toLocaleLowerCase('fr-FR')
    const tagSlugs = [...new Set(query.tagSlugs ?? [])]
    const limit = Number.isInteger(query.limit) && query.limit > 0 ? query.limit : 10

    let filteredArticles = articles.filter((article) => article.status === IStatus.PUBLISHED)

    if (search) {
        filteredArticles = filteredArticles.filter((article) =>
            [article.title, article.description]
                .filter((value): value is string => Boolean(value))
                .some((value) => value.toLocaleLowerCase('fr-FR').includes(search))
        )
    }

    if (tagSlugs.length > 0) {
        filteredArticles = filteredArticles.filter((article) => {
            const articleTagSlugs = new Set(article.tags?.map((tag) => tag.slug))
            return tagSlugs.every((tagSlug) => articleTagSlugs.has(tagSlug))
        })
    }

    const total = filteredArticles.length
    const totalPages = Math.ceil(total / limit)
    const requestedPage = Number.isInteger(query.page) && query.page > 0 ? query.page : 1
    const page = totalPages > 0 ? Math.min(requestedPage, totalPages) : 1
    const start = (page - 1) * limit

    return {
        articles: filteredArticles.slice(start, start + limit),
        total,
        page,
        totalPages,
    }
}

export const mockContentRepository: IContentRepository = {
    findPublishedArticles: () =>
        mockStore.getSnapshot().articles.filter((article) => article.status === IStatus.PUBLISHED),
    findPublishedArticlesPage: (query) =>
        filterPublishedArticles(mockStore.getSnapshot().articles, query),
    findAllArticles: () => mockStore.getSnapshot().articles,
    findPublishedArticleBySlug: (slug) =>
        mockStore.getSnapshot().articles.find(
            (article) => article.slug === slug && article.status === IStatus.PUBLISHED
        ),
    findArticleById: (id) => mockStore.getSnapshot().articles.find((article) => article.id === id),
    createArticle: (values, author) => {
        const store = mockStore.getSnapshot()
        const validation = validateArticle(values, store.articles)
        if (validation) return validation as IActionResult<IArticle>

        const now = new Date().toISOString()
        const article: IArticle = {
            id: `article-${Date.now()}`,
            title: String(values.title).trim(),
            slug: serviceNormalizeSlug(values.slug),
            description: typeof values.description === 'string' ? values.description.trim() : undefined,
            content: String(values.content).trim(),
            category: values.category,
            tags: values.tags,
            author,
            status: values.status ?? IStatus.DRAFT,
            publishedAt: values.status === IStatus.PUBLISHED ? now : undefined,
            createdAt: now,
            updatedAt: now,
        }
        store.articles.push(article)
        return { success: true, message: 'Article créé.', data: article }
    },
    updateArticle: (id, values, author) => {
        const store = mockStore.getSnapshot()
        const article = store.articles.find((candidate) => candidate.id === id)
        if (!article) return { success: false, message: 'Article introuvable.' }

        const validation = validateArticle({ ...values, id }, store.articles)
        if (validation) return validation as IActionResult<IArticle>

        const now = new Date().toISOString()
        Object.assign(article, {
            title: typeof values.title === 'string' ? values.title.trim() : article.title,
            slug: values.slug ? serviceNormalizeSlug(values.slug) : article.slug,
            description: typeof values.description === 'string' ? values.description.trim() : article.description,
            content: typeof values.content === 'string' ? values.content.trim() : article.content,
            status: values.status ?? article.status,
            tags: values.tags ?? article.tags,
            author: author ?? article.author,
            publishedAt:
                values.status === IStatus.PUBLISHED
                    ? article.publishedAt ?? now
                    : values.status !== undefined
                        ? undefined
                        : article.publishedAt,
            updatedAt: now,
        })
        return { success: true, message: 'Article modifié.', data: article }
    },
    findPageBySlug: (slug) => mockStore.getSnapshot().pages.find((page) => page.slug === slug),
    findAllPages: () => mockStore.getSnapshot().pages,
    updatePage: (id, values) => {
        const store = mockStore.getSnapshot()
        const page = store.pages.find((candidate) => candidate.id === id)
        if (!page) return { success: false, message: 'Page introuvable.' }

        const mergedValues = {
            ...values,
            id,
            slug: values.slug ?? page.slug,
            title: values.title ?? page.title,
            content: values.content ?? page.content,
        }
        const validation = validatePage(mergedValues, store.pages)
        if (validation) return validation as IActionResult<IPage>

        Object.assign(page, {
            title: typeof values.title === 'string' ? values.title.trim() : page.title,
            slug: values.slug ? serviceNormalizeSlug(values.slug) : page.slug,
            content: typeof values.content === 'string' ? values.content.trim() : page.content,
            updatedAt: new Date().toISOString(),
        })
        return { success: true, message: 'Page enregistrée.', data: page }
    },
}
