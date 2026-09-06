import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import type { IAnalyticsStats } from '@/types'

const barTones = [
    'text-muted',
    'text-muted-foreground/30',
    'text-muted-foreground/50',
    'text-muted-foreground/70',
    'text-muted-foreground',
    'text-foreground',
    'text-foreground',
]

export const AnalyticsHistoryCard = ({ stats }: { stats: IAnalyticsStats }) => {
    const maxCount = Math.max(...stats.timeline.map((point) => point.count), 1)

    return (
        <Card>
            <CardHeader>
                <CardTitle>Historique d’activité</CardTitle>
                <CardDescription>{stats.period.label}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex h-40 items-end justify-between gap-2 sm:gap-3">
                    {stats.timeline.map((point, index) => {
                        const heightPercent = Math.max(
                            (point.count / maxCount) * 100,
                            point.count > 0 ? 8 : 4
                        )
                        const barHeight = heightPercent
                        const barY = 100 - barHeight

                        return (
                            <div
                                className="flex min-w-0 flex-1 flex-col items-center gap-2"
                                key={`${point.label}-${index}`}
                            >
                                <svg
                                    aria-hidden="true"
                                    className={`h-full w-full max-w-8 ${barTones[Math.min(index, barTones.length - 1)]}`}
                                    preserveAspectRatio="none"
                                    viewBox="0 0 32 100"
                                >
                                    <title>{`${point.label} : ${point.count}`}</title>
                                    <rect
                                        className="fill-current"
                                        height={barHeight}
                                        rx="12"
                                        width="32"
                                        x="0"
                                        y={barY}
                                    />
                                </svg>
                                <span className="truncate text-xs text-muted-foreground">{point.label}</span>
                            </div>
                        )
                    })}
                </div>

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
}
