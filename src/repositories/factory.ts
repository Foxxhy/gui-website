import 'server-only'

import { configDatabase } from '@/configs'
import type { IRepositories } from '@/repositories/types'

import { createMongoRepositories } from './mongodb'
import { mockAnalyticsRepository } from './mock/analytics.mock'
import { mockArticleRepository } from './mock/articles.mock'
import { mockContactSubmissionRepository } from './mock/contact-submissions.mock'
import { mockPageRepository } from './mock/pages.mock'
import { mockSettingsRepository } from './mock/settings.mock'
import { mockTagRepository } from './mock/tags.mock'
import { repositoryUserMock } from './mock/users.mock'

const createMockRepositories = (): IRepositories => ({
    articles: mockArticleRepository,
    pages: mockPageRepository,
    users: repositoryUserMock,
    tags: mockTagRepository,
    settings: mockSettingsRepository,
    contactSubmissions: mockContactSubmissionRepository,
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
