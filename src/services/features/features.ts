import { repositoryFeature } from '@/repositories'
import type { IActionResult, IFeatureFlags, IFeatureKey } from '@/types'

export const serviceFeature = {
    getFlags: async (): Promise<IFeatureFlags> => repositoryFeature.getFlags(),
    updateFlag: async (key: string, enabled: boolean): Promise<IActionResult<IFeatureFlags>> => {
        if (!(key in repositoryFeature.getFlags())) {
            return {
                success: false,
                message: 'La fonctionnalité demandée est invalide.',
            }
        }
        return repositoryFeature.updateFlag(key as IFeatureKey, enabled)
    },
}
