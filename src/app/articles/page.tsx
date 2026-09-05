import { ArticleList, PublicNavigation } from '@/components'
import { contentService, featureService } from '@/services'
import { notFound } from 'next/navigation'

export default async function ArticlesPage() {
    const features = await featureService.getFlags()
    if (!features.articles) notFound()
    const articles = await contentService.getPublishedArticles()
    return <><PublicNavigation features={features} /><main><h1>Articles</h1><ArticleList articles={articles} /></main></>
}