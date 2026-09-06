import 'server-only'

import { IRole } from '@/types'
import type { IUserRepository } from '@/repositories/types'

import { mongoCollections } from './collections'
import type { IAccountDocument, IUserDocument } from './documents'
import { getMongoDatabase } from './database'
import {
    mapAccountDocumentToCredentials,
    mapCredentialsToAccountDocument,
    mapUserDocumentToUser,
    mapUserToUserDocument,
} from './mappers'
import { sanitizeMongoError } from './sanitize-error'

export const mongoUserRepository: IUserRepository = {
    findUserById: async (id) => {
        try {
            const database = await getMongoDatabase()
            const document = await database.collection<IUserDocument>(mongoCollections.users).findOne({ _id: id })
            return document ? mapUserDocumentToUser(document) : undefined
        } catch (error) {
            throw sanitizeMongoError(error)
        }
    },
    findUsers: async () => {
        try {
            const database = await getMongoDatabase()
            const documents = await database.collection<IUserDocument>(mongoCollections.users).find().toArray()
            return documents.map(mapUserDocumentToUser)
        } catch (error) {
            throw sanitizeMongoError(error)
        }
    },
    findAccountByLogin: async (login) => {
        try {
            const database = await getMongoDatabase()
            const document = await database
                .collection<IAccountDocument>(mongoCollections.accounts)
                .findOne({ login })
            return document ? mapAccountDocumentToCredentials(document) : undefined
        } catch (error) {
            throw sanitizeMongoError(error)
        }
    },
    findAccountByUserId: async (userId) => {
        try {
            const database = await getMongoDatabase()
            const document = await database
                .collection<IAccountDocument>(mongoCollections.accounts)
                .findOne({ userId })
            return document ? mapAccountDocumentToCredentials(document) : undefined
        } catch (error) {
            throw sanitizeMongoError(error)
        }
    },
    updatePasswordHash: async (userId, passwordHash) => {
        try {
            const database = await getMongoDatabase()
            const result = await database
                .collection<IAccountDocument>(mongoCollections.accounts)
                .updateOne({ userId }, { $set: { passwordHash } })
            return result.matchedCount > 0
        } catch (error) {
            throw sanitizeMongoError(error)
        }
    },
    incrementSessionVersion: async (userId) => {
        try {
            const database = await getMongoDatabase()
            const result = await database.collection<IUserDocument>(mongoCollections.users).findOneAndUpdate(
                { _id: userId },
                {
                    $inc: { sessionVersion: 1 },
                    $set: { updatedAt: new Date().toISOString() },
                },
                { returnDocument: 'after' },
            )
            return result?.sessionVersion ?? 0
        } catch (error) {
            throw sanitizeMongoError(error)
        }
    },
    createUser: async (user) => {
        try {
            const database = await getMongoDatabase()
            const document = mapUserToUserDocument(user)
            await database.collection<IUserDocument>(mongoCollections.users).insertOne(document)
            return user
        } catch (error) {
            throw sanitizeMongoError(error)
        }
    },
    createAccount: async (credentials) => {
        try {
            const database = await getMongoDatabase()
            const user = await database
                .collection<IUserDocument>(mongoCollections.users)
                .findOne({ _id: credentials.userId })
            if (!user) {
                throw new Error('Utilisateur introuvable pour la création du compte.')
            }

            const existingLogin = await database
                .collection<IAccountDocument>(mongoCollections.accounts)
                .findOne({ login: credentials.login })
            if (existingLogin) {
                throw new Error('Cet identifiant est déjà utilisé.')
            }

            const document = mapCredentialsToAccountDocument(credentials)
            await database.collection<IAccountDocument>(mongoCollections.accounts).insertOne(document)
            return credentials
        } catch (error) {
            throw sanitizeMongoError(error)
        }
    },
    updateUser: async (id, values) => {
        try {
            const database = await getMongoDatabase()
            const { id: _ignoredId, ...rest } = values
            const updateValues = {
                ...rest,
                updatedAt: new Date().toISOString(),
            }
            const result = await database.collection<IUserDocument>(mongoCollections.users).findOneAndUpdate(
                { _id: id },
                { $set: updateValues },
                { returnDocument: 'after' },
            )
            return result ? mapUserDocumentToUser(result) : undefined
        } catch (error) {
            throw sanitizeMongoError(error)
        }
    },
    deleteUser: async (id) => {
        try {
            const database = await getMongoDatabase()
            const usersCollection = database.collection<IUserDocument>(mongoCollections.users)
            const user = await usersCollection.findOne({ _id: id })
            if (!user) return false

            if (user.role === IRole.ADMIN) {
                const adminCount = await usersCollection.countDocuments({ role: IRole.ADMIN })
                if (adminCount <= 1) return false
            }

            await usersCollection.deleteOne({ _id: id })
            await database.collection<IAccountDocument>(mongoCollections.accounts).deleteOne({ userId: id })
            return true
        } catch (error) {
            throw sanitizeMongoError(error)
        }
    },
}
