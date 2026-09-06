import { featureFlags } from '@/mocks'

import { serviceFeature } from './features'

describe('serviceFeature', () => {
    const originalFlags = { ...featureFlags }

    afterEach(() => {
        Object.assign(featureFlags, originalFlags)
    })

    it('returns a copy of the feature flags', async () => {
        const flags = await serviceFeature.getFlags()
        expect(flags).toEqual(originalFlags)
        flags.home = false
        expect(featureFlags.home).toBe(originalFlags.home)
    })

    it('updates a known feature flag', async () => {
        const result = await serviceFeature.updateFlag('contact', false)
        expect(result.success).toBe(true)
        expect(featureFlags.contact).toBe(false)
        expect(result.data?.contact).toBe(false)
    })

    it('rejects an unknown feature key', async () => {
        await expect(serviceFeature.updateFlag('unknown', true)).resolves.toEqual({
            success: false,
            message: 'La fonctionnalité demandée est invalide.',
        })
    })
})
