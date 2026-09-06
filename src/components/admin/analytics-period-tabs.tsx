'use client'

import { useRouter } from 'next/navigation'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { AnalyticsPeriod } from '@/types'

const periods: AnalyticsPeriod[] = ['today', '7days', '30days']

const periodLabels: Record<AnalyticsPeriod, string> = {
    today: 'Aujourd’hui',
    '7days': '7 derniers jours',
    '30days': '30 derniers jours',
}

export const AnalyticsPeriodTabs = ({ period }: { period: AnalyticsPeriod }) => {
    const router = useRouter()

    return (
        <Tabs
            onValueChange={(value) => {
                router.push(`/administration/analytics?period=${value}`)
            }}
            value={period}
        >
            <TabsList>
                {periods.map((candidate) => (
                    <TabsTrigger key={candidate} value={candidate}>
                        {periodLabels[candidate]}
                    </TabsTrigger>
                ))}
            </TabsList>
        </Tabs>
    )
}
