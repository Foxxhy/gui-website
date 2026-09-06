import { PageSections, PublicPageFrame } from '@/components'
import { Button } from '@/components/ui/button'
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
            <PublicPageFrame features={features}>
                <main>
                    <section aria-label="Exemple shadcn/ui" className="flex gap-2 p-4">
                        <Button>Exemple shadcn</Button>
                        <Button variant="outline">Variante outline</Button>
                    </section>
                    <PageSections sections={page.sections} featuredArticles={articles} features={features} />
                </main>
            </PublicPageFrame>
        </>
    )
}
