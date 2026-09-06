import type { IActionResult, IArticle, IArticlePagination, IArticleQuery, IPage, IUser } from '@/types'

export interface IContentRepository {
    findPublishedArticles(): IArticle[]
    findPublishedArticlesPage(query: IArticleQuery): IArticlePagination
    findAllArticles(): IArticle[]
    findPublishedArticleBySlug(slug: string): IArticle | undefined
    findArticleById(id: string): IArticle | undefined
    createArticle(values: Partial<IArticle>, author: IUser): IActionResult<IArticle>
    updateArticle(id: string, values: Partial<IArticle>, author?: IUser): IActionResult<IArticle>
    findPageBySlug(slug: string): IPage | undefined
    findAllPages(): IPage[]
    updatePage(id: string, values: Partial<IPage>): IActionResult<IPage>
}
