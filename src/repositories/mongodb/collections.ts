export const mongoCollections = {
    users: 'users',
    accounts: 'accounts',
    articles: 'articles',
    tags: 'tags',
    featureFlags: 'featureFlags',
    contactFormConfigurations: 'contactFormConfigurations',
    contactSubmissions: 'contactSubmissions',
    analyticsEvents: 'analyticsEvents',
    pages: 'pages',
} as const

export type IMongoCollectionName = (typeof mongoCollections)[keyof typeof mongoCollections]
