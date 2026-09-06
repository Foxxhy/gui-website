export const mongoCollections = {
    users: 'users',
    articles: 'articles',
    tags: 'tags',
    settings: 'settings',
    analyticsEvents: 'analytics_events',
    pages: 'pages',
} as const

export type IMongoCollectionName = (typeof mongoCollections)[keyof typeof mongoCollections]
