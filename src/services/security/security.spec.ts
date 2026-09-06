import { serviceCreateCsp, serviceIsSafeUrl, serviceSanitizeMarkdown, serviceValidateUploadMetadata } from './security'

describe('security utilities', () => {
    it('removes executable Markdown content', async () => {
        const html = await serviceSanitizeMarkdown('[safe](https://example.org) <script>alert(1)</script>')
        expect(html).toContain('https://example.org')
        expect(html).not.toContain('<script>')
        expect(html).not.toContain('alert(1)')
    })

    it('accepts only safe URL protocols', () => {
        expect(serviceIsSafeUrl('https://example.org')).toBe(true)
        expect(serviceIsSafeUrl('/articles/test')).toBe(true)
        expect(serviceIsSafeUrl('javascript:alert(1)')).toBe(false)
        expect(serviceIsSafeUrl('data:text/html,evil')).toBe(false)
    })

    it('creates a CSP containing the nonce and restrictive directives', () => {
        const csp = serviceCreateCsp('test-nonce', false)
        expect(csp).toContain("script-src 'self' 'nonce-test-nonce'")
        expect(csp).toContain("style-src 'self' 'nonce-test-nonce'")
        expect(csp).toContain("style-src-elem 'self' 'nonce-test-nonce'")
        expect(csp).toContain("style-src-attr 'unsafe-inline'")
        expect(csp).not.toContain("style-src 'self' 'nonce-test-nonce' 'unsafe-inline'")
        expect(csp).toContain("object-src 'none'")
        expect(csp).toContain("frame-ancestors 'none'")
    })

    it('validates upload metadata before future storage', () => {
        const policy = { maxBytes: 1000, mimeTypes: ['image/png'], extensions: ['png'] }
        expect(serviceValidateUploadMetadata({ name: 'image.png', size: 100, type: 'image/png' }, policy)).toBeUndefined()
        expect(serviceValidateUploadMetadata({ name: 'image.exe', size: 100, type: 'image/png' }, policy)).toBeDefined()
        expect(serviceValidateUploadMetadata({ name: 'image.png', size: 1001, type: 'image/png' }, policy)).toBeDefined()
    })
})
