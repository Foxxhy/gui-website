import 'server-only'

import { IContactFieldType, type IContactFormConfiguration } from '@/types'
import type { ISettingsRepository } from '@/repositories/types'

import { mongoCollections } from './collections'
import { CONTACT_FORM_DOCUMENT_ID, FEATURE_FLAGS_DOCUMENT_ID, type IContactFormDocument, type IFeatureFlagsDocument } from './documents'
import { getMongoDatabase } from './database'
import {
    defaultContactFormDocument,
    defaultFeatureFlags,
    mapContactFormDocument,
    mapFeatureFlagsDocument,
} from './mappers'
import { sanitizeMongoError } from './sanitize-error'

const cloneConfiguration = (configuration: IContactFormConfiguration): IContactFormConfiguration => ({
    ...configuration,
    fields: [...configuration.fields].sort((first, second) => first.order - second.order),
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

const getContactFormDocument = async (): Promise<IContactFormDocument> => {
    const database = await getMongoDatabase()
    const collection = database.collection<IContactFormDocument>(mongoCollections.contactFormConfigurations)
    const document = await collection.findOne({ _id: CONTACT_FORM_DOCUMENT_ID })
    if (document) return document

    const defaultDocument = defaultContactFormDocument()
    await collection.insertOne(defaultDocument)
    return defaultDocument
}

const saveContactFormDocument = async (document: IContactFormDocument): Promise<IContactFormConfiguration> => {
    const database = await getMongoDatabase()
    await database
        .collection<IContactFormDocument>(mongoCollections.contactFormConfigurations)
        .replaceOne({ _id: CONTACT_FORM_DOCUMENT_ID }, document, { upsert: true })
    return cloneConfiguration(mapContactFormDocument(document))
}

export const mongoSettingsRepository: ISettingsRepository = {
    getFeatureFlags: async () => {
        try {
            const database = await getMongoDatabase()
            const collection = database.collection<IFeatureFlagsDocument>(mongoCollections.featureFlags)
            const document = await collection.findOne({ _id: FEATURE_FLAGS_DOCUMENT_ID })
            if (document) return mapFeatureFlagsDocument(document)

            const defaultDocument = defaultFeatureFlags()
            await collection.insertOne(defaultDocument)
            return mapFeatureFlagsDocument(defaultDocument)
        } catch (error) {
            throw sanitizeMongoError(error)
        }
    },
    updateFeatureFlag: async (key, enabled) => {
        try {
            const database = await getMongoDatabase()
            const collection = database.collection<IFeatureFlagsDocument>(mongoCollections.featureFlags)
            const result = await collection.findOneAndUpdate(
                { _id: FEATURE_FLAGS_DOCUMENT_ID },
                { $set: { [key]: enabled } },
                { returnDocument: 'after', upsert: true },
            )
            if (result) return mapFeatureFlagsDocument(result)

            const defaultDocument = { ...defaultFeatureFlags(), [key]: enabled }
            await collection.insertOne(defaultDocument)
            return mapFeatureFlagsDocument(defaultDocument)
        } catch (error) {
            throw sanitizeMongoError(error)
        }
    },
    getContactFormConfiguration: async () => {
        try {
            const document = await getContactFormDocument()
            return cloneConfiguration(mapContactFormDocument(document))
        } catch (error) {
            throw sanitizeMongoError(error)
        }
    },
    updateContactFormConfiguration: async (values) => {
        try {
            const document = await getContactFormDocument()
            if (typeof values.title === 'string' && values.title.trim()) {
                document.title = values.title.trim()
            }
            if (typeof values.description === 'string') {
                document.description = values.description.trim()
            }
            return saveContactFormDocument(document)
        } catch (error) {
            throw sanitizeMongoError(error)
        }
    },
    addContactField: async (field) => {
        try {
            const document = await getContactFormDocument()
            document.fields.push(field)
            return saveContactFormDocument(document)
        } catch (error) {
            throw sanitizeMongoError(error)
        }
    },
    updateContactField: async (id, values) => {
        try {
            const document = await getContactFormDocument()
            const field = document.fields.find((candidate) => candidate.id === id)
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

            return saveContactFormDocument(document)
        } catch (error) {
            throw sanitizeMongoError(error)
        }
    },
    deleteContactField: async (id) => {
        try {
            const document = await getContactFormDocument()
            const index = document.fields.findIndex((field) => field.id === id)
            if (index < 0) return undefined

            document.fields.splice(index, 1)
            document.fields.forEach((field, order) => {
                field.order = order + 1
            })
            return saveContactFormDocument(document)
        } catch (error) {
            throw sanitizeMongoError(error)
        }
    },
    moveContactField: async (id, direction) => {
        try {
            const document = await getContactFormDocument()
            const fields = [...document.fields].sort((first, second) => first.order - second.order)
            const index = fields.findIndex((field) => field.id === id)
            if (index < 0) return undefined

            const targetIndex = direction === 'up' ? index - 1 : index + 1
            if (targetIndex < 0 || targetIndex >= fields.length) {
                return cloneConfiguration(mapContactFormDocument(document))
            }

            const current = fields[index]
            const target = fields[targetIndex]
            const currentOrder = current.order
            current.order = target.order
            target.order = currentOrder

            return saveContactFormDocument(document)
        } catch (error) {
            throw sanitizeMongoError(error)
        }
    },
}
