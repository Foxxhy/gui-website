import { getRepositories } from '@/repositories'
import { parseContactFieldFromFormData } from '@/lib/contact-field-form'
import { serviceAnalytics } from '@/services/analytics'
import { serviceRateLimit } from '@/services/rate-limit'
import {
    serviceFieldErrors,
    serviceIsValidEmail,
    serviceMaxLengthError,
    serviceRequiredError,
    serviceToTrimmedString,
    serviceValidationLimits,
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

const isValidTechnicalName = (value: string) =>
    /^[a-z][a-z0-9_]*$/i.test(value)

const CONTACT_SUBMIT_RATE_LIMIT = { limit: 5, windowMs: 15 * 60 * 1000 }

const validateContactField = async (
    values: Partial<IContactField>,
    currentId?: string
): Promise<IFieldErrors> => {
    const configuration = await getRepositories().settings.getContactFormConfiguration()
    const rawLabel = typeof values.label === 'string' ? values.label.trim() : ''
    const technicalName = serviceToTrimmedString(values.technicalName, serviceValidationLimits.technicalName)
    const label = serviceToTrimmedString(values.label, serviceValidationLimits.name)
    const errors = serviceFieldErrors(
        ['technicalName', serviceRequiredError(technicalName, 'L’identifiant technique est obligatoire.') ?? serviceMaxLengthError(technicalName, serviceValidationLimits.technicalName, 'L’identifiant technique est trop long.') ?? (!isValidTechnicalName(technicalName) ? 'L’identifiant technique est invalide.' : undefined)],
        ['label', serviceRequiredError(label, 'Le libellé est obligatoire.') ?? serviceMaxLengthError(rawLabel, serviceValidationLimits.name, 'Le libellé est trop long.')],
        ['type', values.type && !Object.values(IContactFieldType).includes(values.type) ? 'Le type est invalide.' : undefined],
    )

    if (values.type === IContactFieldType.SELECT && (!values.options || values.options.length === 0)) {
        errors.options = 'Au moins une option est requise pour une liste.'
    }

    if (
        technicalName &&
        configuration.fields.some(
            (field) => field.technicalName === technicalName && field.id !== currentId
        )
    ) {
        errors.technicalName = 'Cet identifiant technique est déjà utilisé.'
    }

    return errors
}

const toFieldInput = (field: IContactField): Omit<IContactField, 'id' | 'order'> => ({
    technicalName: field.technicalName,
    label: field.label,
    type: field.type,
    required: field.required,
    placeholder: field.placeholder,
    helpText: field.helpText,
    options: field.options,
})

export const serviceContact = {
    getConfiguration: async (): Promise<IContactFormConfiguration> => {
        const configuration = await getRepositories().settings.getContactFormConfiguration()
        return {
            ...configuration,
            fields: sortedFields(configuration.fields),
        }
    },
    getFieldById: async (id: string): Promise<IContactField | undefined> => {
        const configuration = await getRepositories().settings.getContactFormConfiguration()
        return configuration.fields.find((field) => field.id === id)
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
                field.type === 'textarea'
                    ? serviceValidationLimits.message
                    : field.type === 'tel'
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
            if (field.type === 'email' && value && !serviceIsValidEmail(value)) {
                errors[field.technicalName] = 'Veuillez saisir une adresse e-mail valide.'
            }
            if (field.type === 'tel' && value && !isValidPhone(value)) {
                errors[field.technicalName] = 'Veuillez saisir un numéro de téléphone valide.'
            }
            if (rawValue.length > limit) errors[field.technicalName] = 'Ce champ est trop long.'
            if (
                field.type === 'select' &&
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
    createField: async (formData: FormData): Promise<IActionResult<IContactFormConfiguration>> => {
        const parsed = parseContactFieldFromFormData(formData)
        const errors = await validateContactField(parsed)
        if (Object.keys(errors).length > 0) {
            return { success: false, message: 'Le champ contient des erreurs.', errors }
        }

        const data = await getRepositories().settings.createContactField(toFieldInput(parsed))
        return {
            success: true,
            message: 'Champ ajouté.',
            data: { ...data, fields: sortedFields(data.fields) },
        }
    },
    updateField: async (formData: FormData): Promise<IActionResult<IContactFormConfiguration>> => {
        const id = String(formData.get('id') ?? '')
        const current = await serviceContact.getFieldById(id)
        if (!current) return { success: false, message: 'Champ introuvable.' }

        const parsed = parseContactFieldFromFormData(formData, current)
        const errors = await validateContactField(parsed, id)
        if (Object.keys(errors).length > 0) {
            return { success: false, message: 'Le champ contient des erreurs.', errors }
        }

        const data = await getRepositories().settings.updateContactField(id, toFieldInput(parsed))
        if (!data) return { success: false, message: 'Champ introuvable.' }
        return {
            success: true,
            message: 'Champ modifié.',
            data: { ...data, fields: sortedFields(data.fields) },
        }
    },
    deleteField: async (id: string): Promise<IActionResult<IContactFormConfiguration>> => {
        const deleted = await getRepositories().settings.deleteContactField(id)
        if (!deleted) return { success: false, message: 'Champ introuvable.' }

        const data = await getRepositories().settings.getContactFormConfiguration()
        return {
            success: true,
            message: 'Champ supprimé.',
            data: { ...data, fields: sortedFields(data.fields) },
        }
    },
    reorderField: async (
        id: string,
        direction: 'up' | 'down'
    ): Promise<IActionResult<IContactFormConfiguration>> => {
        const data = await getRepositories().settings.reorderContactField(id, direction)
        if (!data) return { success: false, message: 'Champ introuvable.' }
        return {
            success: true,
            message: 'Ordre mis à jour.',
            data: { ...data, fields: sortedFields(data.fields) },
        }
    },
    mutateFromAdminForm: async (
        formData: FormData,
        operation: string
    ): Promise<IActionResult<IContactFormConfiguration>> => {
        if (operation === 'champ ajouté') {
            return serviceContact.createField(formData)
        }
        if (operation === 'champ modifié') {
            return serviceContact.updateField(formData)
        }
        if (operation === 'champ supprimé') {
            return serviceContact.deleteField(String(formData.get('id') ?? ''))
        }
        if (operation === 'ordre modifié') {
            const direction = String(formData.get('move') ?? '')
            if (direction !== 'up' && direction !== 'down') {
                return { success: false, message: 'Sens de déplacement invalide.' }
            }
            return serviceContact.reorderField(String(formData.get('id') ?? ''), direction)
        }

        const values = Object.fromEntries(formData.entries())
        return serviceContact.updateConfiguration(values)
    },
}
