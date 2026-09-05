import { ArticleTags, PublicNavigation } from '@/components'
import { contentService } from '@/services'
import Image from 'next/image'
import { notFound } from 'next/navigation'

export default async function ArticlePage({ params }: PageProps<'/articles/[slug]'>) {
    const { slug } = await params
    const article = await contentService.getPublishedArticleBySlug(slug)
    if (!article) notFound()
    return <><PublicNavigation /><main><article><h1>{article.title}</h1>{article.cover && <Image src={article.cover.url} alt={article.cover.alt} width={article.cover.width ?? 600} height={article.cover.height ?? 400} />}{article.description && <p>{article.description}</p>}<p>{article.content}</p><ArticleTags tags={article.tags} /><p>Catégorie : {article.category}</p>{article.author && <p>Auteur : {article.author.pseudonym}</p>}{article.publishedAt && <p>Publié le : {new Date(article.publishedAt).toLocaleDateString('fr-FR')}</p>}</article></main></>
}