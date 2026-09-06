import { contactFormConfiguration, featureFlags } from '@/mocks'
import { IContactFieldType } from '@/types'
import type { ISettingsRepository } from '@/repositories/types'

const cloneConfiguration = () => ({
    ...contactFormConfiguration,
    fields: [...contactFormConfiguration.fields].sort((first, second) => first.order - second.order),
})

const parseFieldType = (value: unknown): IContactFieldType | undefined => {
    if (typeof value !== 'string') return undefined
    return Object.values(IContactFieldType).includes(value as IContactFieldType)
        ? value as IContactFieldType
        : undefined
}

const parseOptions = (value: unknown): string[] | undefined => {
    if (typeof value !== 'string') return undefined
    const options = value
        .split('\n')
        .map((option) => option.trim())
        .filter(Boolean)
    return options.length > 0 ? options : undefined
}

export const mockSettingsRepository: ISettingsRepository = {
    getFeatureFlags: async () => ({ ...featureFlags }),
    updateFeatureFlag: async (key, enabled) => {
        featureFlags[key] = enabled
        return { ...featureFlags }
    },
    getContactFormConfiguration: async () => cloneConfiguration(),
    updateContactFormConfiguration: async (values) => {
        if (typeof values.title === 'string' && values.title.trim()) {
            contactFormConfiguration.title = values.title.trim()
        }
        if (typeof values.description === 'string') {
            contactFormConfiguration.description = values.description.trim()
        }
        return cloneConfiguration()
    },
    addContactField: async (field) => {
        contactFormConfiguration.fields.push(field)
        return cloneConfiguration()
    },
    updateContactField: async (id, values) => {
        const field = contactFormConfiguration.fields.find((candidate) => candidate.id === id)
        if (!field) return undefined

        if (typeof values.technicalName === 'string' && values.technicalName.trim()) {
            field.technicalName = values.technicalName.trim()
        }
        if (typeof values.label === 'string' && values.label.trim()) {
            field.label = values.label.trim()
        }
        const type = values.type ? parseFieldType(values.type) : undefined
        if (type) field.type = type
        if (typeof values.required === 'boolean') field.required = values.required
        if (values.placeholder !== undefined) {
            field.placeholder = typeof values.placeholder === 'string' ? values.placeholder.trim() : undefined
        }
        if (values.options !== undefined) field.options = parseOptions(values.options)
        if (typeof values.order === 'number') field.order = values.order

        return cloneConfiguration()
    },
    deleteContactField: async (id) => {
        const index = contactFormConfiguration.fields.findIndex((field) => field.id === id)
        if (index < 0) return undefined
        contactFormConfiguration.fields.splice(index, 1)
        contactFormConfiguration.fields.forEach((field, order) => {
            field.order = order + 1
        })
        return cloneConfiguration()
    },
    moveContactField: async (id, direction) => {
        const fields = [...contactFormConfiguration.fields].sort((first, second) => first.order - second.order)
        const index = fields.findIndex((field) => field.id === id)
        if (index < 0) return undefined

        const targetIndex = direction === 'up' ? index - 1 : index + 1
        if (targetIndex < 0 || targetIndex >= fields.length) return cloneConfiguration()

        const current = fields[index]
        const target = fields[targetIndex]
        const currentOrder = current.order
        current.order = target.order
        target.order = currentOrder

        return cloneConfiguration()
    },
}
