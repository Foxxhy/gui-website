import { mockStore } from '@/repositories/mock-store'
import { serviceTag } from './tags'

describe('serviceTag', () => {
    beforeEach(() => {
        mockStore.reset()
    })

    it('lists and finds tags', async () => {
        await expect(serviceTag.getTags()).resolves.toHaveLength(3)
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
        await expect(serviceTag.getTags()).resolves.toEqual(
            expect.arrayContaining([expect.objectContaining({ slug: 'nouveau' })])
        )
    })

    it('rejects invalid tag creation', async () => {
        await expect(
            serviceTag.createTag({ name: '', slug: '', style: 'invalid' as 'green' })
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
        await expect(serviceTag.getTagById(id as string)).resolves.toBeUndefined()
    })
})
