import { articles, tags } from '@/mocks'

import { serviceTag } from './tags'

describe('serviceTag', () => {
    const snapshot = () => structuredClone(tags)
    const articlesSnapshot = () =>
        articles.map((article) => ({
            id: article.id,
            tags: article.tags ? structuredClone(article.tags) : undefined,
        }))

    let tagsBackup: ReturnType<typeof snapshot>
    let articlesBackup: ReturnType<typeof articlesSnapshot>

    beforeEach(() => {
        tagsBackup = snapshot()
        articlesBackup = articlesSnapshot()
    })

    afterEach(() => {
        tags.length = 0
        tags.push(...tagsBackup)
        for (const article of articles) {
            const backup = articlesBackup.find((item) => item.id === article.id)
            article.tags = backup?.tags
        }
    })

    it('lists and finds tags', async () => {
        await expect(serviceTag.getTags()).resolves.toBe(tags)
        await expect(serviceTag.getTagById('tag-association')).resolves.toMatchObject({
            slug: 'association',
        })
    })

    it('creates a tag', async () => {
        const result = await serviceTag.createTag({
            name: 'Nouveau',
            slug: 'nouveau',
            style: 'red',
            description: 'Un tag de test',
        })
        expect(result.success).toBe(true)
        expect(tags.some((tag) => tag.slug === 'nouveau')).toBe(true)
    })

    it('rejects invalid tag creation', async () => {
        await expect(
            serviceTag.createTag({ name: '', slug: '', style: 'invalid' })
        ).resolves.toMatchObject({ success: false })
    })

    it('updates and deletes a tag', async () => {
        const created = await serviceTag.createTag({
            name: 'Temporaire',
            slug: 'temporaire',
            style: 'yellow',
        })
        const id = created.data?.id
        expect(id).toBeDefined()

        await expect(
            serviceTag.updateTag(id as string, {
                name: 'Temporaire modifié',
                slug: 'temporaire',
                style: 'blue',
            })
        ).resolves.toMatchObject({ success: true })

        await expect(serviceTag.deleteTag(id as string)).resolves.toMatchObject({ success: true })
        expect(tags.some((tag) => tag.id === id)).toBe(false)
    })
})
