import { PageSections, PublicNavigation } from '@/components'
import { contentService } from '@/services'
import { notFound } from 'next/navigation'

export default async function AssociationPage() {
    const page = await contentService.getPageBySlug('association')
    if (!page) notFound()
    return <><PublicNavigation /><main><PageSections sections={page.sections} /></main></>
}