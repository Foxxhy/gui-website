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

    it('throws when mongodb repositories are requested before implementation', async () => {
        process.env.DATA_SOURCE = 'mongodb'
        process.env.MONGODB_URI = 'mongodb+srv://user:secret@cluster0.example.mongodb.net/'
        const { getRepositories } = await import('./factory')
        await expect(getRepositories().articles.findAll()).rejects.toThrow(
            'Le repository MongoDB « articles » n’est pas encore implémenté.'
        )
    })
})
