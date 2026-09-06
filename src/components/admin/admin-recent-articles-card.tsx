import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import type { IArticle } from '@/types'

const formatCreatedAt = (value: string) =>
    new Intl.DateTimeFormat('fr-FR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    }).format(new Date(value))

export const AdminRecentArticlesCard = ({ articles }: { articles: IArticle[] }) => (
    <Card>
        <CardHeader>
            <CardTitle>3 derniers articles créés</CardTitle>
            <CardDescription>Accès rapide à la gestion du contenu récent.</CardDescription>
        </CardHeader>
        <CardContent>
            {articles.length === 0 ? (
                <p className="text-sm text-muted-foreground">Aucun article pour le moment.</p>
            ) : (
                <ul className="space-y-3">
                    {articles.map((article) => (
                        <li
                            className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3 last:border-0 last:pb-0"
                            key={article.id}
                        >
                            <div className="min-w-0 space-y-1">
                                <p className="truncate font-medium">{article.title}</p>
                                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                                    <Badge variant="secondary">{article.status}</Badge>
                                    <span>Créé le {formatCreatedAt(article.createdAt)}</span>
                                </div>
                            </div>
                            <Button
                                nativeButton={false}
                                render={<Link href={`/administration/articles/${article.id}`} />}
                                size="sm"
                                variant="outline"
                            >
                                Modifier
                            </Button>
                        </li>
                    ))}
                </ul>
            )}
        </CardContent>
    </Card>
)
