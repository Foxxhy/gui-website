import Link from 'next/link'
import { contentService, analyticsService, authService, getCurrentSession } from '@/services'
import { redirect } from 'next/navigation'
import type { AnalyticsPeriod } from '@/types'

const periods: AnalyticsPeriod[] = ['today', '7days', '30days']

const parsePeriod = (value: string | string[] | undefined): AnalyticsPeriod =>
    typeof value === 'string' && periods.includes(value as AnalyticsPeriod)
        ? value as AnalyticsPeriod
        : '7days'

export default async function AdministrationAnalyticsPage({ searchParams }: PageProps<'/administration/analytics'>) {
    const session = await getCurrentSession()
    if (!session) redirect('/connexion?returnTo=/administration/analytics')
    if (!authService.canManage(session.user.role, 'analytics')) redirect('/administration')

    const params = await searchParams
    const period = parsePeriod(params.period)
    const [stats, articles] = await Promise.all([
        analyticsService.getStats(period),
        contentService.getAllArticles(),
    ])
    const articleTitles = new Map(articles.map((article) => [article.id, article.title]))

    return <main><h1>Analytics</h1><p>Données anonymes issues de la simulation. Aucun visiteur n’est identifié.</p><nav aria-label="Période d’analyse"><ul>{periods.map((candidate) => <li key={candidate}><Link href={`/administration/analytics?period=${candidate}`} aria-current={candidate === period ? 'page' : undefined}>{candidate === 'today' ? 'Aujourd’hui' : candidate === '7days' ? '7 derniers jours' : '30 derniers jours'}</Link></li>)}</ul></nav><p>Période : {stats.period.label}</p><section><h2>Vue générale</h2><dl><div><dt>Consultations</dt><dd>{stats.total}</dd></div><div><dt>Consultations de pages</dt><dd>{stats.pageViews}</dd></div><div><dt>Consultations d’articles</dt><dd>{stats.articleViews}</dd></div><div><dt>Envois du formulaire</dt><dd>{stats.contactSubmissions}</dd></div></dl></section><section><h2>Pages les plus consultées</h2>{stats.pages.length === 0 ? <p>Aucune consultation sur cette période.</p> : <ol>{stats.pages.map((page) => <li key={page.path}>{page.path} — {page.count} consultation{page.count > 1 ? 's' : ''}</li>)}</ol>}</section><section><h2>Articles les plus consultés</h2>{stats.articles.length === 0 ? <p>Aucun article consulté sur cette période.</p> : <ol>{stats.articles.map((article) => <li key={article.articleId}>{articleTitles.get(article.articleId) ?? article.articleId} — {article.count} vue{article.count > 1 ? 's' : ''}</li>)}</ol>}</section></main>
}
