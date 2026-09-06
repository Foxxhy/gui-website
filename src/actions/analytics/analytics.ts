'use server'

import { serviceAnalytics, serviceRateLimit } from '@/services'
import type { AnalyticsEventType } from '@/types'

const ANALYTICS_RATE_LIMIT = { limit: 120, windowMs: 60 * 1000 }

export const actionTrackAnalytics = async ({
    type,
    path,
    articleId,
    clientKey,
}: {
    type: AnalyticsEventType
    path: string
    articleId?: string
    clientKey?: string
}) => {
    const key = `analytics:${clientKey ?? path}`
    if (!serviceRateLimit.check(key, ANALYTICS_RATE_LIMIT.limit, ANALYTICS_RATE_LIMIT.windowMs)) {
        return
    }

    await serviceAnalytics.trackEvent(type, path, articleId)
}
