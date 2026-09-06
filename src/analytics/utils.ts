import {
    ANALYTICS_EVENT_TYPES,
    type AnalyticsEventType,
    type AnalyticsPeriod,
    type IAnalyticsPeriodRange,
} from '@/types'

const periodLabels: Record<AnalyticsPeriod, string> = {
    today: 'Aujourd’hui',
    '7days': '7 derniers jours',
    '30days': '30 derniers jours',
}

export const analyticsGetPeriodRange = (period: AnalyticsPeriod, now = new Date()): IAnalyticsPeriodRange => {
    const end = new Date(now)
    const start = new Date(now)
    if (period === 'today') {
        start.setHours(0, 0, 0, 0)
    } else {
        start.setDate(start.getDate() - (period === '7days' ? 6 : 29))
        start.setHours(0, 0, 0, 0)
    }
    return { key: period, label: periodLabels[period], start, end }
}

export const analyticsIsKnownEventType = (value: string): value is AnalyticsEventType =>
    ANALYTICS_EVENT_TYPES.includes(value as AnalyticsEventType)

export const analyticsFormatAnalyticsName = (name: string): AnalyticsEventType => {
    const formatted = name.trim().toLocaleLowerCase('fr-FR').replace(/[_\s]+/g, '-')
    if (!analyticsIsKnownEventType(formatted)) {
        throw new Error(`Type d’événement analytics inconnu : ${name}`)
    }
    return formatted
}
