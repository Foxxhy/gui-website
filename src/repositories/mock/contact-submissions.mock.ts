import { contactSubmissions } from '@/mocks'
import type { IContactSubmissionRepository } from '@/repositories/types'
import type { IContactSubmission } from '@/types'

export const mockContactSubmissionRepository: IContactSubmissionRepository = {
    create: async (submission: IContactSubmission) => {
        contactSubmissions.push(submission)
        return submission
    },
}
