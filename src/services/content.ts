import { articles, pages } from '@/mocks'
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

export const contentService = {
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
    ): Promise<IActionResult<Partial<IArticle>>> => simulatedResult(message, values),
    simulatePageMutation: async (
        values: Partial<IPage>
    ): Promise<IActionResult<Partial<IPage>>> =>
        simulatedResult('Page enregistrée.', values),
}