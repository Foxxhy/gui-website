import { mockStore } from '@/repositories/mock-store'
import { serviceFeature } from './features'

describe('serviceFeature', () => {
    beforeEach(() => {
        mockStore.reset()
    })

    it('returns a copy of the feature flags', async () => {
        const flags = await serviceFeature.getFlags()
        expect(flags).toEqual(mockStore.getSnapshot().featureFlags)
        flags.home = false
        expect(mockStore.getSnapshot().featureFlags.home).toBe(true)
    })

    it('updates a known feature flag', async () => {
        const result = await serviceFeature.updateFlag('contact', false)
        expect(result.success).toBe(true)
        expect(mockStore.getSnapshot().featureFlags.contact).toBe(false)
        expect(result.data?.contact).toBe(false)
    })

    it('rejects an unknown feature key', async () => {
        await expect(serviceFeature.updateFlag('unknown', true)).resolves.toEqual({
            success: false,
            message: 'La fonctionnalité demandée est invalide.',
        })
    })
})
