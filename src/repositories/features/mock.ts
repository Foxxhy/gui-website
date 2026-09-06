import { mockStore } from '@/repositories/mock-store'
import type { IFeatureRepository } from './features'

export const mockFeatureRepository: IFeatureRepository = {
    getFlags: () => ({ ...mockStore.getSnapshot().featureFlags }),
    updateFlag: (key, enabled) => {
        mockStore.getSnapshot().featureFlags[key] = enabled
        return {
            success: true,
            message: 'Statut de la fonctionnalité mis à jour.',
            data: { ...mockStore.getSnapshot().featureFlags },
        }
    },
}
