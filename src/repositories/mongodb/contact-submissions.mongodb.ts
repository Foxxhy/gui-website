import 'server-only'

import type { IContactSubmissionRepository } from '@/repositories/types'
import type { IContactSubmission } from '@/types'

import { mongoCollections } from './collections'
import { toDocument } from './document'
import { assertMongoSuccess } from './errors'
import { getMongoDatabase } from './database'

type IContactSubmissionDocument = Omit<IContactSubmission, 'id'> & { _id: string }

export const mongoContactSubmissionRepository: IContactSubmissionRepository = {
    create: async (submission) => {
        const db = await getMongoDatabase()
        try {
            await db
                .collection<IContactSubmissionDocument>(mongoCollections.contactSubmissions)
                .insertOne(toDocument(submission) as IContactSubmissionDocument)
            return submission
        } catch (error) {
            return assertMongoSuccess(error)
        }
    },
}
