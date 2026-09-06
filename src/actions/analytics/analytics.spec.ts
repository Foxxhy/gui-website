import { serviceAnalytics } from '@/services'
import type { AnalyticsEventType } from '@/types'

import { actionTrackAnalytics } from './analytics'

describe('actionTrackAnalytics', () => {
afterEach(() => {
jest.restoreAllMocks()
})

it('tracks an analytics event with its type and path', async () => {
    const trackEvent = jest.spyOn(serviceAnalytics, 'trackEvent')

    await actionTrackAnalytics({
        type: 'PAGE_VIEW' as AnalyticsEventType,
        path: '/articles',
    })

    expect(trackEvent).toHaveBeenCalledWith(
        'PAGE_VIEW',
        '/articles',
        undefined
    )
})

it('tracks an analytics event with an article id', async () => {
    const trackEvent = jest.spyOn(serviceAnalytics, 'trackEvent')

    await actionTrackAnalytics({
        type: 'ARTICLE_VIEW' as AnalyticsEventType,
        path: '/articles/test-article',
        articleId: 'article-1',
    })

    expect(trackEvent).toHaveBeenCalledWith(
        'ARTICLE_VIEW',
        '/articles/test-article',
        'article-1'
    )
})
})
