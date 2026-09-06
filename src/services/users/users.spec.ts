import { mockStore } from '@/repositories/mock-store'
import { IRole } from '@/types'
import { serviceUser } from './users'

describe('serviceUser', () => {
    beforeEach(() => {
        mockStore.reset()
    })

    it('lists mock users', async () => {
        await expect(serviceUser.getUsers()).resolves.toHaveLength(3)
    })

    it('finds a user by id', async () => {
        await expect(serviceUser.getUserById('user-admin')).resolves.toMatchObject({
            id: 'user-admin',
        })
        await expect(serviceUser.getUserById('missing')).resolves.toBeUndefined()
    })

    it('rejects invalid user mutations', async () => {
        await expect(
            serviceUser.createUser({ name: '', email: 'bad', pseudonym: '', role: IRole.EDITOR })
        ).resolves.toMatchObject({
            success: false,
            errors: {
                name: 'Le nom est obligatoire.',
                pseudonym: 'Le pseudonyme est obligatoire.',
                email: 'L’adresse e-mail est invalide.',
            },
        })
    })

    it('creates a valid user', async () => {
        await expect(
            serviceUser.createUser({
                name: 'Nouveau',
                pseudonym: 'Nouveau pseudonyme',
                email: 'nouveau@association.test',
                role: IRole.EDITOR,
            })
        ).resolves.toMatchObject({ success: true })
    })

    it('deletes a user', async () => {
        const created = await serviceUser.createUser({
            name: 'À supprimer',
            pseudonym: 'Temporaire',
            email: 'temporaire@association.test',
            role: IRole.EDITOR,
        })
        await expect(serviceUser.deleteUser(created.data?.id as string)).resolves.toMatchObject({
            success: true,
        })
    })
})
