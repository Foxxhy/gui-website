export type ITagStyle = 'green' | 'blue' | 'purple' | 'red' | 'yellow'

export const TAG_STYLES: readonly ITagStyle[] = ['green', 'blue', 'purple', 'red', 'yellow']

export interface ITag {
    id: string
    name: string
    slug: string
    style: ITagStyle
    description?: string
}
