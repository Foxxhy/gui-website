import { resetRepositories } from './factory'

jest.mock('./mongodb', () => ({
    createMongoRepositories: jest.fn(() => ({
        articles: {
            findAll: jest.fn().mockResolvedValue([]),
        },
    })),
}))

describe('getRepositories', () => {
    const originalEnv = { ...process.env }

    afterEach(() => {
        process.env = { ...originalEnv }
        resetRepositories()
        jest.resetModules()
        jest.clearAllMocks()
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

    it('exposes contact submissions through the mock factory', async () => {
        delete process.env.DATA_SOURCE
        const { getRepositories } = await import('./factory')
        const repositories = getRepositories()
        const submission = await repositories.contactSubmissions.create({
            id: 'submission-test',
            values: { email: 'test@example.com' },
            submittedAt: '2026-01-01T00:00:00.000Z',
        })
        expect(submission).toMatchObject({
            id: 'submission-test',
            values: { email: 'test@example.com' },
        })
    })

    it('uses mongodb repositories when DATA_SOURCE is mongodb', async () => {
        process.env.DATA_SOURCE = 'mongodb'
        process.env.MONGODB_URI = 'mongodb+srv://user:secret@cluster0.example.mongodb.net/'
        const { createMongoRepositories } = await import('./mongodb')
        const { getRepositories } = await import('./factory')
        const repositories = getRepositories()
        await repositories.articles.findAll()
        expect(createMongoRepositories).toHaveBeenCalled()
    })
})
