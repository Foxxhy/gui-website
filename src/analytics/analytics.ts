import { repositoryAnalytics } from '@/repositories'
import type { AnalyticsPeriod, IAnalyticsEvent, IAnalyticsStats } from '@/types'

import { analyticsFormatAnalyticsName } from './utils'

export {
    analyticsFormatAnalyticsName,
    analyticsGetPeriodRange,
    analyticsIsKnownEventType,
} from './utils'

export const analyticsTrack = ({
    type,
    path,
    articleId,
}: Pick<IAnalyticsEvent, 'type' | 'path' | 'articleId'>): IAnalyticsEvent =>
    repositoryAnalytics.track({ type, path, articleId })

export const analyticsGetStats = (period: AnalyticsPeriod): IAnalyticsStats =>
    repositoryAnalytics.getStats(period)

export const serviceAnalytics = {
    trackEvent: (type: string, path: string, articleId?: string): IAnalyticsEvent =>
        repositoryAnalytics.track({
            type: analyticsFormatAnalyticsName(type),
            path,
            articleId,
        }),
    getStats: async (period: AnalyticsPeriod): Promise<IAnalyticsStats> =>
        repositoryAnalytics.getStats(period),
}
