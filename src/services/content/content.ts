import { articles, pages } from '@/mocks'
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

const validateArticle = (values: Partial<IArticle>): IActionResult<Partial<IArticle>> | undefined => {
    const slug = serviceNormalizeSlug(values.slug)
    const rawTitle = typeof values.title === 'string' ? values.title.trim() : ''
    const rawContent = typeof values.content === 'string' ? values.content.trim() : ''
    const errors = serviceFieldErrors(
        ['title', !rawTitle ? 'Le titre est obligatoire.' : rawTitle.length > serviceValidationLimits.title ? 'Le titre est trop long.' : undefined],
        ['slug', !serviceIsValidSlug(slug) ? 'Le slug est invalide.' : undefined],
        ['content', !rawContent ? 'Le contenu est obligatoire.' : rawContent.length > serviceValidationLimits.content ? 'Le contenu est trop long.' : undefined],
        ['status', values.status && !Object.values(IStatus).includes(values.status) ? 'Le statut est invalide.' : undefined],
    )
    if (articles.some((article) => article.slug === slug && article.id !== values.id)) errors.slug = 'Ce slug est déjà utilisé.'
    return Object.keys(errors).length ? { success: false, message: 'L’article contient des erreurs.', errors } : undefined
}

const validatePage = (values: Partial<IPage>): IActionResult<Partial<IPage>> | undefined => {
    const slug = serviceNormalizeSlug(values.slug)
    const rawTitle = typeof values.title === 'string' ? values.title.trim() : ''
    const rawContent = typeof values.content === 'string' ? values.content.trim() : ''
    const errors = serviceFieldErrors(
        ['title', !rawTitle ? 'Le titre est obligatoire.' : rawTitle.length > serviceValidationLimits.title ? 'Le titre est trop long.' : undefined],
        ['slug', !serviceIsValidSlug(slug) ? 'Le slug est invalide.' : undefined],
        ['content', !rawContent ? 'Le contenu est obligatoire.' : rawContent.length > serviceValidationLimits.content ? 'Le contenu est trop long.' : undefined],
    )
    if (pages.some((page) => page.slug === slug && page.id !== values.id)) errors.slug = 'Ce slug est déjà utilisé.'
    return Object.keys(errors).length ? { success: false, message: 'La page contient des erreurs.', errors } : undefined
}

export const serviceContent = {
    getPublishedArticles: async (): Promise<IArticle[]> =>
        articles.filter((article) => article.status === IStatus.PUBLISHED),
    getPublishedArticlesPage: async (
        query: IArticleQuery
    ): Promise<IArticlePagination> => {
        const search = query.search?.trim().toLocaleLowerCase('fr-FR')
        const tagSlugs = [...new Set(query.tagSlugs ?? [])]
        const limit = Number.isInteger(query.limit) && query.limit > 0 ? query.limit : 10

        let filteredArticles = articles.filter(
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
    getAllArticles: async (): Promise<IArticle[]> => articles,
    getPublishedArticleBySlug: async (slug: string): Promise<IArticle | undefined> =>
        articles.find(
            (article) =>
                article.slug === slug && article.status === IStatus.PUBLISHED
        ),
    getArticleById: async (id: string): Promise<IArticle | undefined> =>
        articles.find((article) => article.id === id),
    getPageBySlug: async (slug: string): Promise<IPage | undefined> =>
        pages.find((page) => page.slug === slug),
    getPages: async (): Promise<IPage[]> => pages,
    simulateArticleMutation: async (
        message: string,
        values: Partial<IArticle>
    ): Promise<IActionResult<Partial<IArticle>>> => validateArticle(values) ?? simulatedResult(message, values),
    simulatePageMutation: async (
        values: Partial<IPage>
    ): Promise<IActionResult<Partial<IPage>>> => validatePage(values) ?? simulatedResult('Page enregistrée.', values),
}