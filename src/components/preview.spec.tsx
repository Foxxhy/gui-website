/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { IContactFieldType, type IContactFormConfiguration } from '@/types'
import { AdminPreview } from './preview'

describe('AdminPreview', () => {
    const configuration: IContactFormConfiguration = {
        id: 'contact-form',
        title: 'Témoigner',
        fields: [
            {
                id: 'field-name',
                technicalName: 'name',
                label: 'Nom',
                type: IContactFieldType.TEXT,
                required: true,
                order: 1,
            },
        ],
    }

    it('renders a contact form preview with updated field values', () => {
        const values = new FormData()
        values.set('label', 'Nom affiché')
        values.set('technicalName', 'name')
        values.set('type', 'text')
        values.set('required', 'true')

        render(
            <AdminPreview
                onClose={() => undefined}
                preview={{ kind: 'contactForm', configuration, fieldId: 'field-name' }}
                values={values}
            />
        )

        expect(screen.getByText(/Nom affiché/)).toBeInTheDocument()
        expect(screen.getByRole('textbox')).toBeDisabled()
    })

    it('renders a tag preview with the submitted name', () => {
        const values = new FormData()
        values.set('name', 'Solidarité')
        values.set('slug', 'solidarite')
        values.set('style', 'green')

        render(
            <AdminPreview
                onClose={() => undefined}
                preview={{
                    kind: 'tag',
                    tag: {
                        id: 'tag-1',
                        name: 'Ancien',
                        slug: 'ancien',
                        style: 'green',
                    },
                }}
                values={values}
            />
        )

        expect(screen.getByText('Solidarité')).toBeInTheDocument()
    })
})
