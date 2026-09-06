import type {
    IAnalyticsEvent,
    IArticle,
    IContactFormConfiguration,
    IContactSubmission,
    IFeatureFlags,
    IPage,
    ITag,
    IUser,
    IUserCredentials,
} from '@/types'

import { mongoCollections } from './collections'
import {
    CONTACT_FORM_DOCUMENT_ID,
    FEATURE_FLAGS_DOCUMENT_ID,
    type IAccountDocument,
    type IAnalyticsEventDocument,
    type IArticleDocument,
    type IContactFormDocument,
    type IContactSubmissionDocument,
    type IFeatureFlagsDocument,
    type IPageDocument,
    type ITagDocument,
    type IUserDocument,
} from './documents'
import { getMongoDatabase } from './database'

export const mapUserDocumentToUser = (document: IUserDocument): IUser => ({
    id: document._id,
    name: document.name,
    email: document.email,
    pseudonym: document.pseudonym,
    role: document.role,
    avatar: document.avatar,
    sessionVersion: document.sessionVersion,
    createdAt: document.createdAt,
    updatedAt: document.updatedAt,
})

export const mapUserToUserDocument = (user: IUser): IUserDocument => ({
    _id: user.id,
    name: user.name,
    email: user.email,
    pseudonym: user.pseudonym,
    role: user.role,
    avatar: user.avatar,
    sessionVersion: user.sessionVersion,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
})

export const mapAccountDocumentToCredentials = (document: IAccountDocument): IUserCredentials => ({
    userId: document.userId,
    login: document.login,
    passwordHash: document.passwordHash,
})

export const mapCredentialsToAccountDocument = (credentials: IUserCredentials): IAccountDocument => ({
    _id: `account-${credentials.userId}`,
    userId: credentials.userId,
    login: credentials.login,
    passwordHash: credentials.passwordHash,
})

export const mapTagDocumentToTag = (document: ITagDocument): ITag => ({
    id: document._id,
    name: document.name,
    slug: document.slug,
    style: document.style as ITag['style'],
    description: document.description,
})

export const mapTagToTagDocument = (tag: ITag): ITagDocument => ({
    _id: tag.id,
    name: tag.name,
    slug: tag.slug,
    style: tag.style,
    description: tag.description,
})

export const mapPageDocumentToPage = (document: IPageDocument): IPage => ({
    id: document._id,
    title: document.title,
    slug: document.slug,
    description: document.description,
    content: document.content,
    sections: document.sections,
    featuredImage: document.featuredImage,
    publishedAt: document.publishedAt,
    seo: document.seo,
    createdAt: document.createdAt,
    updatedAt: document.updatedAt,
})

export const mapPageToPageDocument = (page: IPage): IPageDocument => ({
    _id: page.id,
    title: page.title,
    slug: page.slug,
    description: page.description,
    content: page.content,
    sections: page.sections,
    featuredImage: page.featuredImage,
    publishedAt: page.publishedAt,
    seo: page.seo,
    createdAt: page.createdAt,
    updatedAt: page.updatedAt,
})

export const mapFeatureFlagsDocument = (document: IFeatureFlagsDocument): IFeatureFlags => ({
    home: document.home,
    articles: document.articles,
    contact: document.contact,
})

export const mapContactFormDocument = (document: IContactFormDocument): IContactFormConfiguration => ({
    id: document._id,
    title: document.title,
    description: document.description,
    fields: [...document.fields].sort((first, second) => first.order - second.order),
})

export const mapContactSubmissionDocument = (document: IContactSubmissionDocument): IContactSubmission => ({
    id: document._id,
    values: document.values,
    submittedAt: document.submittedAt,
})

export const mapAnalyticsEventDocument = (document: IAnalyticsEventDocument): IAnalyticsEvent => ({
    id: document._id,
    type: document.type,
    path: document.path,
    articleId: document.articleId,
    timestamp: document.timestamp.toISOString(),
})

export const mapAnalyticsEventToDocument = (event: IAnalyticsEvent): IAnalyticsEventDocument => ({
    _id: event.id,
    type: event.type,
    path: event.path,
    articleId: event.articleId,
    timestamp: new Date(event.timestamp),
})

export const mapArticleToDocument = (article: IArticle): IArticleDocument => ({
    _id: article.id,
    title: article.title,
    slug: article.slug,
    description: article.description,
    content: article.content,
    cover: article.cover,
    category: article.category,
    authorId: article.author?.id,
    tagIds: article.tags?.map((tag) => tag.id),
    status: article.status,
    seo: article.seo,
    link: article.link,
    publishedAt: article.publishedAt,
    featured: article.featured,
    createdAt: article.createdAt,
    updatedAt: article.updatedAt,
})

export const mapPartialArticleToDocument = (values: Partial<IArticle>): Partial<IArticleDocument> => {
    const document: Partial<IArticleDocument> = {
        title: values.title,
        slug: values.slug,
        description: values.description,
        content: values.content,
        cover: values.cover,
        category: values.category,
        status: values.status,
        seo: values.seo,
        link: values.link,
        publishedAt: values.publishedAt,
        featured: values.featured,
        createdAt: values.createdAt,
        updatedAt: values.updatedAt,
    }

    if (values.author !== undefined) {
        document.authorId = values.author?.id
    }
    if (values.tags !== undefined) {
        document.tagIds = values.tags?.map((tag) => tag.id)
    }

    return document
}

const mapArticleDocumentWithRelations = (
    document: IArticleDocument,
    usersById: Map<string, IUser>,
    tagsById: Map<string, ITag>,
): IArticle => ({
    id: document._id,
    title: document.title,
    slug: document.slug,
    description: document.description,
    content: document.content,
    cover: document.cover,
    category: document.category,
    author: document.authorId ? usersById.get(document.authorId) : undefined,
    tags: document.tagIds
        ?.map((tagId) => tagsById.get(tagId))
        .filter((tag): tag is ITag => tag !== undefined),
    status: document.status,
    seo: document.seo,
    link: document.link,
    publishedAt: document.publishedAt,
    featured: document.featured,
    createdAt: document.createdAt,
    updatedAt: document.updatedAt,
})

const collectArticleRelationIds = (documents: IArticleDocument[]) => {
    const authorIds = new Set<string>()
    const tagIds = new Set<string>()

    for (const document of documents) {
        if (document.authorId) authorIds.add(document.authorId)
        for (const tagId of document.tagIds ?? []) tagIds.add(tagId)
    }

    return { authorIds: [...authorIds], tagIds: [...tagIds] }
}

const fetchUsersById = async (authorIds: string[]): Promise<Map<string, IUser>> => {
    const usersById = new Map<string, IUser>()
    if (authorIds.length === 0) return usersById

    const database = await getMongoDatabase()
    const documents = await database
        .collection<IUserDocument>(mongoCollections.users)
        .find({ _id: { $in: authorIds } })
        .toArray()

    for (const document of documents) {
        usersById.set(document._id, mapUserDocumentToUser(document))
    }

    return usersById
}

const fetchTagsById = async (tagIds: string[]): Promise<Map<string, ITag>> => {
    const tagsById = new Map<string, ITag>()
    if (tagIds.length === 0) return tagsById

    const database = await getMongoDatabase()
    const documents = await database
        .collection<ITagDocument>(mongoCollections.tags)
        .find({ _id: { $in: tagIds } })
        .toArray()

    for (const document of documents) {
        tagsById.set(document._id, mapTagDocumentToTag(document))
    }

    return tagsById
}

export const populateArticles = async (documents: IArticleDocument[]): Promise<IArticle[]> => {
    const { authorIds, tagIds } = collectArticleRelationIds(documents)
    const [usersById, tagsById] = await Promise.all([fetchUsersById(authorIds), fetchTagsById(tagIds)])

    return documents.map((document) => mapArticleDocumentWithRelations(document, usersById, tagsById))
}

export const populateArticle = async (document: IArticleDocument | null | undefined): Promise<IArticle | undefined> => {
    if (!document) return undefined
    const [article] = await populateArticles([document])
    return article
}

export const defaultFeatureFlags = (): IFeatureFlagsDocument => ({
    _id: FEATURE_FLAGS_DOCUMENT_ID,
    home: true,
    articles: true,
    contact: true,
})

export const defaultContactFormDocument = (): IContactFormDocument => ({
    _id: CONTACT_FORM_DOCUMENT_ID,
    title: 'Contact',
    description: undefined,
    fields: [],
})
