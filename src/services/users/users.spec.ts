import { users } from '@/mocks'
import { IRole } from '@/types'
import { serviceUser } from './users'

describe('serviceUser', () => {
    it('lists mock users', async () => {
        await expect(serviceUser.getUsers()).resolves.toBe(users)
    })

    it('creates a valid user', async () => {
        const initialLength = users.length
        await expect(
            serviceUser.createUser({
                name: 'Nouveau',
                pseudonym: 'Nouveau pseudonyme',
                email: 'nouveau@association.test',
                role: IRole.EDITOR,
            })
        ).resolves.toMatchObject({ success: true })
        expect(users.length).toBe(initialLength + 1)
    })
})
