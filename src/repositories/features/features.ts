import type { IActionResult, IFeatureFlags, IFeatureKey } from '@/types'

export interface IFeatureRepository {
    getFlags(): IFeatureFlags
    updateFlag(key: IFeatureKey, enabled: boolean): IActionResult<IFeatureFlags>
}
