import { articles, pages, users } from '@/mocks'
import { IStatus } from '@/types'
import { serviceContent } from './content'

describe('serviceContent', () => {
    it('returns published articles', async () => {
        const published = await serviceContent.getPublishedArticles()
        expect(published.every((article) => article.status === IStatus.PUBLISHED)).toBe(true)
    })

    it('creates a valid article', async () => {
        const initialLength = articles.length
        await expect(
            serviceContent.createArticle(
                {
                    title: 'Titre',
                    slug: 'titre-unique-test',
                    content: 'Contenu',
                    status: IStatus.DRAFT,
                },
                users[0]
            )
        ).resolves.toMatchObject({ success: true })
        expect(articles.length).toBe(initialLength + 1)
    })

    it('returns the gestion des données page by slug', async () => {
        const page = await serviceContent.getPageBySlug('gestion-des-donnees')
        expect(page).toMatchObject({
            id: 'page-gestion-donnees',
            title: 'Gestion des données',
            slug: 'gestion-des-donnees',
        })
        expect(page?.sections.some((section) => section.id === 'data-analytics')).toBe(true)
        expect(page?.sections.some((section) => section.id === 'data-contact-cta')).toBe(true)
    })

    it('returns a page by id', async () => {
        await expect(serviceContent.getPageById('page-gestion-donnees')).resolves.toMatchObject({
            slug: 'gestion-des-donnees',
        })
    })

    it('updates a page including its sections', async () => {
        const page = pages.find((candidate) => candidate.id === 'page-gestion-donnees')
        expect(page).toBeDefined()
        if (!page) return

        const updatedSections = page.sections.map((section) =>
            section.id === 'data-hero'
                ? { ...section, title: 'Données personnelles', content: 'Texte mis à jour.' }
                : section
        )

        const result = await serviceContent.updatePage(page.id, {
            title: 'Gestion des données',
            content: page.content,
            sections: updatedSections,
        })

        expect(result).toMatchObject({ success: true, message: 'Page enregistrée.' })
        const refreshed = await serviceContent.getPageBySlug('gestion-des-donnees')
        expect(refreshed?.sections.find((section) => section.id === 'data-hero')).toMatchObject({
            title: 'Données personnelles',
            content: 'Texte mis à jour.',
        })
    })
})
