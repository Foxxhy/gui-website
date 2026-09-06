import type { IAnalyticsEvent, AnalyticsPeriod, IAnalyticsStats } from '@/types'

export interface IAnalyticsRepository {
    track(event: Pick<IAnalyticsEvent, 'type' | 'path' | 'articleId'>): IAnalyticsEvent
    getStats(period: AnalyticsPeriod): IAnalyticsStats
}
