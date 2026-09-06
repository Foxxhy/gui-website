import { repositoryContent } from '@/repositories'
import type {
    IActionResult,
    IArticle,
    IArticlePagination,
    IArticleQuery,
    IPage,
    IUser,
} from '@/types'

export const serviceContent = {
    getPublishedArticles: async (): Promise<IArticle[]> =>
        repositoryContent.findPublishedArticles(),
    getPublishedArticlesPage: async (query: IArticleQuery): Promise<IArticlePagination> =>
        repositoryContent.findPublishedArticlesPage(query),
    getAllArticles: async (): Promise<IArticle[]> => repositoryContent.findAllArticles(),
    getPublishedArticleBySlug: async (slug: string): Promise<IArticle | undefined> =>
        repositoryContent.findPublishedArticleBySlug(slug),
    getArticleById: async (id: string): Promise<IArticle | undefined> =>
        repositoryContent.findArticleById(id),
    getPageBySlug: async (slug: string): Promise<IPage | undefined> =>
        repositoryContent.findPageBySlug(slug),
    getPages: async (): Promise<IPage[]> => repositoryContent.findAllPages(),
    createArticle: async (
        values: Partial<IArticle>,
        author: IUser
    ): Promise<IActionResult<IArticle>> => repositoryContent.createArticle(values, author),
    updateArticle: async (
        id: string,
        values: Partial<IArticle>,
        author?: IUser
    ): Promise<IActionResult<IArticle>> => repositoryContent.updateArticle(id, values, author),
    updatePage: async (id: string, values: Partial<IPage>): Promise<IActionResult<IPage>> =>
        repositoryContent.updatePage(id, values),
}
