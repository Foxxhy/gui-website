import 'server-only'

import type { IRepositories } from '@/repositories/types'

import { mongoAnalyticsRepository } from './analytics.mongo'
import { mongoArticleRepository } from './articles.mongo'
import { mongoContactSubmissionRepository } from './contact-submissions.mongo'
import { mongoPageRepository } from './pages.mongo'
import { mongoSettingsRepository } from './settings.mongo'
import { mongoTagRepository } from './tags.mongo'
import { mongoUserRepository } from './users.mongo'

export const createMongoRepositories = (): IRepositories => ({
    articles: mongoArticleRepository,
    pages: mongoPageRepository,
    users: mongoUserRepository,
    tags: mongoTagRepository,
    settings: mongoSettingsRepository,
    contactSubmissions: mongoContactSubmissionRepository,
    analytics: mongoAnalyticsRepository,
})
