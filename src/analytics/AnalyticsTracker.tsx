'use client'

import { useEffect, useRef } from 'react'
import { actionTrackAnalytics } from '@/actions'
import type { AnalyticsEventType } from '@/types'

const getClientKey = () => {
    if (typeof window === 'undefined') return 'server'
    const storageKey = 'association_poc_analytics_client'
    const existing = window.localStorage.getItem(storageKey)
    if (existing) return existing
    const generated = `client-${Math.random().toString(36).slice(2, 10)}`
    window.localStorage.setItem(storageKey, generated)
    return generated
}

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
        void actionTrackAnalytics({ type, path, articleId, clientKey: getClientKey() })
    }, [articleId, path, type])

    return null
}
