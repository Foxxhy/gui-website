import 'server-only'

import type { IFieldErrors } from '@/types'

export const serviceValidationLimits = {
    name: 120,
    email: 254,
    phone: 30,
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

export const servicePasswordPolicy = {
    minLength: 8,
    maxLength: 200,
} as const

export const serviceReadFormString = (formData: FormData, name: string, maxLength: number): string =>
    serviceToTrimmedString(formData.get(name), maxLength)

export const serviceReadPassword = (value: unknown, maxLength = servicePasswordPolicy.maxLength): string =>
    typeof value === 'string' ? value.slice(0, maxLength) : ''

export const serviceValidateNewPassword = (
    newPassword: string,
    confirmPassword: string,
    requireCurrent = false,
    currentPassword = ''
) => serviceFieldErrors(
    ['currentPassword', requireCurrent && !currentPassword ? 'Le mot de passe actuel est obligatoire.' : undefined],
    ['newPassword', !newPassword ? 'Le nouveau mot de passe est obligatoire.' : newPassword.length < servicePasswordPolicy.minLength ? `Le mot de passe doit contenir au moins ${servicePasswordPolicy.minLength} caractères.` : newPassword.length > servicePasswordPolicy.maxLength ? 'Le mot de passe est trop long.' : undefined],
    ['confirmPassword', !confirmPassword ? 'La confirmation du mot de passe est obligatoire.' : confirmPassword !== newPassword ? 'La confirmation ne correspond pas au nouveau mot de passe.' : undefined],
)

