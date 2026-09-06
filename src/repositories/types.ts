import type { AnalyticsPeriod } from '@/types'
import type {
    IAnalyticsEvent,
    IAnalyticsStats,
    IArticle,
    IContactFormConfiguration,
    IFeatureFlags,
    IPage,
    ITag,
    IUser,
} from '@/types'

export interface IArticleRepository {
    findAll(): Promise<IArticle[]>
    findById(id: string): Promise<IArticle | undefined>
    findPublishedBySlug(slug: string): Promise<IArticle | undefined>
}

export interface IPageRepository {
    findAll(): Promise<IPage[]>
    findBySlug(slug: string): Promise<IPage | undefined>
}

export interface IUserRepository {
    findAll(): Promise<IUser[]>
    findById(id: string): Promise<IUser | undefined>
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
    analytics: IAnalyticsRepository
}
