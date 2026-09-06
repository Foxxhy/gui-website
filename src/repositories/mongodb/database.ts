import 'server-only'

import type { Db } from 'mongodb'

import { configDatabase } from '@/configs'

import { getMongoClient } from './client'

export const getMongoDatabase = async (): Promise<Db> => {
    const client = await getMongoClient()
    return client.db(configDatabase.mongo.dbName)
}
