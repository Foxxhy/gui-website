import 'server-only'

import { IStatus } from '@/types'
import type { IArticleRepository } from '@/repositories/types'

import { mongoCollections } from './collections'
import type { IArticleDocument } from './documents'
import { getMongoDatabase } from './database'
import { mapArticleToDocument, mapPartialArticleToDocument, populateArticle, populateArticles } from './mappers'
import { sanitizeMongoError } from './sanitize-error'

export const mongoArticleRepository: IArticleRepository = {
    findAll: async () => {
        try {
            const database = await getMongoDatabase()
            const documents = await database.collection<IArticleDocument>(mongoCollections.articles).find().toArray()
            return populateArticles(documents)
        } catch (error) {
            throw sanitizeMongoError(error)
        }
    },
    findById: async (id) => {
        try {
            const database = await getMongoDatabase()
            const document = await database.collection<IArticleDocument>(mongoCollections.articles).findOne({ _id: id })
            return populateArticle(document)
        } catch (error) {
            throw sanitizeMongoError(error)
        }
    },
    findPublishedBySlug: async (slug) => {
        try {
            const database = await getMongoDatabase()
            const document = await database.collection<IArticleDocument>(mongoCollections.articles).findOne({
                slug,
                status: IStatus.PUBLISHED,
            })
            return populateArticle(document)
        } catch (error) {
            throw sanitizeMongoError(error)
        }
    },
    create: async (article) => {
        try {
            const database = await getMongoDatabase()
            const document = mapArticleToDocument(article)
            await database.collection<IArticleDocument>(mongoCollections.articles).insertOne(document)
            const populated = await populateArticle(document)
            return populated ?? article
        } catch (error) {
            throw sanitizeMongoError(error)
        }
    },
    update: async (id, values) => {
        try {
            const database = await getMongoDatabase()
            const updateDocument = mapPartialArticleToDocument(values)
            delete updateDocument._id

            const result = await database.collection<IArticleDocument>(mongoCollections.articles).findOneAndUpdate(
                { _id: id },
                { $set: updateDocument },
                { returnDocument: 'after' },
            )
            return populateArticle(result)
        } catch (error) {
            throw sanitizeMongoError(error)
        }
    },
}
