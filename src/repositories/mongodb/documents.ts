import type {
    AnalyticsEventType,
    ICategory,
    IContactField,
    IFeatureFlags,
    IRole,
    IStatus,
} from '@/types'
import type { ILink } from '@/types/link'
import type { IMedia } from '@/types/media'
import type { IPageSection, ISeo } from '@/types/page'

export const FEATURE_FLAGS_DOCUMENT_ID = 'featureFlags'
export const CONTACT_FORM_DOCUMENT_ID = 'contactForm'

export interface IUserDocument {
    _id: string
    name: string
    email: string
    pseudonym: string
    role: IRole
    avatar?: IMedia
    sessionVersion: number
    createdAt: string
    updatedAt: string
}

export interface IAccountDocument {
    _id: string
    userId: string
    login: string
    passwordHash: string
}

export interface IArticleDocument {
    _id: string
    title: string
    slug: string
    description?: string
    content: string
    cover?: IMedia
    category?: ICategory
    authorId?: string
    tagIds?: string[]
    status: IStatus
    seo?: ISeo
    link?: ILink[]
    publishedAt?: string
    featured?: boolean
    createdAt: string
    updatedAt: string
}

export interface ITagDocument {
    _id: string
    name: string
    slug: string
    style: string
    description?: string
}

export interface IPageDocument {
    _id: string
    title: string
    slug: string
    description?: string
    content: string
    sections: IPageSection[]
    featuredImage?: IMedia
    publishedAt?: string
    seo: ISeo
    createdAt: string
    updatedAt: string
}

export interface IFeatureFlagsDocument extends IFeatureFlags {
    _id: typeof FEATURE_FLAGS_DOCUMENT_ID
}

export interface IContactFormDocument {
    _id: typeof CONTACT_FORM_DOCUMENT_ID
    title: string
    description?: string
    fields: IContactField[]
}

export interface IContactSubmissionDocument {
    _id: string
    values: Record<string, string>
    submittedAt: string
}

export interface IAnalyticsEventDocument {
    _id: string
    type: AnalyticsEventType
    path: string
    articleId?: string
    timestamp: Date
}
