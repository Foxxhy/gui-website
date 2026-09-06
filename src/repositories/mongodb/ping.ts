import 'server-only'

import { sanitizeMongoError } from './sanitize-error'
import { getMongoDatabase } from './database'

export const mongoPing = async (): Promise<{ ok: true; dbName: string }> => {
    try {
        const database = await getMongoDatabase()
        await database.command({ ping: 1 })
        return { ok: true, dbName: database.databaseName }
    } catch (error) {
        throw sanitizeMongoError(error)
    }
}
