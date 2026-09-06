import 'server-only'

import { analyticsComputeStats } from '@/analytics/stats'
import type { AnalyticsPeriod } from '@/types'
import type { IAnalyticsRepository } from '@/repositories/types'

import { mongoCollections } from './collections'
import type { IAnalyticsEventDocument } from './documents'
import { getMongoDatabase } from './database'
import { mapAnalyticsEventDocument, mapAnalyticsEventToDocument } from './mappers'
import { sanitizeMongoError } from './sanitize-error'

export const mongoAnalyticsRepository: IAnalyticsRepository = {
    track: async (event) => {
        try {
            const database = await getMongoDatabase()
            const document = mapAnalyticsEventToDocument(event)
            await database.collection<IAnalyticsEventDocument>(mongoCollections.analyticsEvents).insertOne(document)
            return event
        } catch (error) {
            throw sanitizeMongoError(error)
        }
    },
    findBetween: async (start, end) => {
        try {
            const database = await getMongoDatabase()
            const documents = await database
                .collection<IAnalyticsEventDocument>(mongoCollections.analyticsEvents)
                .find({
                    timestamp: {
                        $gte: start,
                        $lte: end,
                    },
                })
                .toArray()
            return documents.map(mapAnalyticsEventDocument)
        } catch (error) {
            throw sanitizeMongoError(error)
        }
    },
    getStats: async (period: AnalyticsPeriod) => {
        try {
            const database = await getMongoDatabase()
            const documents = await database
                .collection<IAnalyticsEventDocument>(mongoCollections.analyticsEvents)
                .find()
                .toArray()
            const events = documents.map(mapAnalyticsEventDocument)
            return analyticsComputeStats(events, period)
        } catch (error) {
            throw sanitizeMongoError(error)
        }
    },
}
