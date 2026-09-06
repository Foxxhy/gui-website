import { MongoClient } from 'mongodb'

import { IRole } from '@/types'

import { mongoCollections } from './collections'
import { mongoUserRepository } from './users.mongodb'

const describeIntegration = process.env.MONGODB_URI ? describe : describe.skip

describeIntegration('mongoUserRepository integration', () => {
    const testUserId = `user-integration-${Date.now()}`
    const testLogin = `integration-${Date.now()}`

    afterAll(async () => {
        if (!process.env.MONGODB_URI) return
        const client = new MongoClient(process.env.MONGODB_URI)
        await client.connect()
        const db = client.db(process.env.MONGODB_DB_NAME?.trim() || 'gui-website-dev')
        await db.collection(mongoCollections.users).deleteOne({ _id: testUserId })
        await db.collection(mongoCollections.accounts).deleteOne({ userId: testUserId })
        await client.close()
    })

    it('creates a user with account and supports partial update', async () => {
        const created = await mongoUserRepository.createUserWithAccount(
            {
                id: testUserId,
                name: 'Integration User',
                email: `integration-${Date.now()}@association.test`,
                pseudonym: 'Integration',
                role: IRole.EDITOR,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
            {
                login: testLogin,
                passwordHash: 'scrypt:test:test',
            },
        )

        expect(created.id).toBe(testUserId)
        await expect(mongoUserRepository.findAccountByLogin(testLogin)).resolves.toMatchObject({
            userId: testUserId,
        })

        const updated = await mongoUserRepository.updateUser(testUserId, { role: IRole.ADMIN })
        expect(updated?.role).toBe(IRole.ADMIN)
    })
})
