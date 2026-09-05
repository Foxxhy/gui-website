'use client'

import { useEffect, useRef } from 'react'
import { trackAnalyticsEvent } from '@/actions'
import type { AnalyticsEventType } from '@/types'

export const AnalyticsTracker = ({
    type = 'page-view',
    path,
    articleId,
}: {
    type?: AnalyticsEventType
    path: string
    articleId?: string
}) => {
    const tracked = useRef(false)

    useEffect(() => {
        if (tracked.current) return
        tracked.current = true
        void trackAnalyticsEvent({ type, path, articleId })
    }, [articleId, path, type])

    return null
}
