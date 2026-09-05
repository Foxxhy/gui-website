import { articles, pages } from '@/mocks'
import { IStatus, type IActionResult, type IArticle, type IPage } from '@/types'

const simulatedResult = <T>(message: string, data?: T): IActionResult<T> => ({
    success: true,
    message: `${message} La simulation ne conserve pas cette modification.`,
    data,
})

export const contentService = {
    getPublishedArticles: async (): Promise<IArticle[]> =>
        articles.filter((article) => article.status === IStatus.PUBLISHED),
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