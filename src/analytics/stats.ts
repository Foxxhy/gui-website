import {
    ANALYTICS_EVENT_TYPES,
    type AnalyticsEventType,
    type AnalyticsPeriod,
    type IAnalyticsEvent,
    type IAnalyticsPeriodRange,
    type IAnalyticsStats,
    type IAnalyticsTimelinePoint,
    type IArticle,
    type ICategory,
} from '@/types'

export interface IAnalyticsCategoryView {
    category: ICategory
    count: number
}

const periodLabels: Record<AnalyticsPeriod, string> = {
    today: 'Aujourd’hui',
    '7days': '7 derniers jours',
    '30days': '30 derniers jours',
}

const dayLabels = ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.']

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

const toEventDate = (timestamp: string) => new Date(timestamp)

const countEventsInRange = (events: IAnalyticsEvent[], start: Date, end: Date) =>
    events.filter(({ timestamp }) => {
        const date = toEventDate(timestamp)
        return date >= start && date < end
    }).length

export const analyticsComputeTimeline = (
    events: IAnalyticsEvent[],
    period: AnalyticsPeriod,
    now = new Date()
): IAnalyticsTimelinePoint[] => {
    if (period === 'today') {
        const dayStart = new Date(now)
        dayStart.setHours(0, 0, 0, 0)

        return Array.from({ length: 6 }, (_, index) => {
            const start = new Date(dayStart)
            start.setHours(index * 4)
            const end = new Date(dayStart)
            end.setHours((index + 1) * 4)
            return {
                label: `${String(index * 4).padStart(2, '0')}h`,
                count: countEventsInRange(events, start, end),
            }
        })
    }

    if (period === '7days') {
        return Array.from({ length: 7 }, (_, index) => {
            const start = new Date(now)
            start.setDate(start.getDate() - (6 - index))
            start.setHours(0, 0, 0, 0)
            const end = new Date(start)
            end.setDate(end.getDate() + 1)
            return {
                label: dayLabels[start.getDay()],
                count: countEventsInRange(events, start, end),
            }
        })
    }

    return Array.from({ length: 6 }, (_, index) => {
        const end = new Date(now)
        end.setHours(0, 0, 0, 0)
        end.setDate(end.getDate() - (5 - index) * 7 + 1)
        const start = new Date(end)
        start.setDate(start.getDate() - 7)
        return {
            label: `S${index + 1}`,
            count: countEventsInRange(events, start, end),
        }
    })
}

export const analyticsComputeCategoryViews = (
    articleStats: { articleId: string; count: number }[],
    articles: Pick<IArticle, 'id' | 'category'>[]
): IAnalyticsCategoryView[] => {
    const categoryByArticleId = new Map(
        articles
            .filter((article) => article.category)
            .map((article) => [article.id, article.category as ICategory])
    )
    const counts = new Map<ICategory, number>()

    for (const { articleId, count } of articleStats) {
        const category = categoryByArticleId.get(articleId)
        if (!category) continue
        counts.set(category, (counts.get(category) ?? 0) + count)
    }

    return [...counts.entries()]
        .map(([category, count]) => ({ category, count }))
        .sort((first, second) => second.count - first.count)
}

export const analyticsComputeStats = (
    events: IAnalyticsEvent[],
    period: AnalyticsPeriod,
    now = new Date()
): IAnalyticsStats => {
    const range = analyticsGetPeriodRange(period, now)
    const filteredEvents = events.filter(({ timestamp }) => {
        const date = toEventDate(timestamp)
        return date >= range.start && date <= range.end
    })
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
        timeline: analyticsComputeTimeline(filteredEvents, period, now),
    }
}
