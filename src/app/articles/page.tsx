import {
    ArticleFilters,
    ArticleList,
    ArticlePagination,
    PublicNavigation,
} from '@/components'
import { AnalyticsTracker } from '@/analytics/AnalyticsTracker'
import { appConfig } from '@/configs'
import { contentService, featureService, tagService } from '@/services'
import { notFound } from 'next/navigation'

const parsePage = (value: string | string[] | undefined) => {
    if (typeof value !== 'string' || !/^[1-9]\d*$/.test(value)) return 1
    return Number(value)
}

const parseTagSlugs = (value: string | string[] | undefined, availableTagSlugs: Set<string>) => {
    const values = Array.isArray(value) ? value : value ? [value] : []
    return [...new Set(values.filter((tagSlug) => availableTagSlugs.has(tagSlug)))]
}

export default async function ArticlesPage({ searchParams }: PageProps<'/articles'>) {
    const features = await featureService.getFlags()
    if (!features.articles) notFound()

    const [params, tags] = await Promise.all([searchParams, tagService.getTags()])
    const search = typeof params.search === 'string' ? params.search.trim() : ''
    const tagSlugs = parseTagSlugs(
        params.tags,
        new Set(tags.map((tag) => tag.slug))
    )
    const pagination = await contentService.getPublishedArticlesPage({
        search,
        tagSlugs,
        page: parsePage(params.page),
        limit: appConfig.articles.pageSize,
    })

    return (
        <>
            <AnalyticsTracker path="/articles" />
            <PublicNavigation features={features} />
            <main>
                <h1>Articles</h1>
                <ArticleFilters search={search} selectedTagSlugs={tagSlugs} tags={tags} />
                {pagination.total === 0 ? (
                    <p>Aucun article ne correspond à votre recherche.</p>
                ) : (
                    <>
                        <p>{pagination.total} article{pagination.total > 1 ? 's' : ''} trouvé{pagination.total > 1 ? 's' : ''}.</p>
                        <ArticleList articles={pagination.articles} />
                        <ArticlePagination
                            pagination={pagination}
                            search={search}
                            tagSlugs={tagSlugs}
                        />
                    </>
                )}
            </main>
        </>
    )
}