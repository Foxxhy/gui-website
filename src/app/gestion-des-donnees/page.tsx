import { PageSections, PublicPageFrame } from '@/components'
import { AnalyticsTracker } from '@/analytics'
import { serviceContent, serviceFeature } from '@/services'
import { notFound } from 'next/navigation'

export default async function GestionDesDonneesPage() {
    const [page, features] = await Promise.all([
        serviceContent.getPageBySlug('gestion-des-donnees'),
        serviceFeature.getFlags(),
    ])
    if (!page) notFound()
    return (
        <>
            <AnalyticsTracker path="/gestion-des-donnees" />
            <PublicPageFrame features={features}>
                <main><PageSections sections={page.sections} features={features} /></main>
            </PublicPageFrame>
        </>
    )
}
