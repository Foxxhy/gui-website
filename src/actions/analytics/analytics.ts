'use server'

import { serviceAnalytics } from '@/services'
import type { AnalyticsEventType } from '@/types'

export const actionTrackAnalytics = async ({
    type,
    path,
    articleId,
}: {
    type: AnalyticsEventType
    path: string
    articleId?: string
}) => {
    serviceAnalytics.trackEvent(type, path, articleId)
}
