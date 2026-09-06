import 'server-only'

import type { IContactField, IContactFormConfiguration, IFeatureFlags } from '@/types'
import type { ISettingsRepository } from '@/repositories/types'

import { mongoCollections } from './collections'
import { fromDocument } from './document'
import { getMongoDatabase } from './database'

const FEATURE_FLAGS_ID = 'featureFlags'
const CONTACT_FORM_ID = 'contact-form'

interface IFeatureFlagsDocument extends IFeatureFlags {
    _id: string
}

interface IContactFormDocument extends Omit<IContactFormConfiguration, 'id'> {
    _id: string
}

const defaultFeatureFlags: IFeatureFlags = {
    home: true,
    articles: true,
    contact: true,
}

const sortedFields = (fields: IContactField[]) =>
    [...fields].sort((first, second) => first.order - second.order)

const getContactFormDocument = async (): Promise<IContactFormDocument> => {
    const db = await getMongoDatabase()
    const existing = await db
        .collection<IContactFormDocument>(mongoCollections.contactFormConfigurations)
        .findOne({ _id: CONTACT_FORM_ID })

    return existing ?? {
        _id: CONTACT_FORM_ID,
        title: 'Témoigner',
        description: '',
        fields: [],
    }
}

const saveContactFormDocument = async (document: IContactFormDocument): Promise<IContactFormConfiguration> => {
    const db = await getMongoDatabase()
    await db.collection<IContactFormDocument>(mongoCollections.contactFormConfigurations).updateOne(
        { _id: CONTACT_FORM_ID },
        { $set: document },
        { upsert: true },
    )
    return fromDocument(document)
}

export const mongoSettingsRepository: ISettingsRepository = {
    getFeatureFlags: async () => {
        const db = await getMongoDatabase()
        const document = await db
            .collection<IFeatureFlagsDocument>(mongoCollections.featureFlags)
            .findOne({ _id: FEATURE_FLAGS_ID })
        if (!document) return { ...defaultFeatureFlags }
        const { _id, ...flags } = document
        return flags
    },
    updateFeatureFlag: async (key, enabled) => {
        const db = await getMongoDatabase()
        const collection = db.collection<IFeatureFlagsDocument>(mongoCollections.featureFlags)
        const existing = await collection.findOne({ _id: FEATURE_FLAGS_ID })
        const nextFlags = { ...(existing ?? { _id: FEATURE_FLAGS_ID, ...defaultFeatureFlags }), [key]: enabled }
        await collection.updateOne(
            { _id: FEATURE_FLAGS_ID },
            { $set: nextFlags },
            { upsert: true },
        )
        const { _id, ...flags } = nextFlags
        return flags as IFeatureFlags
    },
    getContactFormConfiguration: async () => {
        const document = await getContactFormDocument()
        return fromDocument({ ...document, fields: sortedFields(document.fields) })
    },
    updateContactFormConfiguration: async (values) => {
        const existing = await getContactFormDocument()
        const nextDocument: IContactFormDocument = {
            _id: CONTACT_FORM_ID,
            title: typeof values.title === 'string' && values.title.trim()
                ? values.title.trim()
                : existing.title,
            description: typeof values.description === 'string'
                ? values.description.trim()
                : existing.description,
            fields: values.fields ?? existing.fields,
        }
        const saved = await saveContactFormDocument(nextDocument)
        return { ...saved, fields: sortedFields(saved.fields) }
    },
    createContactField: async (field) => {
        const existing = await getContactFormDocument()
        const maxOrder = existing.fields.reduce(
            (current, candidate) => Math.max(current, candidate.order),
            0,
        )
        const created: IContactField = {
            ...field,
            id: `field-${Date.now()}`,
            order: maxOrder + 1,
        }
        const nextDocument: IContactFormDocument = {
            ...existing,
            fields: [...existing.fields, created],
        }
        const saved = await saveContactFormDocument(nextDocument)
        return { ...saved, fields: sortedFields(saved.fields) }
    },
    updateContactField: async (id, values) => {
        const existing = await getContactFormDocument()
        const field = existing.fields.find((candidate) => candidate.id === id)
        if (!field) return undefined

        const nextFields = existing.fields.map((candidate) =>
            candidate.id === id ? { ...candidate, ...values } : candidate
        )
        const saved = await saveContactFormDocument({ ...existing, fields: nextFields })
        return { ...saved, fields: sortedFields(saved.fields) }
    },
    deleteContactField: async (id) => {
        const existing = await getContactFormDocument()
        const nextFields = existing.fields.filter((candidate) => candidate.id !== id)
        if (nextFields.length === existing.fields.length) return false
        await saveContactFormDocument({ ...existing, fields: nextFields })
        return true
    },
    reorderContactField: async (id, direction) => {
        const existing = await getContactFormDocument()
        const fields = sortedFields(existing.fields)
        const index = fields.findIndex((candidate) => candidate.id === id)
        if (index === -1) return undefined

        const swapIndex = direction === 'up' ? index - 1 : index + 1
        if (swapIndex < 0 || swapIndex >= fields.length) {
            const saved = await saveContactFormDocument({ ...existing, fields })
            return { ...saved, fields: sortedFields(saved.fields) }
        }

        const current = fields[index]
        const swap = fields[swapIndex]
        const currentOrder = current.order
        current.order = swap.order
        swap.order = currentOrder

        const saved = await saveContactFormDocument({ ...existing, fields })
        return { ...saved, fields: sortedFields(saved.fields) }
    },
}
