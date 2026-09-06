import { getRepositories } from '@/repositories'
import { serviceValidationLimits, serviceFieldErrors, serviceIsValidSlug, serviceNormalizeSlug } from '@/services/validation'
import {
    IStatus,
    type IActionResult,
    type IArticle,
    type IArticlePagination,
    type IArticleQuery,
    type IPage,
} from '@/types'

const simulatedResult = <T>(message: string, data?: T): IActionResult<T> => ({
    success: true,
    message: `${message} La simulation ne conserve pas cette modification.`,
    data,
})

const validateArticle = async (values: Partial<IArticle>): Promise<IActionResult<Partial<IArticle>> | undefined> => {
    const { articles } = getRepositories()
    const allArticles = await articles.findAll()
    const slug = serviceNormalizeSlug(values.slug)
    const rawTitle = typeof values.title === 'string' ? values.title.trim() : ''
    const rawContent = typeof values.content === 'string' ? values.content.trim() : ''
    const errors = serviceFieldErrors(
        ['title', !rawTitle ? 'Le titre est obligatoire.' : rawTitle.length > serviceValidationLimits.title ? 'Le titre est trop long.' : undefined],
        ['slug', !serviceIsValidSlug(slug) ? 'Le slug est invalide.' : undefined],
        ['content', !rawContent ? 'Le contenu est obligatoire.' : rawContent.length > serviceValidationLimits.content ? 'Le contenu est trop long.' : undefined],
        ['status', values.status && !Object.values(IStatus).includes(values.status) ? 'Le statut est invalide.' : undefined],
    )
    if (allArticles.some((article) => article.slug === slug && article.id !== values.id)) errors.slug = 'Ce slug est déjà utilisé.'
    return Object.keys(errors).length ? { success: false, message: 'L’article contient des erreurs.', errors } : undefined
}

const validatePage = async (values: Partial<IPage>): Promise<IActionResult<Partial<IPage>> | undefined> => {
    const { pages } = getRepositories()
    const allPages = await pages.findAll()
    const slug = serviceNormalizeSlug(values.slug)
    const rawTitle = typeof values.title === 'string' ? values.title.trim() : ''
    const rawContent = typeof values.content === 'string' ? values.content.trim() : ''
    const errors = serviceFieldErrors(
        ['title', !rawTitle ? 'Le titre est obligatoire.' : rawTitle.length > serviceValidationLimits.title ? 'Le titre est trop long.' : undefined],
        ['slug', !serviceIsValidSlug(slug) ? 'Le slug est invalide.' : undefined],
        ['content', !rawContent ? 'Le contenu est obligatoire.' : rawContent.length > serviceValidationLimits.content ? 'Le contenu est trop long.' : undefined],
    )
    if (allPages.some((page) => page.slug === slug && page.id !== values.id)) errors.slug = 'Ce slug est déjà utilisé.'
    return Object.keys(errors).length ? { success: false, message: 'La page contient des erreurs.', errors } : undefined
}

export const serviceContent = {
    getPublishedArticles: async (): Promise<IArticle[]> => {
        const { articles } = getRepositories()
        const allArticles = await articles.findAll()
        return allArticles.filter((article) => article.status === IStatus.PUBLISHED)
    },
    getPublishedArticlesPage: async (
        query: IArticleQuery
    ): Promise<IArticlePagination> => {
        const { articles } = getRepositories()
        const search = query.search?.trim().toLocaleLowerCase('fr-FR')
        const tagSlugs = [...new Set(query.tagSlugs ?? [])]
        const limit = Number.isInteger(query.limit) && query.limit > 0 ? query.limit : 10

        let filteredArticles = (await articles.findAll()).filter(
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
    simulateArticleMutation: async (
        message: string,
        values: Partial<IArticle>
    ): Promise<IActionResult<Partial<IArticle>>> => (await validateArticle(values)) ?? simulatedResult(message, values),
    simulatePageMutation: async (
        values: Partial<IPage>
    ): Promise<IActionResult<Partial<IPage>>> => (await validatePage(values)) ?? simulatedResult('Page enregistrée.', values),
}
