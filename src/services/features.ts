import { featureFlags } from '@/mocks'
import type { IActionResult, IFeatureFlags, IFeatureKey } from '@/types'

const hasFeatureKey = (key: string): key is IFeatureKey =>
    key in featureFlags

export const featureService = {
    getFlags: async (): Promise<IFeatureFlags> => ({ ...featureFlags }),
    updateFlag: async (
        key: string,
        enabled: boolean
    ): Promise<IActionResult<IFeatureFlags>> => {
        if (!hasFeatureKey(key)) {
            return {
                success: false,
                message: 'La fonctionnalité demandée est invalide.',
            }
        }

        featureFlags[key] = enabled
        return {
            success: true,
            message: 'Statut de la fonctionnalité mis à jour dans la simulation.',
            data: { ...featureFlags },
        }
    },
}