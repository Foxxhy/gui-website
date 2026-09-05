import { ArticleList, PublicNavigation } from '@/components'
import { contentService } from '@/services'

export default async function ArticlesPage() {
    const articles = await contentService.getPublishedArticles()
    return <><PublicNavigation /><main><h1>Articles</h1><ArticleList articles={articles} /></main></>
}