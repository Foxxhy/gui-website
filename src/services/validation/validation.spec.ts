import {
    serviceFieldErrors,
    serviceIsValidEmail,
    serviceIsValidSlug,
    serviceNormalizeSlug,
    serviceReadFormString,
    serviceToStrictBoolean,
    serviceToTrimmedString,
} from './validation'

describe('validation utilities', () => {
    it('trims and applies the requested limit', () => {
        expect(serviceToTrimmedString('  hello  ', 5)).toBe('hello')
        expect(serviceToTrimmedString(42, 10)).toBe('')
    })

    it('normalizes slugs and rejects invalid formats', () => {
        expect(serviceNormalizeSlug(' Événement à venir ')).toBe('evenement-a-venir')
        expect(serviceIsValidSlug('article-1')).toBe(true)
        expect(serviceIsValidSlug('article/1')).toBe(false)
    })

    it('validates email addresses and strict booleans', () => {
        expect(serviceIsValidEmail('test@example.org')).toBe(true)
        expect(serviceIsValidEmail('invalid')).toBe(false)
        expect(serviceToStrictBoolean('true')).toBe(true)
        expect(serviceToStrictBoolean('false')).toBe(false)
        expect(serviceToStrictBoolean('1')).toBeUndefined()
    })

    it('builds field errors without empty messages', () => {
        expect(serviceFieldErrors(['name', 'Nom obligatoire'], ['email', undefined])).toEqual({ name: 'Nom obligatoire' })
    })

    it('reads only string form values', () => {
        const formData = new FormData()
        formData.set('name', '  Alice  ')
        expect(serviceReadFormString(formData, 'name', 20)).toBe('Alice')
        expect(serviceReadFormString(formData, 'missing', 20)).toBe('')
    })
})
