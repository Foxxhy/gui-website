import { PageSections, PublicNavigation } from '@/components'
import { AnalyticsTracker } from '@/analytics'
import { serviceContent, serviceFeature } from '@/services'
import { notFound } from 'next/navigation'

export default async function Home() {
    const features = await serviceFeature.getFlags()
    if (!features.home) notFound()

    const [page, articles] = await Promise.all([
        serviceContent.getPageBySlug('accueil'),
        features.articles ? serviceContent.getPublishedArticles() : Promise.resolve([]),
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
