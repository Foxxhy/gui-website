import 'server-only'

import { MongoClient } from 'mongodb'

import { configDatabase } from '@/configs'

import { sanitizeMongoError } from './sanitize-error'

declare global {
    // eslint-disable-next-line no-var
    var __mongoClientPromise: Promise<MongoClient> | undefined
}

const createClientPromise = (): Promise<MongoClient> => {
    const uri = configDatabase.mongo.uri
    if (!uri) {
        return Promise.reject(new Error('MONGODB_URI n’est pas configurée.'))
    }

    const client = new MongoClient(uri)
    return client.connect().catch((error) => {
        throw sanitizeMongoError(error)
    })
}

export const getMongoClient = (): Promise<MongoClient> => {
    if (process.env.NODE_ENV === 'development') {
        if (!global.__mongoClientPromise) {
            global.__mongoClientPromise = createClientPromise()
        }
        return global.__mongoClientPromise
    }

    return createClientPromise()
}
