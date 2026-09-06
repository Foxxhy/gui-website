import { DuplicateKeyRepositoryError, assertMongoSuccess } from './errors'

describe('mongodb errors', () => {
    it('maps duplicate key errors to repository errors', () => {
        expect(() =>
            assertMongoSuccess({
                code: 11000,
                keyPattern: { slug: 1 },
            })
        ).toThrow(new DuplicateKeyRepositoryError('slug', 'Ce slug est déjà utilisé.'))
    })

    it('sanitizes unknown mongo errors', () => {
        expect(() => assertMongoSuccess(new Error('mongodb+srv://user:secret@cluster.example.net failed'))).toThrow(
            'mongodb://[redacted] failed'
        )
    })
})
