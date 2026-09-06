import { serviceAnalytics } from '@/services/analytics'
import { serviceContact } from './contact'

describe('serviceContact', () => {
    it('returns the contact form configuration with sorted fields', async () => {
        const configuration = await serviceContact.getConfiguration()
        const orders = configuration.fields.map((field) => field.order)
        expect(orders).toEqual([...orders].sort((a, b) => a - b))
    })

    it('accepts a valid submission and tracks analytics', async () => {
        const trackEvent = jest.spyOn(serviceAnalytics, 'trackEvent')
        const configuration = await serviceContact.getConfiguration()
        const formData = new FormData()

        for (const field of configuration.fields) {
            if (field.type === 'email') {
                formData.set(field.technicalName, 'visiteur@example.org')
            } else if (field.type === 'tel') {
                formData.set(field.technicalName, '06 12 34 56 78')
            } else if (field.type === 'select' && field.options?.[0]) {
                formData.set(field.technicalName, field.options[0])
            } else {
                formData.set(field.technicalName, 'Valeur de test')
            }
        }
        formData.set('consent', 'on')

        await expect(serviceContact.submit(formData)).resolves.toMatchObject({ success: true })
        expect(trackEvent).toHaveBeenCalledWith('contact-submission', '/contact')
        trackEvent.mockRestore()
    })

    it('rejects a submission without consent', async () => {
        const configuration = await serviceContact.getConfiguration()
        const formData = new FormData()

        for (const field of configuration.fields) {
            if (field.type === 'email') {
                formData.set(field.technicalName, 'visiteur@example.org')
            } else if (field.type === 'select' && field.options?.[0]) {
                formData.set(field.technicalName, field.options[0])
            } else if (field.type !== 'tel') {
                formData.set(field.technicalName, 'Valeur de test')
            } else {
                formData.set(field.technicalName, '')
            }
        }

        await expect(serviceContact.submit(formData)).resolves.toMatchObject({
            success: false,
            errors: expect.objectContaining({
                consent: expect.any(String),
            }),
        })
    })

    it('updates configuration', async () => {
        await expect(
            serviceContact.updateConfiguration({ title: 'Nouveau titre' })
        ).resolves.toMatchObject({
            success: true,
            data: { title: 'Nouveau titre' },
        })
    })
})
