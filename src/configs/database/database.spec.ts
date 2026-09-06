describe('configDatabase', () => {
    const originalEnv = { ...process.env }

    afterEach(() => {
        process.env = { ...originalEnv }
        jest.resetModules()
    })

    it('defaults to mock data source and gui-website-dev database name', async () => {
        delete process.env.DATA_SOURCE
        delete process.env.MONGODB_URI
        delete process.env.MONGODB_DB_NAME

        const { configDatabase } = await import('./database')

        expect(configDatabase.dataSource).toBe('mock')
        expect(configDatabase.mongo.dbName).toBe('gui-website-dev')
        expect(configDatabase.mongo.uri).toBeUndefined()
    })

    it('reads database name from the environment', async () => {
        process.env.MONGODB_DB_NAME = 'gui-website-recette'

        const { configDatabase } = await import('./database')

        expect(configDatabase.mongo.dbName).toBe('gui-website-recette')
    })

    it('requires MONGODB_URI when data source is mongodb', async () => {
        process.env.DATA_SOURCE = 'mongodb'
        delete process.env.MONGODB_URI

        await expect(import('./database')).rejects.toThrow(
            'MONGODB_URI est requis lorsque DATA_SOURCE=mongodb.'
        )
    })

    it('accepts mongodb data source with a connection uri', async () => {
        process.env.DATA_SOURCE = 'mongodb'
        process.env.MONGODB_URI = 'mongodb+srv://user:secret@cluster0.example.mongodb.net/'

        const { configDatabase } = await import('./database')

        expect(configDatabase.dataSource).toBe('mongodb')
        expect(configDatabase.mongo.uri).toBe('mongodb+srv://user:secret@cluster0.example.mongodb.net/')
    })

    it('rejects invalid data source values', async () => {
        process.env.DATA_SOURCE = 'postgres'

        await expect(import('./database')).rejects.toThrow(
            'DATA_SOURCE doit valoir "mock" ou "mongodb".'
        )
    })
})
