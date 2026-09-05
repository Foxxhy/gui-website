export const ANALYTICS_EVENT_TYPES = ['page-view', 'article-view', 'contact-submission'] as const

export type AnalyticsEventType = (typeof ANALYTICS_EVENT_TYPES)[number]
export type AnalyticsPeriod = 'today' | '7days' | '30days'

export interface IAnalyticsEvent {
    id: string
    type: AnalyticsEventType
    path: string
    articleId?: string
    timestamp: Date
}

export interface IAnalyticsPeriodRange {
    key: AnalyticsPeriod
    label: string
    start: Date
    end: Date
}

export interface IAnalyticsPageStat {
    path: string
    count: number
}

export interface IAnalyticsArticleStat {
    articleId: string
    count: number
}

export interface IAnalyticsStats {
    period: IAnalyticsPeriodRange
    total: number
    pageViews: number
    articleViews: number
    contactSubmissions: number
    pages: IAnalyticsPageStat[]
    articles: IAnalyticsArticleStat[]
}
