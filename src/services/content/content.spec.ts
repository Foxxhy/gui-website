import { articles, users } from '@/mocks'
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
})
