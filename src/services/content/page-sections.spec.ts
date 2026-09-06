import type { IPageSection } from '@/types'
import { parsePageSectionsFromFormData, validatePageSections } from './page-sections'

describe('parsePageSectionsFromFormData', () => {
    const sections: IPageSection[] = [
        { id: 'hero-1', type: 'hero', title: 'Titre hero', content: 'Intro', order: 1 },
        { id: 'text-1', type: 'text', title: 'Titre texte', content: 'Contenu texte', order: 2 },
        {
            id: 'cta-1',
            type: 'call-to-action',
            title: 'Contact',
            content: 'Écrivez-nous',
            label: 'Nous contacter',
            href: '/contact',
            order: 3,
        },
        {
            id: 'featured-1',
            type: 'featured-articles',
            title: 'À la une',
            articleSlugs: ['article-a'],
            order: 4,
        },
    ]

    it('keeps existing sections when form has no section fields', () => {
        const formData = new FormData()
        formData.set('title', 'Page')
        expect(parsePageSectionsFromFormData(formData, sections)).toEqual(sections)
    })

    it('updates hero, text and call-to-action fields from form data', () => {
        const formData = new FormData()
        formData.set('section-hero-1-title', 'Nouveau hero')
        formData.set('section-hero-1-content', 'Nouvelle intro')
        formData.set('section-text-1-title', 'Nouveau texte')
        formData.set('section-text-1-content', 'Nouveau contenu')
        formData.set('section-cta-1-title', 'Nouveau contact')
        formData.set('section-cta-1-content', 'Nouveau message')
        formData.set('section-cta-1-label', 'Écrire')
        formData.set('section-cta-1-href', '/contact#donnees')

        const result = parsePageSectionsFromFormData(formData, sections)

        expect(result[0]).toMatchObject({
            id: 'hero-1',
            type: 'hero',
            title: 'Nouveau hero',
            content: 'Nouvelle intro',
        })
        expect(result[1]).toMatchObject({
            id: 'text-1',
            type: 'text',
            title: 'Nouveau texte',
            content: 'Nouveau contenu',
        })
        expect(result[2]).toMatchObject({
            id: 'cta-1',
            type: 'call-to-action',
            title: 'Nouveau contact',
            content: 'Nouveau message',
            label: 'Écrire',
            href: '/contact#donnees',
        })
        expect(result[3]).toEqual(sections[3])
    })

    it('updates featured-articles title while keeping article slugs', () => {
        const formData = new FormData()
        formData.set('section-featured-1-title', 'Sélection')

        const result = parsePageSectionsFromFormData(formData, sections)
        expect(result[3]).toEqual({
            ...sections[3],
            title: 'Sélection',
        })
    })
})

describe('validatePageSections', () => {
    it('accepts valid sections', () => {
        expect(
            validatePageSections([
                { id: 'hero-1', type: 'hero', title: 'Titre', content: 'Intro', order: 1 },
                { id: 'text-1', type: 'text', content: 'Contenu', order: 2 },
            ])
        ).toBeUndefined()
    })

    it('rejects empty hero title', () => {
        expect(
            validatePageSections([{ id: 'hero-1', type: 'hero', title: '  ', order: 1 }])
        ).toBe('Le titre d’une section hero est obligatoire.')
    })

    it('rejects empty text content', () => {
        expect(
            validatePageSections([{ id: 'text-1', type: 'text', content: '', order: 1 }])
        ).toBe('Le contenu d’une section texte est obligatoire.')
    })

    it('rejects incomplete call-to-action', () => {
        expect(
            validatePageSections([
                {
                    id: 'cta-1',
                    type: 'call-to-action',
                    title: 'Contact',
                    label: '',
                    href: '/contact',
                    order: 1,
                },
            ])
        ).toBe('Le libellé d’une section d’action est obligatoire.')
    })
})
