import {
    articles as seedArticles,
    contactFormConfiguration as seedContactFormConfiguration,
    featureFlags as seedFeatureFlags,
    pages as seedPages,
    tags as seedTags,
    users as seedUsers,
} from '@/mocks/data'
import { analyticsEvents as seedAnalyticsEvents } from '@/mocks/analytics'
import { hashPassword } from '@/services/auth/password'
import { IRole, type IAccount, type IAnalyticsEvent, type IArticle, type IContactFormConfiguration, type IFeatureFlags, type IPage, type ITag, type IUser } from '@/types'

export interface IMockStoreSnapshot {
    users: IUser[]
    accounts: IAccount[]
    tags: ITag[]
    articles: IArticle[]
    pages: IPage[]
    contactFormConfiguration: IContactFormConfiguration
    featureFlags: IFeatureFlags
    analyticsEvents: IAnalyticsEvent[]
    contactSubmissions: Record<string, string>[]
}

const clone = <T>(value: T): T => structuredClone(value)

const createSeedAccounts = (): IAccount[] => [
    {
        id: 'account-admin',
        userId: 'user-admin',
        login: 'admin',
        passwordHash: hashPassword('admin'),
    },
    {
        id: 'account-editor',
        userId: 'user-editor',
        login: 'editor',
        passwordHash: hashPassword('editor'),
    },
]

const createSeedSnapshot = (): IMockStoreSnapshot => ({
    users: clone(seedUsers),
    accounts: createSeedAccounts(),
    tags: clone(seedTags),
    articles: clone(seedArticles),
    pages: clone(seedPages),
    contactFormConfiguration: clone(seedContactFormConfiguration),
    featureFlags: clone(seedFeatureFlags),
    analyticsEvents: clone(seedAnalyticsEvents),
    contactSubmissions: [],
})

let store: IMockStoreSnapshot = createSeedSnapshot()

export const mockStore = {
    getSnapshot: (): IMockStoreSnapshot => store,
    reset: (): void => {
        store = createSeedSnapshot()
    },
    replace: (snapshot: IMockStoreSnapshot): void => {
        store = clone(snapshot)
    },
}

export const mockStoreSync = {
    getUserById: (id: string): IUser | undefined =>
        store.users.find((user) => user.id === id),
    isSessionAllowed: (userId: string): boolean => {
        const user = mockStoreSync.getUserById(userId)
        return Boolean(user && user.role !== IRole.BLOCKED)
    },
}
