import { articles, tags } from '@/mocks'
import type { ITagRepository } from '@/repositories/types'
import type { ITag } from '@/types'

const propagateTagUpdate = (updatedTag: ITag) => {
    for (const article of articles) {
        if (!article.tags) continue
        article.tags = article.tags.map((tag) => (tag.id === updatedTag.id ? { ...updatedTag } : tag))
    }
}

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
        propagateTagUpdate(tag)
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
