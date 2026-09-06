import 'server-only'

import type { IContactFormConfiguration, IFeatureFlags } from '@/types'
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
        const db = await getMongoDatabase()
        const document = await db
            .collection<IContactFormDocument>(mongoCollections.contactFormConfigurations)
            .findOne({ _id: CONTACT_FORM_ID })
        if (!document) {
            return {
                id: CONTACT_FORM_ID,
                title: 'Témoigner',
                description: '',
                fields: [],
            }
        }
        return fromDocument(document)
    },
    updateContactFormConfiguration: async (values) => {
        const db = await getMongoDatabase()
        const collection = db.collection<IContactFormDocument>(mongoCollections.contactFormConfigurations)
        const existing = await collection.findOne({ _id: CONTACT_FORM_ID })
        const nextDocument: IContactFormDocument = {
            _id: CONTACT_FORM_ID,
            title: typeof values.title === 'string' && values.title.trim()
                ? values.title.trim()
                : existing?.title ?? 'Témoigner',
            description: typeof values.description === 'string'
                ? values.description.trim()
                : existing?.description,
            fields: values.fields ?? existing?.fields ?? [],
        }
        await collection.updateOne(
            { _id: CONTACT_FORM_ID },
            { $set: nextDocument },
            { upsert: true },
        )
        return fromDocument(nextDocument)
    },
}
