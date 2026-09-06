import 'server-only'

import type { Db } from 'mongodb'

import { IRole, type IUser, type IUserCredentials, type IUserRepository } from '@/types'

import { mongoCollections } from './collections'
import { fromDocument, toDocument } from './document'
import { assertMongoSuccess } from './errors'
import { getMongoDatabase } from './database'
import { getMongoClient } from './client'

interface IUserDocument extends Omit<IUser, 'id'> {
    _id: string
}

interface IAccountDocument {
    _id: string
    userId: string
    login: string
    passwordHash: string
}

let indexesEnsured = false

const ensureUserIndexes = async (db: Db): Promise<void> => {
    if (indexesEnsured) return
    await db.collection(mongoCollections.users).createIndex({ email: 1 }, { unique: true })
    await db.collection(mongoCollections.accounts).createIndex({ login: 1 }, { unique: true })
    await db.collection(mongoCollections.accounts).createIndex({ userId: 1 }, { unique: true })
    indexesEnsured = true
}

const userFromDocument = (document: IUserDocument): IUser => fromDocument(document)

const accountFromDocument = (document: IAccountDocument): IUserCredentials => ({
    userId: document.userId,
    login: document.login,
    passwordHash: document.passwordHash,
})

export const mongoUserRepository: IUserRepository = {
    findUserById: async (id) => {
        const db = await getMongoDatabase()
        await ensureUserIndexes(db)
        const document = await db.collection<IUserDocument>(mongoCollections.users).findOne({ _id: id })
        return document ? userFromDocument(document) : undefined
    },
    findUsers: async () => {
        const db = await getMongoDatabase()
        await ensureUserIndexes(db)
        const documents = await db.collection<IUserDocument>(mongoCollections.users).find().toArray()
        return documents.map(userFromDocument)
    },
    findAccountByLogin: async (login) => {
        const db = await getMongoDatabase()
        await ensureUserIndexes(db)
        const document = await db.collection<IAccountDocument>(mongoCollections.accounts).findOne({ login })
        return document ? accountFromDocument(document) : undefined
    },
    findAccountByUserId: async (userId) => {
        const db = await getMongoDatabase()
        await ensureUserIndexes(db)
        const document = await db.collection<IAccountDocument>(mongoCollections.accounts).findOne({ userId })
        return document ? accountFromDocument(document) : undefined
    },
    updatePasswordHash: async (userId, passwordHash) => {
        const db = await getMongoDatabase()
        await ensureUserIndexes(db)
        const result = await db.collection<IAccountDocument>(mongoCollections.accounts).updateOne(
            { userId },
            { $set: { passwordHash } },
        )
        return result.matchedCount > 0
    },
    incrementSessionVersion: async (userId) => {
        const db = await getMongoDatabase()
        await ensureUserIndexes(db)
        const result = await db.collection<IUserDocument>(mongoCollections.users).findOneAndUpdate(
            { _id: userId },
            { $inc: { sessionVersion: 1 }, $set: { updatedAt: new Date().toISOString() } },
            { returnDocument: 'after' },
        )
        return result?.sessionVersion ?? 0
    },
    createUser: async (user) => {
        const db = await getMongoDatabase()
        await ensureUserIndexes(db)
        try {
            await db.collection<IUserDocument>(mongoCollections.users).insertOne(toDocument(user) as IUserDocument)
            return user
        } catch (error) {
            return assertMongoSuccess(error)
        }
    },
    createUserWithAccount: async (user, credentials) => {
        const client = await getMongoClient()
        const db = await getMongoDatabase()
        await ensureUserIndexes(db)
        const session = client.startSession()

        try {
            await session.withTransaction(async () => {
                const users = db.collection<IUserDocument>(mongoCollections.users)
                const accounts = db.collection<IAccountDocument>(mongoCollections.accounts)
                await users.insertOne(toDocument(user) as IUserDocument, { session })
                await accounts.insertOne(
                    {
                        _id: `account-${user.id}`,
                        userId: user.id,
                        login: credentials.login,
                        passwordHash: credentials.passwordHash,
                    },
                    { session },
                )
            })
            return user
        } catch (error) {
            return assertMongoSuccess(error)
        } finally {
            await session.endSession()
        }
    },
    updateUser: async (id, values) => {
        const db = await getMongoDatabase()
        await ensureUserIndexes(db)
        const updates = { ...values, updatedAt: new Date().toISOString() }
        try {
            const result = await db.collection<IUserDocument>(mongoCollections.users).findOneAndUpdate(
                { _id: id },
                { $set: updates },
                { returnDocument: 'after' },
            )
            return result ? userFromDocument(result) : undefined
        } catch (error) {
            return assertMongoSuccess(error)
        }
    },
    deleteUser: async (id) => {
        const db = await getMongoDatabase()
        await ensureUserIndexes(db)
        const user = await db.collection<IUserDocument>(mongoCollections.users).findOne({ _id: id })
        if (!user) return false

        const adminCount = await db.collection<IUserDocument>(mongoCollections.users).countDocuments({ role: IRole.ADMIN })
        if (user.role === IRole.ADMIN && adminCount <= 1) return false

        const client = await getMongoClient()
        const session = client.startSession()
        try {
            await session.withTransaction(async () => {
                await db.collection<IUserDocument>(mongoCollections.users).deleteOne({ _id: id }, { session })
                await db.collection<IAccountDocument>(mongoCollections.accounts).deleteOne({ userId: id }, { session })
            })
            return true
        } finally {
            await session.endSession()
        }
    },
}
