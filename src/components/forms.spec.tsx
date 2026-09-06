/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { IContactFieldType, type IContactFormConfiguration } from '@/types'
import { ContactForm, LoginForm } from './forms'

jest.mock('@/actions', () => ({
    actionSubmitContact: jest.fn(),
    actionLogin: jest.fn(),
}))

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

describe('ContactForm', () => {
    it('renders configured fields and a required consent checkbox', () => {
        render(<ContactForm configuration={configuration} />)

        expect(screen.getByText(/Nom/)).toBeInTheDocument()
        expect(screen.getByRole('textbox')).toBeInTheDocument()
        expect(screen.getByRole('checkbox', { name: /J’accepte que mon témoignage/ })).toBeRequired()
        expect(screen.getByRole('button', { name: 'Envoyer' })).toBeInTheDocument()
    })
})

describe('LoginForm', () => {
    it('renders required login fields', () => {
        render(<LoginForm returnTo="/administration" />)

        expect(screen.getByLabelText('Identifiant')).toBeRequired()
        expect(screen.getByLabelText('Mot de passe')).toBeRequired()
        expect(screen.getByRole('button', { name: 'Connexion' })).toBeInTheDocument()
    })
})
