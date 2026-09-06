import { filterPublicLinks, publicFooterLinks } from './navigation'

describe('public navigation', () => {
    it('includes the data management page in footer links', () => {
        expect(publicFooterLinks.some((link) => link.href === '/gestion-des-donnees')).toBe(true)
    })

    it('filters links according to feature flags', () => {
        const filtered = filterPublicLinks(publicFooterLinks, {
            home: false,
            articles: true,
            contact: false,
        })

        expect(filtered.some((link) => link.href === '/')).toBe(false)
        expect(filtered.some((link) => link.href === '/articles')).toBe(true)
        expect(filtered.some((link) => link.href === '/contact')).toBe(false)
        expect(filtered.some((link) => link.href === '/gestion-des-donnees')).toBe(true)
    })
})
