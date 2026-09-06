import { getRepositories } from '@/repositories'
import { validatePageSections } from '@/services/content/page-sections'
import { serviceValidationLimits, serviceFieldErrors, serviceIsValidSlug, serviceMaxLengthError, serviceNormalizeSlug, serviceRequiredError } from '@/services/validation'
import {
    IStatus,
    type IActionResult,
    type IArticle,
    type IArticlePagination,
    type IArticleQuery,
    type IPage,
    type IUser,
} from '@/types'

const validateArticle = async (values: Partial<IArticle>): Promise<IActionResult<Partial<IArticle>> | undefined> => {
    const allArticles = await getRepositories().articles.findAll()
    const slug = serviceNormalizeSlug(values.slug)
    const rawTitle = typeof values.title === 'string' ? values.title.trim() : ''
    const rawContent = typeof values.content === 'string' ? values.content.trim() : ''
    const errors = serviceFieldErrors(
        ['title', serviceRequiredError(rawTitle, 'Le titre est obligatoire.') ?? serviceMaxLengthError(rawTitle, serviceValidationLimits.title, 'Le titre est trop long.')],
        ['slug', !serviceIsValidSlug(slug) ? 'Le slug est invalide.' : undefined],
        ['content', serviceRequiredError(rawContent, 'Le contenu est obligatoire.') ?? serviceMaxLengthError(rawContent, serviceValidationLimits.content, 'Le contenu est trop long.')],
        ['status', values.status && !Object.values(IStatus).includes(values.status) ? 'Le statut est invalide.' : undefined],
    )
    if (allArticles.some((article) => article.slug === slug && article.id !== values.id)) errors.slug = 'Ce slug est déjà utilisé.'
    return Object.keys(errors).length ? { success: false, message: 'L’article contient des erreurs.', errors } : undefined
}

const validatePage = async (values: Partial<IPage>): Promise<IActionResult<Partial<IPage>> | undefined> => {
    const allPages = await getRepositories().pages.findAll()
    const slug = serviceNormalizeSlug(values.slug ?? '')
    const rawTitle = typeof values.title === 'string' ? values.title.trim() : ''
    const rawContent = typeof values.content === 'string' ? values.content.trim() : ''
    const errors = serviceFieldErrors(
        ['title', serviceRequiredError(rawTitle, 'Le titre est obligatoire.') ?? serviceMaxLengthError(rawTitle, serviceValidationLimits.title, 'Le titre est trop long.')],
        ['slug', values.slug !== undefined && !serviceIsValidSlug(slug) ? 'Le slug est invalide.' : undefined],
        ['content', serviceRequiredError(rawContent, 'Le contenu est obligatoire.') ?? serviceMaxLengthError(rawContent, serviceValidationLimits.content, 'Le contenu est trop long.')],
    )
    if (values.slug && allPages.some((page) => page.slug === slug && page.id !== values.id)) errors.slug = 'Ce slug est déjà utilisé.'
    return Object.keys(errors).length ? { success: false, message: 'La page contient des erreurs.', errors } : undefined
}

export const serviceContent = {
    getPublishedArticles: async (): Promise<IArticle[]> => {
        const allArticles = await getRepositories().articles.findAll()
        return allArticles.filter((article) => article.status === IStatus.PUBLISHED)
    },
    getPublishedArticlesPage: async (query: IArticleQuery): Promise<IArticlePagination> => {
        const search = query.search?.trim().toLocaleLowerCase('fr-FR')
        const tagSlugs = [...new Set(query.tagSlugs ?? [])]
        const limit = Number.isInteger(query.limit) && query.limit > 0 ? query.limit : 10

        let filteredArticles = (await getRepositories().articles.findAll()).filter(
            (article) => article.status === IStatus.PUBLISHED
        )

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
    },
    getAllArticles: async (): Promise<IArticle[]> => getRepositories().articles.findAll(),
    getPublishedArticleBySlug: async (slug: string): Promise<IArticle | undefined> =>
        getRepositories().articles.findPublishedBySlug(slug),
    getArticleById: async (id: string): Promise<IArticle | undefined> =>
        getRepositories().articles.findById(id),
    getPageBySlug: async (slug: string): Promise<IPage | undefined> =>
        getRepositories().pages.findBySlug(slug),
    getPages: async (): Promise<IPage[]> => getRepositories().pages.findAll(),
    createArticle: async (values: Partial<IArticle>, author: IUser): Promise<IActionResult<IArticle>> => {
        const validation = await validateArticle(values)
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
        const created = await getRepositories().articles.create(article)
        return { success: true, message: 'Article créé.', data: created }
    },
    updateArticle: async (id: string, values: Partial<IArticle>, author?: IUser): Promise<IActionResult<IArticle>> => {
        const existing = await getRepositories().articles.findById(id)
        if (!existing) return { success: false, message: 'Article introuvable.' }

        const validation = await validateArticle({ ...values, id })
        if (validation) return validation as IActionResult<IArticle>

        const now = new Date().toISOString()
        const updated = await getRepositories().articles.update(id, {
            title: typeof values.title === 'string' ? values.title.trim() : existing.title,
            slug: values.slug ? serviceNormalizeSlug(values.slug) : existing.slug,
            description: typeof values.description === 'string' ? values.description.trim() : existing.description,
            content: typeof values.content === 'string' ? values.content.trim() : existing.content,
            status: values.status ?? existing.status,
            tags: values.tags ?? existing.tags,
            author: author ?? existing.author,
            publishedAt:
                values.status === IStatus.PUBLISHED
                    ? existing.publishedAt ?? now
                    : values.status !== undefined
                        ? undefined
                        : existing.publishedAt,
            updatedAt: now,
        })
        if (!updated) return { success: false, message: 'Article introuvable.' }
        return { success: true, message: 'Article modifié.', data: updated }
    },
    updatePage: async (id: string, values: Partial<IPage>): Promise<IActionResult<IPage>> => {
        const existing = await getRepositories().pages.findAll().then((pages) => pages.find((page) => page.id === id))
        if (!existing) return { success: false, message: 'Page introuvable.' }

        const sections = values.sections ?? existing.sections
        const sectionError = validatePageSections(sections)
        if (sectionError) return { success: false, message: sectionError }

        const merged = {
            ...values,
            id,
            slug: values.slug ?? existing.slug,
            title: values.title ?? existing.title,
            content: values.content ?? existing.content,
            sections,
        }
        const validation = await validatePage(merged)
        if (validation) return validation as IActionResult<IPage>

        const updated = await getRepositories().pages.update(id, {
            title: typeof values.title === 'string' ? values.title.trim() : existing.title,
            slug: values.slug ? serviceNormalizeSlug(values.slug) : existing.slug,
            content: typeof values.content === 'string' ? values.content.trim() : existing.content,
            sections,
            updatedAt: new Date().toISOString(),
        })
        if (!updated) return { success: false, message: 'Page introuvable.' }
        return { success: true, message: 'Page enregistrée.', data: updated }
    },
}
