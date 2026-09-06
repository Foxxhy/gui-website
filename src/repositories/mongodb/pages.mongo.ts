import 'server-only'

import type { IPageRepository } from '@/repositories/types'

import { mongoCollections } from './collections'
import type { IPageDocument } from './documents'
import { getMongoDatabase } from './database'
import { mapPageDocumentToPage } from './mappers'
import { sanitizeMongoError } from './sanitize-error'

export const mongoPageRepository: IPageRepository = {
    findAll: async () => {
        try {
            const database = await getMongoDatabase()
            const documents = await database.collection<IPageDocument>(mongoCollections.pages).find().toArray()
            return documents.map(mapPageDocumentToPage)
        } catch (error) {
            throw sanitizeMongoError(error)
        }
    },
    findBySlug: async (slug) => {
        try {
            const database = await getMongoDatabase()
            const document = await database.collection<IPageDocument>(mongoCollections.pages).findOne({ slug })
            return document ? mapPageDocumentToPage(document) : undefined
        } catch (error) {
            throw sanitizeMongoError(error)
        }
    },
    update: async (id, values) => {
        try {
            const database = await getMongoDatabase()
            const { id: _ignoredId, ...rest } = values
            const result = await database.collection<IPageDocument>(mongoCollections.pages).findOneAndUpdate(
                { _id: id },
                { $set: rest },
                { returnDocument: 'after' },
            )
            return result ? mapPageDocumentToPage(result) : undefined
        } catch (error) {
            throw sanitizeMongoError(error)
        }
    },
}
