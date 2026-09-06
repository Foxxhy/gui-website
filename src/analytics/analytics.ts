import type { AnalyticsPeriod, IAnalyticsEvent } from '@/types'

import { analyticsFormatAnalyticsName } from './stats'
import { getRepositories } from '@/repositories'

export {
    analyticsFormatAnalyticsName,
    analyticsGetPeriodRange,
    analyticsIsKnownEventType,
} from './stats'

export const analyticsTrack = async ({
    type,
    path,
    articleId,
}: Pick<IAnalyticsEvent, 'type' | 'path' | 'articleId'>): Promise<IAnalyticsEvent> => {
    const event: IAnalyticsEvent = {
        id: `event-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        type,
        path: path || '/',
        ...(articleId ? { articleId } : {}),
        timestamp: new Date(),
    }
    return getRepositories().analytics.track(event)
}

export const analyticsGetStats = async (period: AnalyticsPeriod) =>
    getRepositories().analytics.getStats(period)

export const serviceAnalytics = {
    trackEvent: async (type: string, path: string, articleId?: string): Promise<IAnalyticsEvent> =>
        analyticsTrack({
            type: analyticsFormatAnalyticsName(type),
            path,
            articleId,
        }),
    getStats: async (period: AnalyticsPeriod) => getRepositories().analytics.getStats(period),
}
