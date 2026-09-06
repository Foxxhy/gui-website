import { getRepositories } from '@/repositories'
import { buildContactFieldFromFormData } from '@/lib/contact-fields'
import { serviceAnalytics } from '@/services/analytics'
import { serviceRateLimit } from '@/services/rate-limit'
import {
    serviceValidationLimits,
    serviceIsValidEmail,
    serviceIsValidSlug,
    serviceToTrimmedString,
} from '@/services/validation'
import {
    IContactFieldType,
    type IActionResult,
    type IContactField,
    type IContactFormConfiguration,
    type IContactSubmission,
    type IFieldErrors,
} from '@/types'

const sortedFields = (fields: IContactField[]) =>
    [...fields].sort((first, second) => first.order - second.order)

const isValidPhone = (value: string) =>
    /^[+]?[\d\s().-]{6,}$/.test(value)

const CONTACT_SUBMIT_RATE_LIMIT = { limit: 5, windowMs: 15 * 60 * 1000 }

const validateContactField = (field: IContactField): IFieldErrors => {
    const errors: IFieldErrors = {}
    if (!field.technicalName.trim()) errors.technicalName = 'L’identifiant technique est obligatoire.'
    else if (!serviceIsValidSlug(field.technicalName)) errors.technicalName = 'L’identifiant technique est invalide.'
    if (!field.label.trim()) errors.label = 'Le libellé est obligatoire.'
    if (field.type === IContactFieldType.SELECT && (!field.options || field.options.length === 0)) {
        errors.options = 'Les options sont obligatoires pour une liste.'
    }
    return errors
}

export const serviceContact = {
    getConfiguration: async (): Promise<IContactFormConfiguration> => {
        const configuration = await getRepositories().settings.getContactFormConfiguration()
        return {
            ...configuration,
            fields: sortedFields(configuration.fields),
        }
    },
    submit: async (formData: FormData): Promise<IActionResult> => {
        const clientKey = typeof formData.get('clientKey') === 'string'
            ? formData.get('clientKey') as string
            : 'anonymous'
        if (!serviceRateLimit.check(`contact:${clientKey}`, CONTACT_SUBMIT_RATE_LIMIT.limit, CONTACT_SUBMIT_RATE_LIMIT.windowMs)) {
            return { success: false, message: 'Trop de soumissions. Réessayez plus tard.' }
        }

        const configuration = await getRepositories().settings.getContactFormConfiguration()
        const errors: IFieldErrors = {}
        const values: Record<string, string> = {}

        for (const field of configuration.fields) {
            const limit =
                field.type === IContactFieldType.TEXTAREA
                    ? serviceValidationLimits.message
                    : field.type === IContactFieldType.TEL
                      ? serviceValidationLimits.phone
                      : serviceValidationLimits.name
            const rawValue = formData.get(field.technicalName)
            const value = serviceToTrimmedString(rawValue, limit)
            if (typeof rawValue !== 'string') {
                errors[field.technicalName] = 'Valeur invalide.'
                continue
            }
            if (field.required && !value) {
                errors[field.technicalName] = 'Ce champ est obligatoire.'
            }
            if (field.type === IContactFieldType.EMAIL && value && !serviceIsValidEmail(value)) {
                errors[field.technicalName] = 'Veuillez saisir une adresse e-mail valide.'
            }
            if (field.type === IContactFieldType.TEL && value && !isValidPhone(value)) {
                errors[field.technicalName] = 'Veuillez saisir un numéro de téléphone valide.'
            }
            if (rawValue.length > limit) errors[field.technicalName] = 'Ce champ est trop long.'
            if (
                field.type === IContactFieldType.SELECT &&
                value &&
                !field.options?.includes(value)
            ) {
                errors[field.technicalName] = 'Veuillez choisir une option valide.'
            }
            if (value) values[field.technicalName] = value
        }

        const consent = formData.get('consent')
        if (consent !== 'on' && consent !== 'true') {
            errors.consent = 'Vous devez accepter le traitement de votre témoignage.'
        }

        if (Object.keys(errors).length > 0) {
            return { success: false, message: 'Le formulaire contient des erreurs.', errors }
        }

        const submission: IContactSubmission = {
            id: `submission-${Date.now()}`,
            values,
            submittedAt: new Date().toISOString(),
        }
        await getRepositories().contactSubmissions.create(submission)
        await serviceAnalytics.trackEvent('contact-submission', '/contact')
        return {
            success: true,
            message: 'Votre message a été enregistré. Aucun e-mail n’a été envoyé.',
        }
    },
    updateConfiguration: async (
        values: Partial<IContactFormConfiguration>
    ): Promise<IActionResult<IContactFormConfiguration>> => {
        const data = await getRepositories().settings.updateContactFormConfiguration(values)
        return {
            success: true,
            message: 'Configuration mise à jour.',
            data: {
                ...data,
                fields: sortedFields(data.fields),
            },
        }
    },
    addField: async (formData: FormData): Promise<IActionResult<IContactFormConfiguration>> => {
        const configuration = await getRepositories().settings.getContactFormConfiguration()
        const field = buildContactFieldFromFormData(formData, undefined, configuration.fields.length + 1)
        const errors = validateContactField(field)
        if (Object.keys(errors).length > 0) {
            return { success: false, message: 'Le champ contient des erreurs.', errors }
        }

        if (configuration.fields.some((candidate) => candidate.technicalName === field.technicalName)) {
            return {
                success: false,
                message: 'Cet identifiant technique est déjà utilisé.',
                errors: { technicalName: 'Cet identifiant technique est déjà utilisé.' },
            }
        }

        const data = await getRepositories().settings.addContactField(field)
        return { success: true, message: 'Champ ajouté.', data: { ...data, fields: sortedFields(data.fields) } }
    },
    updateField: async (formData: FormData): Promise<IActionResult<IContactFormConfiguration>> => {
        const id = String(formData.get('id') ?? '')
        const configuration = await getRepositories().settings.getContactFormConfiguration()
        const existing = configuration.fields.find((field) => field.id === id)
        if (!existing) return { success: false, message: 'Champ introuvable.' }

        const field = buildContactFieldFromFormData(formData, existing)
        const errors = validateContactField(field)
        if (Object.keys(errors).length > 0) {
            return { success: false, message: 'Le champ contient des erreurs.', errors }
        }

        const duplicate = configuration.fields.find(
            (candidate) => candidate.technicalName === field.technicalName && candidate.id !== id
        )
        if (duplicate) {
            return {
                success: false,
                message: 'Cet identifiant technique est déjà utilisé.',
                errors: { technicalName: 'Cet identifiant technique est déjà utilisé.' },
            }
        }

        const data = await getRepositories().settings.updateContactField(id, field)
        if (!data) return { success: false, message: 'Champ introuvable.' }
        return { success: true, message: 'Champ modifié.', data: { ...data, fields: sortedFields(data.fields) } }
    },
    deleteField: async (id: string): Promise<IActionResult<IContactFormConfiguration>> => {
        const data = await getRepositories().settings.deleteContactField(id)
        if (!data) return { success: false, message: 'Champ introuvable.' }
        return { success: true, message: 'Champ supprimé.', data: { ...data, fields: sortedFields(data.fields) } }
    },
    moveField: async (id: string, direction: 'up' | 'down'): Promise<IActionResult<IContactFormConfiguration>> => {
        const data = await getRepositories().settings.moveContactField(id, direction)
        if (!data) return { success: false, message: 'Champ introuvable.' }
        return { success: true, message: 'Ordre mis à jour.', data: { ...data, fields: sortedFields(data.fields) } }
    },
}
