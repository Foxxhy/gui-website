import { serviceAnalytics, analyticsFormatAnalyticsName } from '@/analytics/analytics'

import * as analyticsBridge from './analytics'

describe('services/analytics bridge', () => {
    it('re-exports the canonical serviceAnalytics', () => {
        expect(analyticsBridge.serviceAnalytics).toBe(serviceAnalytics)
    })

    it('re-exports analyticsFormatAnalyticsName', () => {
        expect(analyticsBridge.analyticsFormatAnalyticsName).toBe(analyticsFormatAnalyticsName)
        expect(analyticsFormatAnalyticsName('CONTACT_SUBMISSION')).toBe('contact-submission')
    })
})
