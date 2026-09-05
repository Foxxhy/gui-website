import { analyticsEvents } from '@/mocks'
import { ANALYTICS_EVENT_TYPES, type AnalyticsEventType, type AnalyticsPeriod, type IAnalyticsEvent, type IAnalyticsPeriodRange, type IAnalyticsStats } from '@/types'

const periodLabels: Record<AnalyticsPeriod, string> = {
    today: 'Aujourd’hui',
    '7days': '7 derniers jours',
    '30days': '30 derniers jours',
}

const getPeriodRange = (period: AnalyticsPeriod, now = new Date()): IAnalyticsPeriodRange => {
    const end = new Date(now)
    const start = new Date(now)
    if (period === 'today') {
        start.setHours(0, 0, 0, 0)
    } else {
        start.setDate(start.getDate() - (period === '7days' ? 6 : 29))
        start.setHours(0, 0, 0, 0)
    }
    return { key: period, label: periodLabels[period], start, end }
}

const isKnownEventType = (value: string): value is AnalyticsEventType =>
    ANALYTICS_EVENT_TYPES.includes(value as AnalyticsEventType)

export const trackEvent = ({
    type,
    path,
    articleId,
}: Pick<IAnalyticsEvent, 'type' | 'path' | 'articleId'>): IAnalyticsEvent => {
    const event: IAnalyticsEvent = {
        id: `event-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        type,
        path: path || '/',
        ...(articleId ? { articleId } : {}),
        timestamp: new Date(),
    }
    analyticsEvents.push(event)
    return event
}

export const getStats = (period: AnalyticsPeriod): IAnalyticsStats => {
    const range = getPeriodRange(period)
    const events = analyticsEvents.filter(({ timestamp }) => timestamp >= range.start && timestamp <= range.end)
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
        articles: countBy(({ articleId }) => articleId ?? '').filter(([articleId]) => articleId).map(([articleId, count]) => ({ articleId, count })),
    }
}

export { getPeriodRange, isKnownEventType }
