import { getRepositories } from '@/repositories'
import { serviceAnalytics } from '@/services/analytics'
import { serviceValidationLimits, serviceIsValidEmail, serviceToTrimmedString } from '@/services/validation'
import type {
    IActionResult,
    IContactField,
    IContactFormConfiguration,
    IFieldErrors,
} from '@/types'

const sortedFields = (fields: IContactField[]) =>
    [...fields].sort((first, second) => first.order - second.order)

export const serviceContact = {
    getConfiguration: async (): Promise<IContactFormConfiguration> => {
        const configuration = await getRepositories().settings.getContactFormConfiguration()
        return {
            ...configuration,
            fields: sortedFields(configuration.fields),
        }
    },
    submit: async (formData: FormData): Promise<IActionResult> => {
        const configuration = await getRepositories().settings.getContactFormConfiguration()
        const errors: IFieldErrors = {}

        for (const field of configuration.fields) {
            const limit = field.type === 'textarea' ? serviceValidationLimits.message : serviceValidationLimits.name
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
            if (rawValue.length > limit) errors[field.technicalName] = 'Ce champ est trop long.'
            if (
                field.type === 'select' &&
                value &&
                !field.options?.includes(value)
            ) {
                errors[field.technicalName] = 'Veuillez choisir une option valide.'
            }
        }

        if (Object.keys(errors).length > 0) {
            return { success: false, message: 'Le formulaire contient des erreurs.', errors }
        }

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
}
