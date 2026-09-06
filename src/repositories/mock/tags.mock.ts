import { articles, tags } from '@/mocks'
import type { ITagRepository } from '@/repositories/types'

export const mockTagRepository: ITagRepository = {
    findAll: async () => tags,
    findById: async (id) => tags.find((tag) => tag.id === id),
    create: async (tag) => {
        tags.push(tag)
        return tag
    },
    update: async (id, values) => {
        const tag = tags.find((candidate) => candidate.id === id)
        if (!tag) return undefined
        Object.assign(tag, values)
        return tag
    },
    delete: async (id) => {
        const index = tags.findIndex((tag) => tag.id === id)
        if (index < 0) return false
        tags.splice(index, 1)
        return true
    },
    removeTagFromArticles: async (tagId) => {
        for (const article of articles) {
            article.tags = article.tags?.filter((tag) => tag.id !== tagId)
        }
    },
}
