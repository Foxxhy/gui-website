import { PageSections, PublicNavigation } from '@/components'
import { AnalyticsTracker } from '@/analytics'
import { serviceContent, serviceFeature } from '@/services'
import { notFound } from 'next/navigation'

export default async function AssociationPage() {
    const [page, features] = await Promise.all([
        serviceContent.getPageBySlug('association'),
        serviceFeature.getFlags(),
    ])
    if (!page) notFound()
    return <><AnalyticsTracker path="/association" /><PublicNavigation features={features} /><main><PageSections sections={page.sections} features={features} /></main></>
}