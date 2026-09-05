import { PageSections, PublicNavigation } from '@/components'
import { contentService } from '@/services'

export default async function Home() {
    const [page, articles] = await Promise.all([
        contentService.getPageBySlug('accueil'),
        contentService.getPublishedArticles(),
    ])

    if (!page) return null

    return (
        <>
            <PublicNavigation />
            <main><PageSections sections={page.sections} featuredArticles={articles} /></main>
        </>
    )
}
