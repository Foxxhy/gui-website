import { mockStore } from '@/repositories/mock-store'

import {
    serviceAnalytics,
    analyticsFormatAnalyticsName,
    analyticsGetPeriodRange,
    analyticsGetStats,
    analyticsIsKnownEventType,
    analyticsTrack,
} from './analytics'

describe('analyticsIsKnownEventType', () => {
    it('accepts known event types', () => {
        expect(analyticsIsKnownEventType('page-view')).toBe(true)
        expect(analyticsIsKnownEventType('article-view')).toBe(true)
        expect(analyticsIsKnownEventType('contact-submission')).toBe(true)
    })

    it('rejects unknown event types', () => {
        expect(analyticsIsKnownEventType('unknown')).toBe(false)
    })
})

describe('analyticsFormatAnalyticsName', () => {
    it('normalizes names to known event types', () => {
        expect(analyticsFormatAnalyticsName('PAGE_VIEW')).toBe('page-view')
        expect(analyticsFormatAnalyticsName(' Article View ')).toBe('article-view')
    })

    it('throws for unknown event types', () => {
        expect(() => analyticsFormatAnalyticsName('click')).toThrow(
            'Type d’événement analytics inconnu : click'
        )
    })
})

describe('analyticsTrack', () => {
    beforeEach(() => {
        mockStore.reset()
    })

    it('appends an event with a default path', () => {
        const initialLength = mockStore.getSnapshot().analyticsEvents.length
        const event = analyticsTrack({ type: 'page-view', path: '' })
        expect(event.path).toBe('/')
        expect(event.type).toBe('page-view')
        expect(mockStore.getSnapshot().analyticsEvents).toHaveLength(initialLength + 1)
    })

    it('includes an article id when provided', () => {
        const event = analyticsTrack({
            type: 'article-view',
            path: '/articles/demo',
            articleId: 'article-1',
        })
        expect(event.articleId).toBe('article-1')
    })
})

describe('analyticsGetPeriodRange', () => {
    it('builds a today range starting at midnight', () => {
        const now = new Date('2026-09-06T15:30:00')
        const range = analyticsGetPeriodRange('today', now)
        expect(range.key).toBe('today')
        expect(range.start.getHours()).toBe(0)
        expect(range.start.getMinutes()).toBe(0)
        expect(range.end).toEqual(now)
    })
})

describe('analyticsGetStats', () => {
    beforeEach(() => {
        mockStore.reset()
    })

    it('aggregates events for the requested period', () => {
        const stats = analyticsGetStats('30days')
        expect(stats.total).toBeGreaterThan(0)
        expect(stats.pageViews).toBeGreaterThan(0)
        expect(stats.pages.length).toBeGreaterThan(0)
    })
})

describe('serviceAnalytics', () => {
    beforeEach(() => {
        mockStore.reset()
    })

    it('tracks events through the service facade', () => {
        const event = serviceAnalytics.trackEvent('page-view', '/association')
        expect(event.path).toBe('/association')
        expect(mockStore.getSnapshot().analyticsEvents.at(-1)).toEqual(event)
    })

    it('returns stats asynchronously', async () => {
        await expect(serviceAnalytics.getStats('7days')).resolves.toMatchObject({
            period: { key: '7days' },
        })
    })
})
