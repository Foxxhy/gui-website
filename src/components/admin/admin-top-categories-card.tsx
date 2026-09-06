import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import type { IAnalyticsCategoryView } from '@/analytics'
import { ICategory } from '@/types'

const categoryLabels: Record<ICategory, string> = {
    [ICategory.ACTUALITES]: 'Actualités',
    [ICategory.EVENEMENTS]: 'Événements',
    [ICategory.PROJETS]: 'Projets',
    [ICategory.VIE_ASSOCIATIVE]: 'Vie associative',
}

export const AdminTopCategoriesCard = ({
    categories,
}: {
    categories: IAnalyticsCategoryView[]
}) => {
    const maxCount = Math.max(...categories.map((item) => item.count), 1)

    return (
        <Card>
            <CardHeader>
                <CardTitle>Catégories les plus lues</CardTitle>
                <CardDescription>Sur les 7 derniers jours.</CardDescription>
            </CardHeader>
            <CardContent>
                {categories.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                        Aucune lecture d’article sur cette période.
                    </p>
                ) : (
                    <ul className="space-y-3">
                        {categories.map((item) => {
                            const widthPercent = Math.max((item.count / maxCount) * 100, 8)
                            return (
                                <li className="space-y-1.5" key={item.category}>
                                    <div className="flex items-center justify-between gap-3 text-sm">
                                        <span className="font-medium">
                                            {categoryLabels[item.category]}
                                        </span>
                                        <span className="text-muted-foreground">
                                            {item.count} lecture{item.count > 1 ? 's' : ''}
                                        </span>
                                    </div>
                                    <svg
                                        aria-hidden="true"
                                        className="h-2 w-full text-foreground/80"
                                        preserveAspectRatio="none"
                                        viewBox="0 0 100 8"
                                    >
                                        <title>
                                            {`${categoryLabels[item.category]} : ${item.count}`}
                                        </title>
                                        <rect
                                            className="fill-muted"
                                            height="8"
                                            rx="4"
                                            width="100"
                                            x="0"
                                            y="0"
                                        />
                                        <rect
                                            className="fill-current"
                                            height="8"
                                            rx="4"
                                            width={widthPercent}
                                            x="0"
                                            y="0"
                                        />
                                    </svg>
                                </li>
                            )
                        })}
                    </ul>
                )}
            </CardContent>
        </Card>
    )
}
