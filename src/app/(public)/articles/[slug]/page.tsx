import { ArticleTags, MarkdownContent, PublicBreadcrumb } from '@/components'
import { VisualMock } from '@/components/public/visual-mock'
import { Separator } from '@/components/ui/separator'
import { AnalyticsTracker } from '@/analytics'
import { serviceContent, serviceFeature } from '@/services'
import { notFound } from 'next/navigation'

export default async function ArticlePage({ params }: PageProps<'/articles/[slug]'>) {
    const { slug } = await params
    const features = await serviceFeature.getFlags()
    if (!features.articles) notFound()
    const article = await serviceContent.getPublishedArticleBySlug(slug)
    if (!article) notFound()

    const publishedLabel = article.publishedAt
        ? new Date(article.publishedAt).toLocaleDateString('fr-FR')
        : null
    const authorLabel = article.author?.pseudonym
    const tags = article.tags

    return (
        <>
            <AnalyticsTracker path={`/articles/${article.slug}`} />
            <AnalyticsTracker
                type="article-view"
                path={`/articles/${article.slug}`}
                articleId={article.id}
            />
            <article className="space-y-6">
                <PublicBreadcrumb
                    items={[
                        { label: 'Accueil', href: '/' },
                        { label: 'Articles', href: '/articles' },
                        { label: article.title },
                    ]}
                />
                <h1 className="font-heading text-3xl font-semibold">{article.title}</h1>
                <VisualMock className="aspect-[16/9]" />
                {(publishedLabel || authorLabel || tags?.length) && (
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-muted-foreground">
                        {publishedLabel && (
                            <time dateTime={article.publishedAt}>{publishedLabel}</time>
                        )}
                        {authorLabel && (
                            <>
                                {publishedLabel && (
                                    <Separator className="h-4" orientation="vertical" />
                                )}
                                <span>{authorLabel}</span>
                            </>
                        )}
                        {tags && tags.length > 0 && (
                            <>
                                {(publishedLabel || authorLabel) && (
                                    <Separator className="h-4" orientation="vertical" />
                                )}
                                <ArticleTags tags={tags} />
                            </>
                        )}
                    </div>
                )}
                {article.description && (
                    <p className="text-lg text-muted-foreground">{article.description}</p>
                )}
                <MarkdownContent content={article.content} />
            </article>
        </>
    )
}
