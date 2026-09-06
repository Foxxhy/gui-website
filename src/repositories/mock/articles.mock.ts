import { articles } from '@/mocks'
import { IStatus } from '@/types'
import type { IArticleRepository } from '@/repositories/types'

export const mockArticleRepository: IArticleRepository = {
    findAll: async () => articles,
    findById: async (id) => articles.find((article) => article.id === id),
    findPublishedBySlug: async (slug) =>
        articles.find(
            (article) => article.slug === slug && article.status === IStatus.PUBLISHED
        ),
    create: async (article) => {
        articles.push(article)
        return article
    },
    update: async (id, values) => {
        const article = articles.find((candidate) => candidate.id === id)
        if (!article) return undefined
        Object.assign(article, values)
        return article
    },
}
