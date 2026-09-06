import { getRepositories } from '@/repositories'
import type { IActionResult, IFeatureFlags, IFeatureKey } from '@/types'

const featureKeys: IFeatureKey[] = ['home', 'articles', 'contact']

const hasFeatureKey = (key: string): key is IFeatureKey =>
    featureKeys.includes(key as IFeatureKey)

export const serviceFeature = {
    getFlags: async (): Promise<IFeatureFlags> => getRepositories().settings.getFeatureFlags(),
    updateFlag: async (key: string, enabled: boolean): Promise<IActionResult<IFeatureFlags>> => {
        if (!hasFeatureKey(key)) {
            return {
                success: false,
                message: 'La fonctionnalité demandée est invalide.',
            }
        }

        const data = await getRepositories().settings.updateFeatureFlag(key, enabled)
        return {
            success: true,
            message: 'Statut de la fonctionnalité mis à jour.',
            data,
        }
    },
}
