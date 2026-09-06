import { serviceAnalytics } from '@/services/analytics'
import { serviceContact } from './contact'

describe('serviceContact', () => {
    it('returns the contact form configuration with sorted fields', async () => {
        const configuration = await serviceContact.getConfiguration()
        const orders = configuration.fields.map((field) => field.order)
        expect(orders).toEqual([...orders].sort((a, b) => a - b))
    })

    it('rejects an incomplete submission', async () => {
        const formData = new FormData()
        await expect(serviceContact.submit(formData)).resolves.toMatchObject({
            success: false,
            message: 'Le formulaire contient des erreurs.',
        })
    })

    it('accepts a valid submission and tracks analytics', async () => {
        const trackEvent = jest.spyOn(serviceAnalytics, 'trackEvent')
        const configuration = await serviceContact.getConfiguration()
        const formData = new FormData()

        for (const field of configuration.fields) {
            if (field.type === 'email') {
                formData.set(field.technicalName, 'visiteur@example.org')
            } else if (field.type === 'select' && field.options?.[0]) {
                formData.set(field.technicalName, field.options[0])
            } else {
                formData.set(field.technicalName, 'Valeur de test')
            }
        }

        await expect(serviceContact.submit(formData)).resolves.toMatchObject({
            success: true,
        })
        expect(trackEvent).toHaveBeenCalledWith('contact-submission', '/contact')
        trackEvent.mockRestore()
    })

    it('simulates a configuration mutation', async () => {
        await expect(serviceContact.simulateConfigurationMutation()).resolves.toMatchObject({
            success: true,
        })
    })
})
