import 'server-only'

import type { IFieldErrors } from '@/types'

export const serviceValidationLimits = {
    name: 120,
    email: 254,
    pseudonym: 80,
    slug: 80,
    description: 500,
    content: 50_000,
    message: 5_000,
    title: 160,
    technicalName: 64,
    option: 120,
} as const

export const serviceToTrimmedString = (value: unknown, maxLength: number): string => {
    if (typeof value !== 'string') return ''
    return value.trim().slice(0, maxLength)
}

export const serviceToStrictBoolean = (value: unknown): boolean | undefined => {
    if (value === true || value === 'true') return true
    if (value === false || value === 'false') return false
    return undefined
}

export const serviceIsValidEmail = (value: string): boolean =>
    value.length <= serviceValidationLimits.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

export const serviceNormalizeSlug = (value: unknown): string =>
    serviceToTrimmedString(value, serviceValidationLimits.slug)
        .toLocaleLowerCase('fr-FR')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')

export const serviceIsValidSlug = (value: string): boolean =>
    value.length > 0 && value.length <= serviceValidationLimits.slug && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)

export const serviceFieldErrors = (...entries: Array<[string, string | undefined]>): IFieldErrors =>
    Object.fromEntries(entries.filter((entry): entry is [string, string] => Boolean(entry[1])))

export const serviceRequiredError = (value: string, message: string): string | undefined =>
    value ? undefined : message

export const serviceMaxLengthError = (value: string, maxLength: number, message: string): string | undefined =>
    value.length > maxLength ? message : undefined

export const serviceReadFormString = (formData: FormData, name: string, maxLength: number): string =>
    serviceToTrimmedString(formData.get(name), maxLength)
