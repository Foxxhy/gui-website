import { accounts, users } from '@/mocks'
import { getRepositories } from '@/repositories'
import { IRole } from '@/types'
import { serviceUser } from './users'

describe('serviceUser', () => {
    it('lists mock users', async () => {
        await expect(serviceUser.getUsers()).resolves.toBe(users)
    })

    it('creates a valid user with account credentials', async () => {
        const initialLength = users.length
        const initialAccounts = accounts.length
        const result = await serviceUser.createUser({
            name: 'Nouveau',
            pseudonym: 'Nouveau pseudonyme',
            email: 'nouveau@association.test',
            role: IRole.EDITOR,
            login: 'nouveau',
            password: 'motdepasse',
        })

        expect(result).toMatchObject({ success: true })
        expect(users.length).toBe(initialLength + 1)
        expect(accounts.length).toBe(initialAccounts + 1)
        await expect(getRepositories().users.findAccountByLogin('nouveau')).resolves.toMatchObject({
            userId: result.data?.id,
        })
    })

    it('rejects user creation without credentials', async () => {
        const result = await serviceUser.createUser({
            name: 'Sans compte',
            pseudonym: 'Test',
            email: 'sans-compte@association.test',
            role: IRole.EDITOR,
        })

        expect(result).toMatchObject({
            success: false,
            errors: expect.objectContaining({
                login: expect.any(String),
                password: expect.any(String),
            }),
        })
    })

    it('updates only the role on partial update', async () => {
        const target = users.find((user) => user.id === 'user-editor')
        expect(target).toBeDefined()

        const result = await serviceUser.updateUser('user-editor', { role: IRole.ADMIN })
        expect(result).toMatchObject({ success: true })
        expect(target?.role).toBe(IRole.ADMIN)

        await serviceUser.updateUser('user-editor', { role: IRole.EDITOR })
    })
})
