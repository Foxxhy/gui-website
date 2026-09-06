import { DuplicateKeyRepositoryError } from '@/repositories/mongodb/errors'
import type { IActionResult, IFieldErrors } from '@/types'

export type IRepositoryErrorResult = {
    success: false
    message: string
    errors?: IFieldErrors
}

export const serviceMapRepositoryError = (error: unknown): IRepositoryErrorResult | undefined => {
    if (error instanceof DuplicateKeyRepositoryError) {
        if (error.field === 'slug') {
            return {
                success: false,
                message: 'Ce slug est déjà utilisé.',
                errors: { slug: 'Ce slug est déjà utilisé.' },
            }
        }
        if (error.field === 'login') {
            return {
                success: false,
                message: 'Cet identifiant est déjà utilisé.',
                errors: { login: 'Cet identifiant est déjà utilisé.' },
            }
        }
        if (error.field === 'email') {
            return {
                success: false,
                message: 'Cette adresse e-mail est déjà utilisée.',
                errors: { email: 'Cette adresse e-mail est déjà utilisée.' },
            }
        }
        return { success: false, message: 'Une valeur est déjà utilisée.' }
    }
    return undefined
}

export const serviceMapRepositoryErrorAs = <T>(error: unknown): IActionResult<T> | undefined => {
    const mapped = serviceMapRepositoryError(error)
    return mapped as IActionResult<T> | undefined
}
