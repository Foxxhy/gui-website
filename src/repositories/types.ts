import type { AnalyticsPeriod, IUserRepository } from '@/types'
import type {
    IAnalyticsEvent,
    IAnalyticsStats,
    IArticle,
    IContactField,
    IContactFormConfiguration,
    IContactSubmission,
    IFeatureFlags,
    IPage,
    ITag,
} from '@/types'

export interface IArticleRepository {
    findAll(): Promise<IArticle[]>
    findById(id: string): Promise<IArticle | undefined>
    findPublishedBySlug(slug: string): Promise<IArticle | undefined>
    create(article: IArticle): Promise<IArticle>
    update(id: string, values: Partial<IArticle>): Promise<IArticle | undefined>
}

export interface IPageRepository {
    findAll(): Promise<IPage[]>
    findById(id: string): Promise<IPage | undefined>
    findBySlug(slug: string): Promise<IPage | undefined>
    update(id: string, values: Partial<IPage>): Promise<IPage | undefined>
}

export interface ITagRepository {
    findAll(): Promise<ITag[]>
    findById(id: string): Promise<ITag | undefined>
    create(tag: ITag): Promise<ITag>
    update(id: string, values: Partial<ITag>): Promise<ITag | undefined>
    delete(id: string): Promise<boolean>
    removeTagFromArticles(tagId: string): Promise<void>
}

export interface ISettingsRepository {
    getFeatureFlags(): Promise<IFeatureFlags>
    updateFeatureFlag(key: keyof IFeatureFlags, enabled: boolean): Promise<IFeatureFlags>
    getContactFormConfiguration(): Promise<IContactFormConfiguration>
    updateContactFormConfiguration(values: Partial<IContactFormConfiguration>): Promise<IContactFormConfiguration>
    createContactField(field: Omit<IContactField, 'id' | 'order'>): Promise<IContactFormConfiguration>
    updateContactField(id: string, values: Partial<IContactField>): Promise<IContactFormConfiguration | undefined>
    deleteContactField(id: string): Promise<boolean>
    reorderContactField(id: string, direction: 'up' | 'down'): Promise<IContactFormConfiguration | undefined>
}

export interface IContactSubmissionRepository {
    create(submission: IContactSubmission): Promise<IContactSubmission>
}

export interface IAnalyticsRepository {
    track(event: IAnalyticsEvent): Promise<IAnalyticsEvent>
    findBetween(start: Date, end: Date): Promise<IAnalyticsEvent[]>
    getStats(period: AnalyticsPeriod): Promise<IAnalyticsStats>
}

export interface IRepositories {
    articles: IArticleRepository
    pages: IPageRepository
    users: IUserRepository
    tags: ITagRepository
    settings: ISettingsRepository
    contactSubmissions: IContactSubmissionRepository
    analytics: IAnalyticsRepository
}
