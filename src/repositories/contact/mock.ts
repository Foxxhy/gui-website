import { mockStore } from '@/repositories/mock-store'
import type { IContactField } from '@/types'
import type { IContactRepository } from './contact'

const sortedFields = (fields: IContactField[]) =>
    [...fields].sort((first, second) => first.order - second.order)

export const mockContactRepository: IContactRepository = {
    getConfiguration: () => {
        const configuration = mockStore.getSnapshot().contactFormConfiguration
        return {
            ...configuration,
            fields: sortedFields(configuration.fields),
        }
    },
    updateConfiguration: (values) => {
        const store = mockStore.getSnapshot()
        const configuration = store.contactFormConfiguration
        if (typeof values.title === 'string' && values.title.trim()) {
            configuration.title = values.title.trim()
        }
        if (typeof values.description === 'string') {
            configuration.description = values.description.trim()
        }
        return {
            success: true,
            message: 'Configuration mise à jour.',
            data: {
                ...configuration,
                fields: sortedFields(configuration.fields),
            },
        }
    },
    saveSubmission: (values) => {
        mockStore.getSnapshot().contactSubmissions.push(values)
    },
}
