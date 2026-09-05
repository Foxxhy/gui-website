import { PageSections, PublicNavigation } from '@/components'
import { contentService, featureService } from '@/services'
import { notFound } from 'next/navigation'

export default async function AssociationPage() {
    const [page, features] = await Promise.all([
        contentService.getPageBySlug('association'),
        featureService.getFlags(),
    ])
    if (!page) notFound()
    return <><PublicNavigation features={features} /><main><PageSections sections={page.sections} features={features} /></main></>
}