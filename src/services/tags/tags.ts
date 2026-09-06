import { repositoryTag } from '@/repositories'
import type { IActionResult, ITag } from '@/types'
import type { ITagInput } from '@/repositories/tags'

export const serviceTag = {
    getTags: async (): Promise<ITag[]> => repositoryTag.findAll(),
    getTagById: async (id: string): Promise<ITag | undefined> => repositoryTag.findById(id),
    createTag: async (values: Partial<ITagInput>): Promise<IActionResult<ITag>> =>
        repositoryTag.create(values),
    updateTag: async (id: string, values: Partial<ITagInput>): Promise<IActionResult<ITag>> =>
        repositoryTag.update(id, values),
    deleteTag: async (id: string): Promise<IActionResult> => repositoryTag.delete(id),
}
