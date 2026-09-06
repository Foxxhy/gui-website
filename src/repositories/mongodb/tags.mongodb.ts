import 'server-only'

import type { Db } from 'mongodb'

import type { ITag } from '@/types'
import type { ITagRepository } from '@/repositories/types'

import { mongoCollections } from './collections'
import { fromDocument, toDocument } from './document'
import { assertMongoSuccess } from './errors'
import { getMongoDatabase } from './database'

interface ITagDocument extends Omit<ITag, 'id'> {
    _id: string
}

interface IArticleDocument {
    _id: string
    tagIds?: string[]
}

let indexesEnsured = false

const ensureTagIndexes = async (db: Db): Promise<void> => {
    if (indexesEnsured) return
    await db.collection(mongoCollections.tags).createIndex({ slug: 1 }, { unique: true })
    indexesEnsured = true
}

const tagFromDocument = (document: ITagDocument): ITag => fromDocument(document)

export const mongoTagRepository: ITagRepository = {
    findAll: async () => {
        const db = await getMongoDatabase()
        await ensureTagIndexes(db)
        const documents = await db.collection<ITagDocument>(mongoCollections.tags).find().toArray()
        return documents.map(tagFromDocument)
    },
    findById: async (id) => {
        const db = await getMongoDatabase()
        await ensureTagIndexes(db)
        const document = await db.collection<ITagDocument>(mongoCollections.tags).findOne({ _id: id })
        return document ? tagFromDocument(document) : undefined
    },
    create: async (tag) => {
        const db = await getMongoDatabase()
        await ensureTagIndexes(db)
        try {
            await db.collection<ITagDocument>(mongoCollections.tags).insertOne(toDocument(tag) as ITagDocument)
            return tag
        } catch (error) {
            return assertMongoSuccess(error)
        }
    },
    update: async (id, values) => {
        const db = await getMongoDatabase()
        await ensureTagIndexes(db)
        try {
            const result = await db.collection<ITagDocument>(mongoCollections.tags).findOneAndUpdate(
                { _id: id },
                { $set: values },
                { returnDocument: 'after' },
            )
            return result ? tagFromDocument(result) : undefined
        } catch (error) {
            return assertMongoSuccess(error)
        }
    },
    delete: async (id) => {
        const db = await getMongoDatabase()
        await ensureTagIndexes(db)
        const result = await db.collection<ITagDocument>(mongoCollections.tags).deleteOne({ _id: id })
        return result.deletedCount > 0
    },
    removeTagFromArticles: async (tagId) => {
        const db = await getMongoDatabase()
        await ensureTagIndexes(db)
        await db.collection<IArticleDocument>(mongoCollections.articles).updateMany(
            { tagIds: tagId },
            { $pull: { tagIds: tagId } },
        )
    },
}
