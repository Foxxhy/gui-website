import { tags } from '@/mocks'

import { serviceTag } from './tags'

describe('serviceTag', () => {
    const snapshot = () => structuredClone(tags)

    let tagsBackup: ReturnType<typeof snapshot>

    beforeEach(() => {
        tagsBackup = snapshot()
    })

    afterEach(() => {
        tags.length = 0
        tags.push(...tagsBackup)
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
})
