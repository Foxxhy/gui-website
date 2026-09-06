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
}
