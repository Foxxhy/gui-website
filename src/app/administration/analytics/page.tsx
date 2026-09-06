import Link from 'next/link'
import { AdminPageHeader } from '@/components/admin'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { serviceContent, serviceAnalytics, serviceAuth, serviceGetCurrentSession } from '@/services'
import { redirect } from 'next/navigation'
import type { AnalyticsPeriod } from '@/types'

const periods: AnalyticsPeriod[] = ['today', '7days', '30days']

const periodLabels: Record<AnalyticsPeriod, string> = {
    today: 'Aujourd’hui',
    '7days': '7 derniers jours',
    '30days': '30 derniers jours',
}

const parsePeriod = (value: string | string[] | undefined): AnalyticsPeriod =>
    typeof value === 'string' && periods.includes(value as AnalyticsPeriod)
        ? (value as AnalyticsPeriod)
        : '7days'

export default async function AdministrationAnalyticsPage({
    searchParams,
}: PageProps<'/administration/analytics'>) {
    const session = await serviceGetCurrentSession()
    if (!session) redirect('/connexion?returnTo=/administration/analytics')
    if (!serviceAuth.canManage(session.user.role, 'analytics')) redirect('/administration')

    const params = await searchParams
    const period = parsePeriod(params.period)
    const [stats, articles] = await Promise.all([
        serviceAnalytics.getStats(period),
        serviceContent.getAllArticles(),
    ])
    const articleTitles = new Map(articles.map((article) => [article.id, article.title]))

    return (
        <>
            <AdminPageHeader
                description="Données anonymes issues de la simulation. Aucun visiteur n’est identifié."
                title="Analytics"
            />
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>Période d’analyse</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                    {periods.map((candidate) => (
                        <Button
                            aria-current={candidate === period ? 'page' : undefined}
                            key={candidate}
                            nativeButton={false}
                            render={<Link href={`/administration/analytics?period=${candidate}`} />}
                            variant={candidate === period ? 'default' : 'outline'}
                        >
                            {periodLabels[candidate]}
                        </Button>
                    ))}
                </CardContent>
            </Card>

            <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Vue générale — {stats.period.label}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <dl className="grid gap-3 sm:grid-cols-2">
                            <div><dt className="text-sm text-muted-foreground">Consultations</dt><dd className="text-2xl font-semibold">{stats.total}</dd></div>
                            <div><dt className="text-sm text-muted-foreground">Consultations de pages</dt><dd className="text-2xl font-semibold">{stats.pageViews}</dd></div>
                            <div><dt className="text-sm text-muted-foreground">Consultations d’articles</dt><dd className="text-2xl font-semibold">{stats.articleViews}</dd></div>
                            <div><dt className="text-sm text-muted-foreground">Envois du formulaire</dt><dd className="text-2xl font-semibold">{stats.contactSubmissions}</dd></div>
                        </dl>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Pages les plus consultées</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {stats.pages.length === 0 ? (
                            <p className="text-sm text-muted-foreground">Aucune consultation sur cette période.</p>
                        ) : (
                            <ol className="space-y-2">
                                {stats.pages.map((page) => (
                                    <li key={page.path}>
                                        {page.path} — {page.count} consultation{page.count > 1 ? 's' : ''}
                                    </li>
                                ))}
                            </ol>
                        )}
                    </CardContent>
                </Card>

                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Articles les plus consultés</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {stats.articles.length === 0 ? (
                            <p className="text-sm text-muted-foreground">Aucun article consulté sur cette période.</p>
                        ) : (
                            <ol className="space-y-2">
                                {stats.articles.map((article) => (
                                    <li key={article.articleId}>
                                        {articleTitles.get(article.articleId) ?? article.articleId} — {article.count} vue{article.count > 1 ? 's' : ''}
                                    </li>
                                ))}
                            </ol>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    )
}
