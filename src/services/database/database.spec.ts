import { serviceDatabase } from './database'

jest.mock('@/repositories/mongodb/ping', () => ({
    mongoPing: jest.fn(),
}))

import { mongoPing } from '@/repositories/mongodb/ping'

describe('serviceDatabase', () => {
    it('delegates to mongoPing', async () => {
        jest.mocked(mongoPing).mockResolvedValue({ ok: true, dbName: 'gui-website-dev' })
        await expect(serviceDatabase.ping()).resolves.toEqual({
            ok: true,
            dbName: 'gui-website-dev',
        })
    })
})
