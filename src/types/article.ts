import type { ISeo, IFeatured } from './page'
import type { ILink } from './link'
import type { IMedia } from './media'
import type { IUser } from './user'
import type { ICategory } from './category'
import type { ITag } from './tag'

export enum IStatus {
    DRAFT = 'draft',
    PUBLISHED = 'published',
    CANCELLED = 'cancelled',
}

export interface IFilter {
    id: string
    name: string
    slug: string
    description?: string
    type: ICategory
}

export interface IArticle {
    id: string
    title: string
    slug: string
    description?: string
    content: string
    cover?: IMedia
    category?: ICategory
    tags?: ITag[]
    author?: IUser
    status: IStatus
    seo?: ISeo
    link?: ILink[]
    publishedAt?: string
    featured?: IFeatured['featureFlag']
    createdAt: string
    updatedAt: string
}