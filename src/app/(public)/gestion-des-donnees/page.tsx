import { PageSections, PublicBreadcrumb } from '@/components'
import { AnalyticsTracker } from '@/analytics'
import { serviceContent } from '@/services'
import { notFound } from 'next/navigation'

export default async function DataManagementPage() {
    const page = await serviceContent.getPageBySlug('gestion-des-donnees')
    if (!page) notFound()

    return (
        <>
            <AnalyticsTracker path="/gestion-des-donnees" />
            <div className="space-y-6">
                <PublicBreadcrumb
                    items={[
                        { label: 'Accueil', href: '/' },
                        { label: 'Gestion des données' },
                    ]}
                />
                <PageSections sections={page.sections} />
            </div>
        </>
    )
}
