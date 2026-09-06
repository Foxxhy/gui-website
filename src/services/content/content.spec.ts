import { articles } from '@/mocks'
import { IStatus } from '@/types'

import { serviceContent } from './content'

describe('serviceContent', () => {
    it('returns published articles', async () => {
        const published = await serviceContent.getPublishedArticles()
        expect(published.every((article) => article.status === IStatus.PUBLISHED)).toBe(true)
    })

    it('paginates published articles', async () => {
        const page = await serviceContent.getPublishedArticlesPage({ page: 1, limit: 1 })
        expect(page.articles).toHaveLength(1)
        expect(page.page).toBe(1)
        expect(page.total).toBeGreaterThanOrEqual(1)
    })

    it('filters articles by search', async () => {
        const page = await serviceContent.getPublishedArticlesPage({
            page: 1,
            limit: 10,
            search: 'Bienvenue',
        })
        expect(page.articles.some((article) => article.slug === 'bienvenue-association')).toBe(
            true
        )
    })

    it('finds articles and pages by identifiers', async () => {
        await expect(serviceContent.getArticleById('article-1')).resolves.toEqual(articles[0])
        await expect(serviceContent.getPublishedArticleBySlug('bienvenue-association')).resolves.toMatchObject({
            id: 'article-1',
        })
        await expect(serviceContent.getPageBySlug('association')).resolves.toMatchObject({
            slug: 'association',
        })
    })

    it('validates article mutations', async () => {
        await expect(
            serviceContent.simulateArticleMutation('Créé.', {
                title: '',
                slug: 'bad slug',
                content: '',
            })
        ).resolves.toMatchObject({ success: false })
    })

    it('accepts a valid article mutation simulation', async () => {
        await expect(
            serviceContent.simulateArticleMutation('Créé.', {
                title: 'Titre',
                slug: 'titre-unique-test',
                content: 'Contenu',
                status: IStatus.DRAFT,
            })
        ).resolves.toMatchObject({ success: true })
    })
})
