export const mongoCollections = {
    users: 'users',
    accounts: 'accounts',
    articles: 'articles',
    tags: 'tags',
    pages: 'pages',
    featureFlags: 'featureFlags',
    contactFormConfigurations: 'contactFormConfigurations',
    contactSubmissions: 'contactSubmissions',
    analyticsEvents: 'analytics_events',
} as const

export type IMongoCollectionName = (typeof mongoCollections)[keyof typeof mongoCollections]
