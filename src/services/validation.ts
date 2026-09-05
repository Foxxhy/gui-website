import 'server-only'

import type { IFieldErrors } from '@/types'

export const VALIDATION_LIMITS = {
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

export const toTrimmedString = (value: unknown, maxLength: number): string => {
    if (typeof value !== 'string') return ''
    return value.trim().slice(0, maxLength)
}

export const toStrictBoolean = (value: unknown): boolean | undefined => {
    if (value === true || value === 'true') return true
    if (value === false || value === 'false') return false
    return undefined
}

export const isValidEmail = (value: string): boolean =>
    value.length <= VALIDATION_LIMITS.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

export const normalizeSlug = (value: unknown): string =>
    toTrimmedString(value, VALIDATION_LIMITS.slug)
        .toLocaleLowerCase('fr-FR')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')

export const isValidSlug = (value: string): boolean =>
    value.length > 0 && value.length <= VALIDATION_LIMITS.slug && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)

export const fieldErrors = (...entries: Array<[string, string | undefined]>): IFieldErrors =>
    Object.fromEntries(entries.filter((entry): entry is [string, string] => Boolean(entry[1])))

export const requiredError = (value: string, message: string): string | undefined =>
    value ? undefined : message

export const maxLengthError = (value: string, maxLength: number, message: string): string | undefined =>
    value.length > maxLength ? message : undefined

export const readFormString = (formData: FormData, name: string, maxLength: number): string =>
    toTrimmedString(formData.get(name), maxLength)
