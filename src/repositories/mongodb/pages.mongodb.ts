import 'server-only'

import type { Db } from 'mongodb'

import type { IPage } from '@/types'
import type { IPageRepository } from '@/repositories/types'

import { mongoCollections } from './collections'
import { fromDocument } from './document'
import { assertMongoSuccess } from './errors'
import { getMongoDatabase } from './database'

interface IPageDocument extends Omit<IPage, 'id'> {
    _id: string
}

let indexesEnsured = false

const ensurePageIndexes = async (db: Db): Promise<void> => {
    if (indexesEnsured) return
    await db.collection(mongoCollections.pages).createIndex({ slug: 1 }, { unique: true })
    indexesEnsured = true
}

const pageFromDocument = (document: IPageDocument): IPage => fromDocument(document)

export const mongoPageRepository: IPageRepository = {
    findAll: async () => {
        const db = await getMongoDatabase()
        await ensurePageIndexes(db)
        const documents = await db.collection<IPageDocument>(mongoCollections.pages).find().toArray()
        return documents.map(pageFromDocument)
    },
    findBySlug: async (slug) => {
        const db = await getMongoDatabase()
        await ensurePageIndexes(db)
        const document = await db.collection<IPageDocument>(mongoCollections.pages).findOne({ slug })
        return document ? pageFromDocument(document) : undefined
    },
    update: async (id, values) => {
        const db = await getMongoDatabase()
        await ensurePageIndexes(db)
        const updates = { ...values, updatedAt: values.updatedAt ?? new Date().toISOString() }
        try {
            const result = await db.collection<IPageDocument>(mongoCollections.pages).findOneAndUpdate(
                { _id: id },
                { $set: updates },
                { returnDocument: 'after' },
            )
            return result ? pageFromDocument(result) : undefined
        } catch (error) {
            return assertMongoSuccess(error)
        }
    },
}
