import { PageSections, PublicNavigation } from '@/components'
import { AnalyticsTracker } from '@/analytics/AnalyticsTracker'
import { contentService, featureService } from '@/services'
import { notFound } from 'next/navigation'

export default async function Home() {
    const features = await featureService.getFlags()
    if (!features.home) notFound()

    const [page, articles] = await Promise.all([
        contentService.getPageBySlug('accueil'),
        features.articles ? contentService.getPublishedArticles() : Promise.resolve([]),
    ])

    if (!page) return null

    return (
        <>
            <AnalyticsTracker path="/" />
            <PublicNavigation features={features} />
            <main><PageSections sections={page.sections} featuredArticles={articles} features={features} /></main>
        </>
    )
}
