describe('configApp', () => {
    const originalEnv = { ...process.env }

    afterEach(() => {
        process.env = { ...originalEnv }
        jest.resetModules()
    })

    it('exposes default site and session values', async () => {
        delete process.env.SITE_TITLE
        delete process.env.SITE_DESCRIPTION
        delete process.env.SESSION_COOKIE_NAME
        delete process.env.ARTICLES_PAGE_SIZE
        delete process.env.SESSION_COOKIE_MAX_AGE
        delete process.env.SESSION_COOKIE_DOMAIN

        const { configApp } = await import('./app')

        expect(configApp.site.title).toBe('Association POC')
        expect(configApp.site.description).toBe('Proof of concept du site de l’association')
        expect(configApp.articles.pageSize).toBe(10)
        expect(configApp.session.cookieName).toBe('association_poc_session')
        expect(configApp.session.cookieOptions.maxAge).toBe(60 * 60 * 24)
        expect(configApp.session.cookieOptions.domain).toBeUndefined()
        expect(configApp.routes.administration).toBe('/administration')
    })

    it('reads overrides from the environment', async () => {
        process.env.SITE_TITLE = 'Mon association'
        process.env.ARTICLES_PAGE_SIZE = '25'
        process.env.SESSION_COOKIE_DOMAIN = 'example.org'

        const { configApp } = await import('./app')

        expect(configApp.site.title).toBe('Mon association')
        expect(configApp.articles.pageSize).toBe(25)
        expect(configApp.session.cookieOptions.domain).toBe('example.org')
    })

    it('rejects non-positive integer environment values', async () => {
        process.env.ARTICLES_PAGE_SIZE = '0'

        await expect(import('./app')).rejects.toThrow(
            'ARTICLES_PAGE_SIZE doit être un entier strictement positif.'
        )
    })
})
