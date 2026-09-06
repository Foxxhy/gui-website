import type { IActionResult, ITag } from '@/types'

export type ITagInput = Pick<ITag, 'name' | 'slug' | 'style'> & Pick<ITag, 'description'>

export interface ITagRepository {
    findAll(): ITag[]
    findById(id: string): ITag | undefined
    findBySlug(slug: string): ITag | undefined
    create(values: Partial<ITagInput>): IActionResult<ITag>
    update(id: string, values: Partial<ITagInput>): IActionResult<ITag>
    delete(id: string): IActionResult
}
