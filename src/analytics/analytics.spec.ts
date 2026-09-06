import { analyticsEvents } from '@/mocks'

import {
    serviceAnalytics,
    analyticsFormatAnalyticsName,
    analyticsGetStats,
    analyticsTrack,
} from './analytics'
import {
    analyticsComputeCategoryViews,
    analyticsComputeStats,
    analyticsGetPeriodRange,
    analyticsIsKnownEventType,
} from './stats'
import { ICategory } from '@/types'

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
    const initialLength = analyticsEvents.length

    afterEach(() => {
        analyticsEvents.length = initialLength
    })

    it('appends an event with a default path', async () => {
        const event = await analyticsTrack({ type: 'page-view', path: '' })
        expect(event.path).toBe('/')
        expect(event.type).toBe('page-view')
        expect(analyticsEvents).toContainEqual(event)
    })

    it('includes an article id when provided', async () => {
        const event = await analyticsTrack({
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

describe('analyticsComputeStats', () => {
    it('aggregates events for the requested period', () => {
        const stats = analyticsComputeStats(analyticsEvents, '30days')
        expect(stats.total).toBeGreaterThan(0)
        expect(stats.pageViews).toBeGreaterThan(0)
        expect(stats.pages.length).toBeGreaterThan(0)
        expect(stats.timeline).toHaveLength(6)
    })

    it('builds a 7-day timeline', () => {
        const stats = analyticsComputeStats(analyticsEvents, '7days')
        expect(stats.timeline).toHaveLength(7)
    })

    it('builds a today timeline with hourly buckets', () => {
        const stats = analyticsComputeStats(analyticsEvents, 'today')
        expect(stats.timeline).toHaveLength(6)
        expect(stats.timeline[0]?.label).toBe('00h')
    })
})

describe('analyticsComputeCategoryViews', () => {
    it('aggregates article views by category', () => {
        const views = analyticsComputeCategoryViews(
            [
                { articleId: 'article-1', count: 3 },
                { articleId: 'article-2', count: 2 },
                { articleId: 'article-1', count: 1 },
            ],
            [
                { id: 'article-1', category: ICategory.ACTUALITES },
                { id: 'article-2', category: ICategory.EVENEMENTS },
            ]
        )

        expect(views).toEqual([
            { category: ICategory.ACTUALITES, count: 4 },
            { category: ICategory.EVENEMENTS, count: 2 },
        ])
    })

    it('ignores articles without category', () => {
        const views = analyticsComputeCategoryViews(
            [{ articleId: 'orphan', count: 5 }],
            [{ id: 'orphan' }]
        )
        expect(views).toEqual([])
    })
})

describe('analyticsGetStats', () => {
    it('aggregates events through the repository', async () => {
        await expect(analyticsGetStats('30days')).resolves.toMatchObject({
            total: expect.any(Number),
        })
    })
})

describe('serviceAnalytics', () => {
    const initialLength = analyticsEvents.length

    afterEach(() => {
        analyticsEvents.length = initialLength
    })

    it('tracks events through the service facade', async () => {
        const event = await serviceAnalytics.trackEvent('page-view', '/association')
        expect(event.path).toBe('/association')
        expect(analyticsEvents.at(-1)).toEqual(event)
    })

    it('returns stats asynchronously', async () => {
        await expect(serviceAnalytics.getStats('7days')).resolves.toMatchObject({
            period: { key: '7days' },
        })
    })
})
