import { mockStore } from '@/repositories/mock-store'
import { IStatus } from '@/types'
import { serviceContent } from './content'

describe('serviceContent', () => {
    beforeEach(() => {
        mockStore.reset()
    })

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

    it('filters articles by tag slugs', async () => {
        const page = await serviceContent.getPublishedArticlesPage({
            page: 1,
            limit: 10,
            tagSlugs: ['association'],
        })
        expect(page.articles.length).toBeGreaterThan(0)
        expect(page.articles.every((article) => article.tags?.some((tag) => tag.slug === 'association'))).toBe(true)
    })

    it('finds articles and pages by identifiers', async () => {
        await expect(serviceContent.getArticleById('article-1')).resolves.toMatchObject({
            id: 'article-1',
        })
        await expect(serviceContent.getPublishedArticleBySlug('bienvenue-association')).resolves.toMatchObject({
            id: 'article-1',
        })
        await expect(serviceContent.getPageBySlug('association')).resolves.toMatchObject({
            slug: 'association',
        })
    })

    it('rejects invalid article mutations', async () => {
        await expect(
            serviceContent.createArticle(
                {
                    title: '',
                    slug: 'bad slug',
                    content: '',
                },
                mockStore.getSnapshot().users[0]
            )
        ).resolves.toMatchObject({ success: false })
    })

    it('creates a valid article', async () => {
        const author = mockStore.getSnapshot().users[0]
        await expect(
            serviceContent.createArticle(
                {
                    title: 'Titre',
                    slug: 'titre-unique-test',
                    content: 'Contenu',
                    status: IStatus.DRAFT,
                },
                author
            )
        ).resolves.toMatchObject({ success: true })
    })

    it('updates a page', async () => {
        await expect(
            serviceContent.updatePage('page-association', {
                title: 'Association modifiée',
                content: 'Contenu mis à jour',
            })
        ).resolves.toMatchObject({ success: true })
    })
})
