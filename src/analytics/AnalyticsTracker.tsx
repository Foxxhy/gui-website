'use client'

import { useEffect, useRef } from 'react'
import { actionTrackAnalytics } from '@/actions'
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
        void actionTrackAnalytics({ type, path, articleId })
    }, [articleId, path, type])

    return null
}
