import { ArticleTags, MarkdownContent } from '@/components'
import { VisualMock } from '@/components/public/visual-mock'
import { AnalyticsTracker } from '@/analytics'
import { serviceContent, serviceFeature } from '@/services'
import { notFound } from 'next/navigation'

export default async function ArticlePage({ params }: PageProps<'/articles/[slug]'>) {
    const { slug } = await params
    const features = await serviceFeature.getFlags()
    if (!features.articles) notFound()
    const article = await serviceContent.getPublishedArticleBySlug(slug)
    if (!article) notFound()

    return (
        <>
            <AnalyticsTracker path={`/articles/${article.slug}`} />
            <AnalyticsTracker
                type="article-view"
                path={`/articles/${article.slug}`}
                articleId={article.id}
            />
            <article className="space-y-6">
                <VisualMock className="max-w-3xl" />
                <h1 className="font-heading text-3xl font-semibold">{article.title}</h1>
                {article.description && (
                    <p className="text-lg text-muted-foreground">{article.description}</p>
                )}
                <MarkdownContent content={article.content} />
                <ArticleTags tags={article.tags} />
                <div className="space-y-1 text-sm text-muted-foreground">
                    {article.category && <p>Catégorie : {article.category}</p>}
                    {article.author && <p>Auteur : {article.author.pseudonym}</p>}
                    {article.publishedAt && (
                        <p>
                            Publié le :{' '}
                            {new Date(article.publishedAt).toLocaleDateString('fr-FR')}
                        </p>
                    )}
                </div>
            </article>
        </>
    )
}
