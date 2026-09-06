import { contactFormConfiguration, featureFlags } from '@/mocks'
import type { ISettingsRepository } from '@/repositories/types'
import type { IContactField } from '@/types'

const withSortedFields = () => ({
    ...contactFormConfiguration,
    fields: [...contactFormConfiguration.fields].sort((first, second) => first.order - second.order),
})

export const mockSettingsRepository: ISettingsRepository = {
    getFeatureFlags: async () => ({ ...featureFlags }),
    updateFeatureFlag: async (key, enabled) => {
        featureFlags[key] = enabled
        return { ...featureFlags }
    },
    getContactFormConfiguration: async () => withSortedFields(),
    updateContactFormConfiguration: async (values) => {
        if (typeof values.title === 'string' && values.title.trim()) {
            contactFormConfiguration.title = values.title.trim()
        }
        if (typeof values.description === 'string') {
            contactFormConfiguration.description = values.description.trim()
        }
        return withSortedFields()
    },
    createContactField: async (field) => {
        const maxOrder = contactFormConfiguration.fields.reduce(
            (current, candidate) => Math.max(current, candidate.order),
            0
        )
        const created: IContactField = {
            ...field,
            id: `field-${Date.now()}`,
            order: maxOrder + 1,
        }
        contactFormConfiguration.fields.push(created)
        return withSortedFields()
    },
    updateContactField: async (id, values) => {
        const field = contactFormConfiguration.fields.find((candidate) => candidate.id === id)
        if (!field) return undefined
        Object.assign(field, values)
        return withSortedFields()
    },
    deleteContactField: async (id) => {
        const index = contactFormConfiguration.fields.findIndex((candidate) => candidate.id === id)
        if (index === -1) return false
        contactFormConfiguration.fields.splice(index, 1)
        return true
    },
    reorderContactField: async (id, direction) => {
        const fields = [...contactFormConfiguration.fields].sort((first, second) => first.order - second.order)
        const index = fields.findIndex((candidate) => candidate.id === id)
        if (index === -1) return undefined

        const swapIndex = direction === 'up' ? index - 1 : index + 1
        if (swapIndex < 0 || swapIndex >= fields.length) return withSortedFields()

        const current = fields[index]
        const swap = fields[swapIndex]
        const currentOrder = current.order
        current.order = swap.order
        swap.order = currentOrder

        return withSortedFields()
    },
}
