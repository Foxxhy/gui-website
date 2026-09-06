import { serviceMapRepositoryError } from './repository-errors'
import { DuplicateKeyRepositoryError } from '@/repositories/mongodb/errors'

describe('serviceMapRepositoryError', () => {
    it('maps duplicate slug errors', () => {
        expect(serviceMapRepositoryError(new DuplicateKeyRepositoryError('slug', 'Ce slug est déjà utilisé.'))).toEqual({
            success: false,
            message: 'Ce slug est déjà utilisé.',
            errors: { slug: 'Ce slug est déjà utilisé.' },
        })
    })

    it('returns undefined for unrelated errors', () => {
        expect(serviceMapRepositoryError(new Error('unexpected'))).toBeUndefined()
    })
})
