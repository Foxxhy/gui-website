import { MongoClient } from 'mongodb'

import { IRole, IStatus } from '@/types'

import { mongoArticleRepository } from './articles.mongodb'
import { mongoCollections } from './collections'
import { mongoTagRepository } from './tags.mongodb'
import { mongoUserRepository } from './users.mongodb'

const describeIntegration = process.env.MONGODB_URI ? describe : describe.skip

describeIntegration('mongoArticleRepository integration', () => {
    const suffix = Date.now()
    const authorId = `user-article-${suffix}`
    const tagId = `tag-article-${suffix}`
    const articleId = `article-integration-${suffix}`

    afterAll(async () => {
        if (!process.env.MONGODB_URI) return
        const client = new MongoClient(process.env.MONGODB_URI)
        await client.connect()
        const db = client.db(process.env.MONGODB_DB_NAME?.trim() || 'gui-website-dev')
        await db.collection(mongoCollections.articles).deleteOne({ _id: articleId })
        await db.collection(mongoCollections.tags).deleteOne({ _id: tagId })
        await db.collection(mongoCollections.users).deleteOne({ _id: authorId })
        await client.close()
    })

    it('persists authorId and tagIds then populates on read', async () => {
        const now = new Date().toISOString()
        await mongoUserRepository.createUser({
            id: authorId,
            name: 'Auteur test',
            email: `author-${suffix}@association.test`,
            pseudonym: 'Auteur',
            role: IRole.EDITOR,
            createdAt: now,
            updatedAt: now,
        })
        await mongoTagRepository.create({
            id: tagId,
            name: 'Tag test',
            slug: `tag-test-${suffix}`,
            style: 'green',
        })

        await mongoArticleRepository.create({
            id: articleId,
            title: 'Article intégration',
            slug: `article-integration-${suffix}`,
            content: 'Contenu de test',
            status: IStatus.PUBLISHED,
            author: {
                id: authorId,
                name: 'Auteur test',
                email: `author-${suffix}@association.test`,
                pseudonym: 'Auteur',
                role: IRole.EDITOR,
                createdAt: now,
                updatedAt: now,
            },
            tags: [{
                id: tagId,
                name: 'Tag test',
                slug: `tag-test-${suffix}`,
                style: 'green',
            }],
            createdAt: now,
            updatedAt: now,
            publishedAt: now,
        })

        const stored = await mongoArticleRepository.findById(articleId)
        expect(stored?.author?.id).toBe(authorId)
        expect(stored?.tags?.map((tag) => tag.id)).toEqual([tagId])
    })
})
