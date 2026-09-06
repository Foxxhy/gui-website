import { resetRepositories } from './factory'

describe('getRepositories', () => {
    const originalEnv = { ...process.env }

    afterEach(() => {
        process.env = { ...originalEnv }
        resetRepositories()
        jest.resetModules()
    })

    it('returns mock repositories by default', async () => {
        delete process.env.DATA_SOURCE
        const { getRepositories } = await import('./factory')
        const repositories = getRepositories()
        const articles = await repositories.articles.findAll()
        expect(articles.length).toBeGreaterThan(0)
    })

    it('exposes users through the factory', async () => {
        delete process.env.DATA_SOURCE
        const { getRepositories } = await import('./factory')
        const repositories = getRepositories()
        await expect(repositories.users.findAccountByLogin('admin')).resolves.toMatchObject({
            userId: 'user-admin',
            login: 'admin',
        })
    })

    it('returns mongodb repositories when configured', async () => {
        process.env.DATA_SOURCE = 'mongodb'
        process.env.MONGODB_URI = 'mongodb+srv://user:secret@cluster0.example.mongodb.net/'
        const { getRepositories } = await import('./factory')
        const repositories = getRepositories()
        expect(repositories.users.createUserWithAccount).toBeDefined()
        expect(repositories.articles.findAll).toBeDefined()
    })
})
