import { users } from '@/mocks'
import { IRole } from '@/types'

import { serviceUser } from './users'

describe('serviceUser', () => {
    it('lists mock users', async () => {
        await expect(serviceUser.getUsers()).resolves.toBe(users)
    })

    it('finds a user by id', async () => {
        await expect(serviceUser.getUserById('user-admin')).resolves.toEqual(users[0])
        await expect(serviceUser.getUserById('missing')).resolves.toBeUndefined()
    })

    it('rejects invalid user mutations', async () => {
        await expect(
            serviceUser.simulateMutation({ name: '', email: 'bad', role: IRole.EDITOR })
        ).resolves.toMatchObject({
            success: false,
            errors: {
                name: 'Le nom est obligatoire.',
                email: 'L’adresse e-mail est invalide.',
            },
        })
    })

    it('accepts a valid simulated mutation', async () => {
        await expect(
            serviceUser.simulateMutation({
                name: 'Nouveau',
                email: 'nouveau@association.test',
                role: IRole.EDITOR,
            })
        ).resolves.toMatchObject({ success: true })
    })
})
