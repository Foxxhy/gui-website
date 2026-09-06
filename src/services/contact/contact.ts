import { repositoryContact } from '@/repositories'
import { serviceAnalytics } from '@/services/analytics'
import { serviceValidationLimits, serviceIsValidEmail, serviceToTrimmedString } from '@/services/validation'
import type {
    IActionResult,
    IContactFormConfiguration,
    IFieldErrors,
} from '@/types'

export const serviceContact = {
    getConfiguration: async (): Promise<IContactFormConfiguration> =>
        repositoryContact.getConfiguration(),
    submit: async (formData: FormData): Promise<IActionResult> => {
        const configuration = repositoryContact.getConfiguration()
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

        const submission = Object.fromEntries(
            configuration.fields.map((field) => [
                field.technicalName,
                serviceToTrimmedString(formData.get(field.technicalName), serviceValidationLimits.message),
            ])
        )
        repositoryContact.saveSubmission(submission)
        serviceAnalytics.trackEvent('contact-submission', '/contact')

        return {
            success: true,
            message: 'Votre message a été enregistré. Aucun e-mail n’a été envoyé.',
        }
    },
    updateConfiguration: async (
        values: Partial<IContactFormConfiguration>
    ): Promise<IActionResult<IContactFormConfiguration>> =>
        repositoryContact.updateConfiguration(values),
}
