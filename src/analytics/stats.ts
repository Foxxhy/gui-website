import {
    ANALYTICS_EVENT_TYPES,
    type AnalyticsEventType,
    type AnalyticsPeriod,
    type IAnalyticsEvent,
    type IAnalyticsPeriodRange,
    type IAnalyticsStats,
} from '@/types'

const periodLabels: Record<AnalyticsPeriod, string> = {
    today: 'Aujourd’hui',
    '7days': '7 derniers jours',
    '30days': '30 derniers jours',
}

export const analyticsGetPeriodRange = (period: AnalyticsPeriod, now = new Date()): IAnalyticsPeriodRange => {
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

export const analyticsIsKnownEventType = (value: string): value is AnalyticsEventType =>
    ANALYTICS_EVENT_TYPES.includes(value as AnalyticsEventType)

export const analyticsFormatAnalyticsName = (name: string): AnalyticsEventType => {
    const formatted = name.trim().toLocaleLowerCase('fr-FR').replace(/[_\s]+/g, '-')
    if (!analyticsIsKnownEventType(formatted)) {
        throw new Error(`Type d’événement analytics inconnu : ${name}`)
    }
    return formatted
}

export const analyticsComputeStats = (
    events: IAnalyticsEvent[],
    period: AnalyticsPeriod,
    now = new Date()
): IAnalyticsStats => {
    const range = analyticsGetPeriodRange(period, now)
    const filteredEvents = events.filter(
        ({ timestamp }) => timestamp >= range.start && timestamp <= range.end
    )
    const countBy = (selector: (event: IAnalyticsEvent) => string) => {
        const counts = new Map<string, number>()
        for (const event of filteredEvents) {
            const key = selector(event)
            counts.set(key, (counts.get(key) ?? 0) + 1)
        }
        return [...counts.entries()].sort((first, second) => second[1] - first[1])
    }

    return {
        period: range,
        total: filteredEvents.length,
        pageViews: filteredEvents.filter(({ type }) => type === 'page-view').length,
        articleViews: filteredEvents.filter(({ type }) => type === 'article-view').length,
        contactSubmissions: filteredEvents.filter(({ type }) => type === 'contact-submission').length,
        pages: countBy(({ path }) => path).map(([path, count]) => ({ path, count })),
        articles: countBy(({ articleId }) => articleId ?? '')
            .filter(([articleId]) => articleId)
            .map(([articleId, count]) => ({ articleId, count })),
    }
}
