import { mongoPing } from './ping'

jest.mock('./database', () => ({
    getMongoDatabase: jest.fn(),
}))

import { getMongoDatabase } from './database'

describe('mongoPing', () => {
    it('returns database name when ping succeeds', async () => {
        jest.mocked(getMongoDatabase).mockResolvedValue({
            databaseName: 'gui-website-dev',
            command: jest.fn().mockResolvedValue({ ok: 1 }),
        } as never)

        await expect(mongoPing()).resolves.toEqual({
            ok: true,
            dbName: 'gui-website-dev',
        })
    })

    it('sanitizes connection errors', async () => {
        jest.mocked(getMongoDatabase).mockRejectedValue(
            new Error('connect failed mongodb+srv://user:secret@cluster0.example.mongodb.net/')
        )

        await expect(mongoPing()).rejects.toThrow('[redacted]')
        await expect(mongoPing()).rejects.not.toThrow('secret')
    })
})
