import 'server-only'

import { sanitizeMongoError } from './sanitize-error'

export class DuplicateKeyRepositoryError extends Error {
    constructor(
        public readonly field: string,
        message: string,
    ) {
        super(message)
        this.name = 'DuplicateKeyRepositoryError'
    }
}

const duplicateFieldMessages: Record<string, string> = {
    login: 'Cet identifiant est déjà utilisé.',
    email: 'Cette adresse e-mail est déjà utilisée.',
    slug: 'Ce slug est déjà utilisé.',
}

export const assertMongoSuccess = (error: unknown): never => {
    if (error && typeof error === 'object' && 'code' in error) {
        const mongoError = error as { code: number; keyPattern?: Record<string, number> }
        if (mongoError.code === 11000) {
            const field = Object.keys(mongoError.keyPattern ?? {})[0] ?? 'field'
            throw new DuplicateKeyRepositoryError(
                field,
                duplicateFieldMessages[field] ?? 'Une valeur est déjà utilisée.',
            )
        }
    }

    throw sanitizeMongoError(error)
}
