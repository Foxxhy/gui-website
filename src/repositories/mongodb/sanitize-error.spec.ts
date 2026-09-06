import { sanitizeMongoError } from './sanitize-error'

describe('sanitizeMongoError', () => {
    it('redacts credentials from connection strings in error messages', () => {
        const error = new Error(
            'Authentication failed: mongodb+srv://app_user:SecretPass@cluster0.example.mongodb.net/gui-website-dev'
        )
        const sanitized = sanitizeMongoError(error)
        expect(sanitized.message).not.toContain('SecretPass')
        expect(sanitized.message).not.toContain('app_user:')
        expect(sanitized.message).toContain('[redacted]')
    })

    it('wraps non-error values', () => {
        const sanitized = sanitizeMongoError('mongodb://user:pass@host/db failed')
        expect(sanitized.message).not.toContain('pass')
    })
})
