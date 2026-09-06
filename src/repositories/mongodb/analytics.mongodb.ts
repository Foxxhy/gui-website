import 'server-only'

import type { Db } from 'mongodb'

import { analyticsComputeStats } from '@/analytics/stats'
import type { AnalyticsPeriod, IAnalyticsEvent } from '@/types'
import type { IAnalyticsRepository } from '@/repositories/types'

import { mongoCollections } from './collections'
import { getMongoDatabase } from './database'

interface IAnalyticsEventDocument {
    _id: string
    type: IAnalyticsEvent['type']
    path: string
    articleId?: string
    timestamp: Date
}

let indexesEnsured = false

const ensureAnalyticsIndexes = async (db: Db): Promise<void> => {
    if (indexesEnsured) return
    await db.collection(mongoCollections.analyticsEvents).createIndex({ timestamp: -1 })
    indexesEnsured = true
}

const eventFromDocument = (document: IAnalyticsEventDocument): IAnalyticsEvent => ({
    id: document._id,
    type: document.type,
    path: document.path,
    articleId: document.articleId,
    timestamp: document.timestamp.toISOString(),
})

export const mongoAnalyticsRepository: IAnalyticsRepository = {
    track: async (event) => {
        const db = await getMongoDatabase()
        await ensureAnalyticsIndexes(db)
        const document: IAnalyticsEventDocument = {
            _id: event.id,
            type: event.type,
            path: event.path,
            articleId: event.articleId,
            timestamp: new Date(event.timestamp),
        }
        await db.collection<IAnalyticsEventDocument>(mongoCollections.analyticsEvents).insertOne(document)
        return event
    },
    findBetween: async (start, end) => {
        const db = await getMongoDatabase()
        await ensureAnalyticsIndexes(db)
        const documents = await db.collection<IAnalyticsEventDocument>(mongoCollections.analyticsEvents)
            .find({ timestamp: { $gte: start, $lte: end } })
            .toArray()
        return documents.map(eventFromDocument)
    },
    getStats: async (period: AnalyticsPeriod) => {
        const db = await getMongoDatabase()
        await ensureAnalyticsIndexes(db)
        const documents = await db.collection<IAnalyticsEventDocument>(mongoCollections.analyticsEvents).find().toArray()
        return analyticsComputeStats(documents.map(eventFromDocument), period)
    },
}
