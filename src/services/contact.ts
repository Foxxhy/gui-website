import { contactFormConfiguration } from '@/mocks'
import type {
    IActionResult,
    IContactField,
    IContactFormConfiguration,
    IFieldErrors,
} from '@/types'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const sortedFields = (fields: IContactField[]) =>
    [...fields].sort((first, second) => first.order - second.order)

export const contactService = {
    getConfiguration: async (): Promise<IContactFormConfiguration> => ({
        ...contactFormConfiguration,
        fields: sortedFields(contactFormConfiguration.fields),
    }),
    submit: async (formData: FormData): Promise<IActionResult> => {
        const errors: IFieldErrors = {}

        for (const field of contactFormConfiguration.fields) {
            const value = String(formData.get(field.technicalName) ?? '').trim()
            if (field.required && !value) {
                errors[field.technicalName] = 'Ce champ est obligatoire.'
            }
            if (field.type === 'email' && value && !emailPattern.test(value)) {
                errors[field.technicalName] = 'Veuillez saisir une adresse e-mail valide.'
            }
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

        return {
            success: true,
            message: 'Votre message a été enregistré par la simulation. Aucun e-mail n’a été envoyé.',
        }
    },
    simulateConfigurationMutation: async (): Promise<IActionResult> => ({
        success: true,
        message: 'Configuration mise à jour dans la simulation. Elle sera réinitialisée au rechargement.',
    }),
}