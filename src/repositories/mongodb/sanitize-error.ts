const MONGODB_URI_PATTERN = /mongodb(\+srv)?:\/\/[^@\s]+@[^\s/]+/gi
const CREDENTIALS_PATTERN = /\/\/[^:]+:[^@]+@/g

export const sanitizeMongoError = (error: unknown): Error => {
    const message = error instanceof Error ? error.message : String(error)
    const sanitized = message
        .replace(MONGODB_URI_PATTERN, 'mongodb://[redacted]')
        .replace(CREDENTIALS_PATTERN, '//[redacted]@')

    if (error instanceof Error) {
        const next = new Error(sanitized)
        next.name = error.name
        return next
    }

    return new Error(sanitized)
}
