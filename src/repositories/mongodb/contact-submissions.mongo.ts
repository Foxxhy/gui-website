import 'server-only'

import type { IContactSubmissionRepository } from '@/repositories/types'

import { mongoCollections } from './collections'
import type { IContactSubmissionDocument } from './documents'
import { getMongoDatabase } from './database'
import { mapContactSubmissionDocument } from './mappers'
import { sanitizeMongoError } from './sanitize-error'

export const mongoContactSubmissionRepository: IContactSubmissionRepository = {
    create: async (submission) => {
        try {
            const database = await getMongoDatabase()
            const document: IContactSubmissionDocument = {
                _id: submission.id,
                values: submission.values,
                submittedAt: submission.submittedAt,
            }
            await database.collection<IContactSubmissionDocument>(mongoCollections.contactSubmissions).insertOne(document)
            return mapContactSubmissionDocument(document)
        } catch (error) {
            throw sanitizeMongoError(error)
        }
    },
}
