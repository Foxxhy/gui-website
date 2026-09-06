import {
    analyticsGetPeriodRange,
    analyticsFormatAnalyticsName,
    analyticsIsKnownEventType,
} from '@/analytics/utils'
import { mockStore } from '@/repositories/mock-store'
import type { IAnalyticsRepository } from './analytics'
import type { IAnalyticsEvent, AnalyticsPeriod, IAnalyticsStats } from '@/types'

export const mockAnalyticsRepository: IAnalyticsRepository = {
    track: ({ type, path, articleId }) => {
        const event: IAnalyticsEvent = {
            id: `event-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            type: analyticsFormatAnalyticsName(type),
            path: path || '/',
            ...(articleId ? { articleId } : {}),
            timestamp: new Date(),
        }
        mockStore.getSnapshot().analyticsEvents.push(event)
        return event
    },
    getStats: (period: AnalyticsPeriod): IAnalyticsStats => {
        const range = analyticsGetPeriodRange(period)
        const events = mockStore.getSnapshot().analyticsEvents.filter(
            ({ timestamp }) => timestamp >= range.start && timestamp <= range.end
        )
        const countBy = (selector: (event: IAnalyticsEvent) => string) => {
            const counts = new Map<string, number>()
            for (const event of events) {
                const key = selector(event)
                counts.set(key, (counts.get(key) ?? 0) + 1)
            }
            return [...counts.entries()].sort((first, second) => second[1] - first[1])
        }

        return {
            period: range,
            total: events.length,
            pageViews: events.filter(({ type }) => type === 'page-view').length,
            articleViews: events.filter(({ type }) => type === 'article-view').length,
            contactSubmissions: events.filter(({ type }) => type === 'contact-submission').length,
            pages: countBy(({ path }) => path).map(([path, count]) => ({ path, count })),
            articles: countBy(({ articleId }) => articleId ?? '')
                .filter(([articleId]) => articleId)
                .map(([articleId, count]) => ({ articleId, count })),
        }
    },
}

export { analyticsIsKnownEventType, analyticsFormatAnalyticsName, analyticsGetPeriodRange }
