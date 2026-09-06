import { analyticsComputeCategoryViews } from '@/analytics'
import { AdminPageHeader } from '@/components/admin'
import { AdminRecentArticlesCard } from '@/components/admin/admin-recent-articles-card'
import { AdminTopCategoriesCard } from '@/components/admin/admin-top-categories-card'
import { AnalyticsHistoryCard } from '@/components/admin/analytics-history-card'
import { serviceAnalytics, serviceContent } from '@/services'

export default async function AdministrationPage() {
    const [stats, articles] = await Promise.all([
        serviceAnalytics.getStats('7days'),
        serviceContent.getAllArticles(),
    ])

    const recentArticles = [...articles]
        .sort((first, second) => second.createdAt.localeCompare(first.createdAt))
        .slice(0, 3)

    const topCategories = analyticsComputeCategoryViews(stats.articles, articles)

    return (
        <>
            <AdminPageHeader
                description="Vue synthétique de l’activité et du contenu récent."
                title="Administration"
            />
            <div className="grid gap-6 lg:grid-cols-2">
                <div className="lg:col-span-2">
                    <AnalyticsHistoryCard stats={stats} />
                </div>
                <AdminRecentArticlesCard articles={recentArticles} />
                <AdminTopCategoriesCard categories={topCategories} />
            </div>
        </>
    )
}
