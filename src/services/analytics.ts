import { getStats, isKnownEventType, trackEvent } from '@/analytics'
import type { AnalyticsEventType, AnalyticsPeriod, IAnalyticsEvent, IAnalyticsStats } from '@/types'

export const formatAnalyticsEventName = (name: string): AnalyticsEventType => {
    const formatted = name.trim().toLocaleLowerCase('fr-FR').replace(/[_\s]+/g, '-')
    if (!isKnownEventType(formatted)) {
        throw new Error(`Type d’événement analytics inconnu : ${name}`)
    }
    return formatted
}

export const analyticsService = {
    trackEvent: (type: string, path: string, articleId?: string): IAnalyticsEvent =>
        trackEvent({ type: formatAnalyticsEventName(type), path, articleId }),
    getStats: async (period: AnalyticsPeriod): Promise<IAnalyticsStats> => getStats(period),
}
