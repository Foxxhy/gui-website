import { analyticsEvents } from '@/mocks'
import { analyticsComputeStats } from '@/analytics/stats'
import type { AnalyticsPeriod } from '@/types'
import type { IAnalyticsRepository } from '@/repositories/types'

export const mockAnalyticsRepository: IAnalyticsRepository = {
    track: async (event) => {
        analyticsEvents.push(event)
        return event
    },
    findBetween: async (start, end) =>
        analyticsEvents.filter(
            ({ timestamp }) => timestamp >= start && timestamp <= end
        ),
    getStats: async (period: AnalyticsPeriod) => analyticsComputeStats(analyticsEvents, period),
}
