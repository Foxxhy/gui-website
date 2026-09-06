import 'server-only'

import type { ITagRepository } from '@/repositories/types'

import { mongoCollections } from './collections'
import type { IArticleDocument, ITagDocument } from './documents'
import { getMongoDatabase } from './database'
import { mapTagDocumentToTag, mapTagToTagDocument } from './mappers'
import { sanitizeMongoError } from './sanitize-error'

export const mongoTagRepository: ITagRepository = {
    findAll: async () => {
        try {
            const database = await getMongoDatabase()
            const documents = await database.collection<ITagDocument>(mongoCollections.tags).find().toArray()
            return documents.map(mapTagDocumentToTag)
        } catch (error) {
            throw sanitizeMongoError(error)
        }
    },
    findById: async (id) => {
        try {
            const database = await getMongoDatabase()
            const document = await database.collection<ITagDocument>(mongoCollections.tags).findOne({ _id: id })
            return document ? mapTagDocumentToTag(document) : undefined
        } catch (error) {
            throw sanitizeMongoError(error)
        }
    },
    create: async (tag) => {
        try {
            const database = await getMongoDatabase()
            const document = mapTagToTagDocument(tag)
            await database.collection<ITagDocument>(mongoCollections.tags).insertOne(document)
            return tag
        } catch (error) {
            throw sanitizeMongoError(error)
        }
    },
    update: async (id, values) => {
        try {
            const database = await getMongoDatabase()
            const { id: _ignoredId, ...rest } = values
            const result = await database.collection<ITagDocument>(mongoCollections.tags).findOneAndUpdate(
                { _id: id },
                { $set: rest },
                { returnDocument: 'after' },
            )
            return result ? mapTagDocumentToTag(result) : undefined
        } catch (error) {
            throw sanitizeMongoError(error)
        }
    },
    delete: async (id) => {
        try {
            const database = await getMongoDatabase()
            const result = await database.collection<ITagDocument>(mongoCollections.tags).deleteOne({ _id: id })
            return result.deletedCount > 0
        } catch (error) {
            throw sanitizeMongoError(error)
        }
    },
    removeTagFromArticles: async (tagId) => {
        try {
            const database = await getMongoDatabase()
            await database.collection<IArticleDocument>(mongoCollections.articles).updateMany(
                { tagIds: tagId },
                { $pull: { tagIds: tagId } },
            )
        } catch (error) {
            throw sanitizeMongoError(error)
        }
    },
}
