import { serviceAnalytics } from '@/services/analytics'
import { serviceContact } from './contact'

describe('serviceContact', () => {
    it('returns the contact form configuration with sorted fields', async () => {
        const configuration = await serviceContact.getConfiguration()
        const orders = configuration.fields.map((field) => field.order)
        expect(orders).toEqual([...orders].sort((a, b) => a - b))
    })

    it('returns a contact field by id', async () => {
        await expect(serviceContact.getFieldById('field-name')).resolves.toMatchObject({
            id: 'field-name',
            technicalName: 'name',
        })
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

    it('creates a contact field from admin form data', async () => {
        const formData = new FormData()
        formData.set('technicalName', 'customField')
        formData.set('label', 'Champ personnalisé')
        formData.set('type', 'text')
        formData.set('required', 'true')

        await expect(serviceContact.createField(formData)).resolves.toMatchObject({
            success: true,
            data: expect.objectContaining({
                fields: expect.arrayContaining([
                    expect.objectContaining({
                        technicalName: 'customField',
                        label: 'Champ personnalisé',
                    }),
                ]),
            }),
        })
    })

    it('updates a contact field from admin form data', async () => {
        const formData = new FormData()
        formData.set('id', 'field-name')
        formData.set('technicalName', 'name')
        formData.set('label', 'Nom complet')
        formData.set('type', 'text')
        formData.set('required', 'true')

        await expect(serviceContact.updateField(formData)).resolves.toMatchObject({
            success: true,
            data: expect.objectContaining({
                fields: expect.arrayContaining([
                    expect.objectContaining({
                        id: 'field-name',
                        label: 'Nom complet',
                    }),
                ]),
            }),
        })
    })

    it('deletes a contact field', async () => {
        const createFormData = new FormData()
        createFormData.set('technicalName', 'temporaryField')
        createFormData.set('label', 'Champ temporaire')
        createFormData.set('type', 'text')

        const created = await serviceContact.createField(createFormData)
        const fieldId = created.data?.fields.find((field) => field.technicalName === 'temporaryField')?.id
        if (!fieldId) throw new Error('Champ temporaire introuvable')

        await expect(serviceContact.deleteField(fieldId)).resolves.toMatchObject({ success: true })
        await expect(serviceContact.getFieldById(fieldId)).resolves.toBeUndefined()
    })

    it('reorders a contact field', async () => {
        const configuration = await serviceContact.getConfiguration()
        const secondField = configuration.fields[1]
        const formData = new FormData()
        formData.set('id', secondField.id)
        formData.set('move', 'up')

        await expect(serviceContact.reorderField(secondField.id, 'up')).resolves.toMatchObject({
            success: true,
        })
        await expect(serviceContact.mutateFromAdminForm(formData, 'ordre modifié')).resolves.toMatchObject({
            success: true,
        })
    })
})
