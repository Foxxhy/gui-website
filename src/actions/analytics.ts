'use server'

import { analyticsService } from '@/services'
import type { AnalyticsEventType } from '@/types'

export const trackAnalyticsEvent = async ({
    type,
    path,
    articleId,
}: {
    type: AnalyticsEventType
    path: string
    articleId?: string
}) => {
    analyticsService.trackEvent(type, path, articleId)
}
