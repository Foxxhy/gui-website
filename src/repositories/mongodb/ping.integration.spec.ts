import { mongoPing } from './ping'

const describeIntegration = process.env.MONGODB_URI ? describe : describe.skip

describeIntegration('mongoPing integration', () => {
    it('connects to the configured Atlas cluster', async () => {
        const dbName = process.env.MONGODB_DB_NAME?.trim() || 'gui-website-dev'
        await expect(mongoPing()).resolves.toEqual({
            ok: true,
            dbName,
        })
    })
})
