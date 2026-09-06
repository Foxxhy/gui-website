import { pages } from '@/mocks'
import type { IPageRepository } from '@/repositories/types'

export const mockPageRepository: IPageRepository = {
    findAll: async () => pages,
    findById: async (id) => pages.find((page) => page.id === id),
    findBySlug: async (slug) => pages.find((page) => page.slug === slug),
    update: async (id, values) => {
        const page = pages.find((candidate) => candidate.id === id)
        if (!page) return undefined
        Object.assign(page, values, { updatedAt: new Date().toISOString() })
        return page
    },
}
