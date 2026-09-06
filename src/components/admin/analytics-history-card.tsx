'use client'

import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from '@/components/ui/chart'
import type { IAnalyticsStats } from '@/types'

const chartConfig = {
    count: {
        label: 'Consultations',
    },
} satisfies ChartConfig

export const AnalyticsHistoryCard = ({ stats }: { stats: IAnalyticsStats }) => (
    <Card>
        <CardHeader>
            <CardTitle>Historique d’activité</CardTitle>
            <CardDescription>{stats.period.label}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <ChartContainer className="h-40 w-full aspect-auto" config={chartConfig}>
                <BarChart accessibilityLayer data={stats.timeline}>
                    <CartesianGrid vertical={false} />
                    <XAxis
                        axisLine={false}
                        dataKey="label"
                        tickLine={false}
                        tickMargin={8}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="count" fill="var(--chart-1)" radius={8} />
                </BarChart>
            </ChartContainer>

            <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl bg-muted/50 p-4">
                    <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                        Consultations
                    </p>
                    <p className="mt-1 text-lg font-semibold">{stats.total}</p>
                    <p className="text-sm text-muted-foreground">Sur la période</p>
                </div>
                <div className="rounded-xl bg-muted/50 p-4">
                    <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                        Formulaire
                    </p>
                    <p className="mt-1 text-lg font-semibold">{stats.contactSubmissions}</p>
                    <p className="text-sm text-muted-foreground">Témoignages reçus</p>
                </div>
            </div>
        </CardContent>
    </Card>
)
