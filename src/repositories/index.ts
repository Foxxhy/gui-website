import { mockAnalyticsRepository } from './analytics/mock'
import { mockAuthRepository } from './auth/mock'
import { mockContactRepository } from './contact/mock'
import { mockContentRepository } from './content/mock'
import { mockFeatureRepository } from './features/mock'
import { mockTagRepository } from './tags/mock'
import { mockUserRepository } from './users/mock'

export const repositoryAnalytics = mockAnalyticsRepository
export const repositoryAuth = mockAuthRepository
export const repositoryContact = mockContactRepository
export const repositoryContent = mockContentRepository
export const repositoryFeature = mockFeatureRepository
export const repositoryTag = mockTagRepository
export const repositoryUser = mockUserRepository

export * from './analytics'
export * from './auth'
export * from './contact'
export * from './content'
export * from './features'
export * from './mock-store'
export * from './tags'
export * from './users'
