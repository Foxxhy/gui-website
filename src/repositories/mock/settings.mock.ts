import { contactFormConfiguration, featureFlags } from '@/mocks'
import type { ISettingsRepository } from '@/repositories/types'

export const mockSettingsRepository: ISettingsRepository = {
    getFeatureFlags: async () => ({ ...featureFlags }),
    updateFeatureFlag: async (key, enabled) => {
        featureFlags[key] = enabled
        return { ...featureFlags }
    },
    getContactFormConfiguration: async () => ({
        ...contactFormConfiguration,
        fields: [...contactFormConfiguration.fields],
    }),
    updateContactFormConfiguration: async (values) => {
        if (typeof values.title === 'string' && values.title.trim()) {
            contactFormConfiguration.title = values.title.trim()
        }
        if (typeof values.description === 'string') {
            contactFormConfiguration.description = values.description.trim()
        }
        return {
            ...contactFormConfiguration,
            fields: [...contactFormConfiguration.fields],
        }
    },
}
