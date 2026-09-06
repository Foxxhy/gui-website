import { PageSections, PublicBreadcrumb } from '@/components'
import { AnalyticsTracker } from '@/analytics'
import { serviceContent, serviceFeature } from '@/services'
import { notFound } from 'next/navigation'

export default async function AssociationPage() {
    const [page, features] = await Promise.all([
        serviceContent.getPageBySlug('association'),
        serviceFeature.getFlags(),
    ])
    if (!page) notFound()

    return (
        <>
            <AnalyticsTracker path="/association" />
            <div className="space-y-6">
                <PublicBreadcrumb
                    items={[
                        { label: 'Accueil', href: '/' },
                        { label: 'L’association' },
                    ]}
                />
                <PageSections sections={page.sections} features={features} />
            </div>
        </>
    )
}
