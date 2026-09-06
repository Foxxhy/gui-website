import 'server-only'

import { configDatabase } from '@/configs'
import type { IRepositories } from '@/repositories/types'

import { mockAnalyticsRepository } from './mock/analytics.mock'
import { mockArticleRepository } from './mock/articles.mock'
import { mockPageRepository } from './mock/pages.mock'
import { mockSettingsRepository } from './mock/settings.mock'
import { mockTagRepository } from './mock/tags.mock'
import { mockUserRepository } from './mock/users.mock'

const notImplemented = (name: string) => {
    throw new Error(
        `Le repository MongoDB « ${name} » n’est pas encore implémenté. Conserver DATA_SOURCE=mock pendant le développement.`
    )
}

const createMongoRepositories = (): IRepositories => ({
    articles: {
        findAll: async () => notImplemented('articles'),
        findById: async () => notImplemented('articles'),
        findPublishedBySlug: async () => notImplemented('articles'),
    },
    pages: {
        findAll: async () => notImplemented('pages'),
        findBySlug: async () => notImplemented('pages'),
    },
    users: {
        findAll: async () => notImplemented('users'),
        findById: async () => notImplemented('users'),
    },
    tags: {
        findAll: async () => notImplemented('tags'),
        findById: async () => notImplemented('tags'),
        create: async () => notImplemented('tags'),
        update: async () => notImplemented('tags'),
        delete: async () => notImplemented('tags'),
        removeTagFromArticles: async () => notImplemented('tags'),
    },
    settings: {
        getFeatureFlags: async () => notImplemented('settings'),
        updateFeatureFlag: async () => notImplemented('settings'),
        getContactFormConfiguration: async () => notImplemented('settings'),
    },
    analytics: {
        track: async () => notImplemented('analytics'),
        findBetween: async () => notImplemented('analytics'),
        getStats: async () => notImplemented('analytics'),
    },
})

const createMockRepositories = (): IRepositories => ({
    articles: mockArticleRepository,
    pages: mockPageRepository,
    users: mockUserRepository,
    tags: mockTagRepository,
    settings: mockSettingsRepository,
    analytics: mockAnalyticsRepository,
})

export const createRepositories = (dataSource: 'mock' | 'mongodb'): IRepositories =>
    dataSource === 'mongodb' ? createMongoRepositories() : createMockRepositories()

let cachedRepositories: IRepositories | undefined

export const getRepositories = (): IRepositories => {
    if (!cachedRepositories) {
        cachedRepositories = createRepositories(configDatabase.dataSource)
    }
    return cachedRepositories
}

export const resetRepositories = (): void => {
    cachedRepositories = undefined
}
