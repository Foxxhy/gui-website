import { pages } from '@/mocks'
import type { IPageRepository } from '@/repositories/types'

export const mockPageRepository: IPageRepository = {
    findAll: async () => pages,
    findBySlug: async (slug) => pages.find((page) => page.slug === slug),
}
