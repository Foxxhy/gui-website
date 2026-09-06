import {
    ArticleFilters,
    ArticleList,
    ArticlePagination,
    PublicPageFrame,
} from '@/components'
import { AnalyticsTracker } from '@/analytics'
import { configApp } from '@/configs'
import { serviceContent, serviceFeature, serviceTag } from '@/services'
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
    const features = await serviceFeature.getFlags()
    if (!features.articles) notFound()

    const [params, tags] = await Promise.all([searchParams, serviceTag.getTags()])
    const search = typeof params.search === 'string' ? params.search.trim() : ''
    const tagSlugs = parseTagSlugs(
        params.tags,
        new Set(tags.map((tag) => tag.slug))
    )
    const pagination = await serviceContent.getPublishedArticlesPage({
        search,
        tagSlugs,
        page: parsePage(params.page),
        limit: configApp.articles.pageSize,
    })

    return (
        <>
            <AnalyticsTracker path="/articles" />
            <PublicPageFrame features={features}>
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
            </PublicPageFrame>
        </>
    )
}
