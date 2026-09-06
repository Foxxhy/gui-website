import 'server-only'

import type { Db } from 'mongodb'

import { IStatus, type IArticle, type ITag, type IUser } from '@/types'
import type { IArticleRepository } from '@/repositories/types'

import { mongoCollections } from './collections'
import { fromDocument } from './document'
import { assertMongoSuccess } from './errors'
import { getMongoDatabase } from './database'

interface IArticleDocument {
    _id: string
    title: string
    slug: string
    description?: string
    content: string
    cover?: IArticle['cover']
    category?: IArticle['category']
    status: IArticle['status']
    seo?: IArticle['seo']
    link?: IArticle['link']
    publishedAt?: string
    featured?: IArticle['featured']
    createdAt: string
    updatedAt: string
    authorId?: string
    tagIds?: string[]
}

interface IUserDocument extends Omit<IUser, 'id'> {
    _id: string
}

interface ITagDocument extends Omit<ITag, 'id'> {
    _id: string
}

let indexesEnsured = false

const ensureArticleIndexes = async (db: Db): Promise<void> => {
    if (indexesEnsured) return
    await db.collection(mongoCollections.articles).createIndex({ slug: 1 }, { unique: true })
    await db.collection(mongoCollections.articles).createIndex({ status: 1, publishedAt: -1 })
    indexesEnsured = true
}

const articleToDocument = (article: IArticle): IArticleDocument => {
    const { id, author, tags, ...rest } = article
    return {
        _id: id,
        ...rest,
        authorId: author?.id,
        tagIds: tags?.map((tag) => tag.id),
    }
}

const partialArticleToDocument = (values: Partial<IArticle>): Partial<IArticleDocument> => {
    const { id, author, tags, ...rest } = values
    const document: Partial<IArticleDocument> = { ...rest }
    if (author !== undefined) document.authorId = author?.id
    if (tags !== undefined) document.tagIds = tags?.map((tag) => tag.id)
    return document
}

const populateArticle = async (document: IArticleDocument, db: Db): Promise<IArticle> => {
    const { authorId, tagIds, ...rest } = document
    const author = authorId
        ? await db.collection<IUserDocument>(mongoCollections.users).findOne({ _id: authorId })
        : undefined
    const tags = tagIds?.length
        ? await db.collection<ITagDocument>(mongoCollections.tags).find({ _id: { $in: tagIds } }).toArray()
        : []

    return {
        ...fromDocument({ ...rest, _id: document._id }),
        author: author ? fromDocument(author) : undefined,
        tags: tags.map((tag) => fromDocument(tag)),
    }
}

const populateArticles = async (documents: IArticleDocument[], db: Db): Promise<IArticle[]> =>
    Promise.all(documents.map((document) => populateArticle(document, db)))

export const mongoArticleRepository: IArticleRepository = {
    findAll: async () => {
        const db = await getMongoDatabase()
        await ensureArticleIndexes(db)
        const documents = await db.collection<IArticleDocument>(mongoCollections.articles).find().toArray()
        return populateArticles(documents, db)
    },
    findById: async (id) => {
        const db = await getMongoDatabase()
        await ensureArticleIndexes(db)
        const document = await db.collection<IArticleDocument>(mongoCollections.articles).findOne({ _id: id })
        return document ? populateArticle(document, db) : undefined
    },
    findPublishedBySlug: async (slug) => {
        const db = await getMongoDatabase()
        await ensureArticleIndexes(db)
        const document = await db.collection<IArticleDocument>(mongoCollections.articles).findOne({
            slug,
            status: IStatus.PUBLISHED,
        })
        return document ? populateArticle(document, db) : undefined
    },
    create: async (article) => {
        const db = await getMongoDatabase()
        await ensureArticleIndexes(db)
        try {
            await db.collection<IArticleDocument>(mongoCollections.articles).insertOne(articleToDocument(article))
            return article
        } catch (error) {
            return assertMongoSuccess(error)
        }
    },
    update: async (id, values) => {
        const db = await getMongoDatabase()
        await ensureArticleIndexes(db)
        const existing = await db.collection<IArticleDocument>(mongoCollections.articles).findOne({ _id: id })
        if (!existing) return undefined

        const updates = {
            ...partialArticleToDocument(values),
            updatedAt: values.updatedAt ?? new Date().toISOString(),
        }

        try {
            const result = await db.collection<IArticleDocument>(mongoCollections.articles).findOneAndUpdate(
                { _id: id },
                { $set: updates },
                { returnDocument: 'after' },
            )
            return result ? populateArticle(result, db) : undefined
        } catch (error) {
            return assertMongoSuccess(error)
        }
    },
}
