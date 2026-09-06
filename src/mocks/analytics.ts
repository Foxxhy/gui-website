import type { IAnalyticsEvent } from '@/types'

const daysAgo = (days: number, hour: number) => {
    const date = new Date('2026-09-06T00:00:00.000Z')
    date.setUTCDate(date.getUTCDate() - days)
    date.setUTCHours(hour)
    return date.toISOString()
}

export const analyticsEvents: IAnalyticsEvent[] = [
    { id: 'event-1', type: 'page-view', path: '/', timestamp: daysAgo(0, 9) },
    { id: 'event-2', type: 'page-view', path: '/articles', timestamp: daysAgo(0, 9) },
    { id: 'event-3', type: 'article-view', path: '/articles/bienvenue-association', articleId: 'article-1', timestamp: daysAgo(0, 10) },
    { id: 'event-4', type: 'page-view', path: '/articles/bienvenue-association', timestamp: daysAgo(0, 10) },
    { id: 'event-5', type: 'contact-submission', path: '/contact', timestamp: daysAgo(0, 11) },
    { id: 'event-6', type: 'page-view', path: '/association', timestamp: daysAgo(1, 14) },
    { id: 'event-7', type: 'article-view', path: '/articles/atelier-participatif-printemps', articleId: 'article-2', timestamp: daysAgo(1, 15) },
    { id: 'event-8', type: 'page-view', path: '/articles/atelier-participatif-printemps', timestamp: daysAgo(1, 15) },
    { id: 'event-9', type: 'page-view', path: '/', timestamp: daysAgo(2, 8) },
    { id: 'event-10', type: 'article-view', path: '/articles/bienvenue-association', articleId: 'article-1', timestamp: daysAgo(2, 9) },
    { id: 'event-11', type: 'page-view', path: '/articles/bienvenue-association', timestamp: daysAgo(2, 9) },
    { id: 'event-12', type: 'page-view', path: '/contact', timestamp: daysAgo(3, 16) },
    { id: 'event-13', type: 'contact-submission', path: '/contact', timestamp: daysAgo(4, 10) },
    { id: 'event-14', type: 'article-view', path: '/articles/atelier-participatif-printemps', articleId: 'article-2', timestamp: daysAgo(5, 13) },
    { id: 'event-15', type: 'page-view', path: '/articles/atelier-participatif-printemps', timestamp: daysAgo(5, 13) },
    { id: 'event-16', type: 'page-view', path: '/', timestamp: daysAgo(8, 11) },
    { id: 'event-17', type: 'article-view', path: '/articles/bienvenue-association', articleId: 'article-1', timestamp: daysAgo(9, 12) },
    { id: 'event-18', type: 'page-view', path: '/articles/bienvenue-association', timestamp: daysAgo(9, 12) },
    { id: 'event-19', type: 'page-view', path: '/association', timestamp: daysAgo(12, 15) },
    { id: 'event-20', type: 'contact-submission', path: '/contact', timestamp: daysAgo(15, 10) },
    { id: 'event-21', type: 'article-view', path: '/articles/atelier-participatif-printemps', articleId: 'article-2', timestamp: daysAgo(20, 17) },
    { id: 'event-22', type: 'page-view', path: '/articles/atelier-participatif-printemps', timestamp: daysAgo(20, 17) },
    { id: 'event-23', type: 'page-view', path: '/', timestamp: daysAgo(25, 9) },
    { id: 'event-24', type: 'page-view', path: '/articles', timestamp: daysAgo(29, 18) },
]
