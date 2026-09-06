import Link from 'next/link'
import Image from 'next/image'
import type { ReactNode } from 'react'
import type {
    IArticle,
    IArticlePagination,
    IContactField,
    IFeatureFlags,
    IPageSection,
} from '@/types'

const enabledFeatures: IFeatureFlags = {
    home: true,
    articles: true,
    contact: true,
}

export const ArticleTags = ({ tags }: Pick<IArticle, 'tags'>) => tags?.length ? <p>Tags : {tags.map((tag) => <span key={tag.id} className="tag" data-tag-style={tag.style}>[{tag.name}] </span>)}</p> : null

export const PublicNavigation = ({ features }: { features: IFeatureFlags }) => (
    <nav aria-label="Navigation principale">
        <ul>
            {features.home && <li><Link href="/">Accueil</Link></li>}
            {features.articles && <li><Link href="/articles">Articles</Link></li>}
            <li><Link href="/association">L’association</Link></li>
            {features.contact && <li><Link href="/contact">Contact</Link></li>}
            <li><Link href="/connexion">Connexion</Link></li>
        </ul>
    </nav>
)

export const PublicFooter = ({ features }: { features: IFeatureFlags }) => (
    <footer>
        <nav aria-label="Pied de page">
            <ul>
                {features.home && <li><Link href="/">Accueil</Link></li>}
                {features.articles && <li><Link href="/articles">Articles</Link></li>}
                {features.contact && <li><Link href="/contact">Contact</Link></li>}
                <li><Link href="/gestion-des-donnees">Gestion des données</Link></li>
            </ul>
        </nav>
    </footer>
)

export const PublicPageFrame = ({
    features,
    children,
}: {
    features: IFeatureFlags
    children: ReactNode
}) => (
    <>
        <PublicNavigation features={features} />
        {children}
        <PublicFooter features={features} />
    </>
)

export const ArticleList = ({ articles }: { articles: IArticle[] }) => (
    <ul>
        {articles.map((article) => (
            <li key={article.id}>
                <article>
                    <h2><Link href={`/articles/${article.slug}`}>{article.title}</Link></h2>
                    {article.description && <p>{article.description}</p>}
                    {article.cover && <Image src={article.cover.url} alt={article.cover.alt} width={article.cover.width ?? 600} height={article.cover.height ?? 400} />}
                    <p>Catégorie : {article.category}</p>
                    <ArticleTags tags={article.tags} />
                    {article.author && <p>Auteur : {article.author.pseudonym}</p>}
                    {article.publishedAt && <p>Publié le : {new Date(article.publishedAt).toLocaleDateString('fr-FR')}</p>}
                    <Link href={`/articles/${article.slug}`}>Lire l’article</Link>
                </article>
            </li>
        ))}
    </ul>
)

const createArticlesUrl = (search: string, tagSlugs: string[], page: number) => {
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    for (const tagSlug of tagSlugs) params.append('tags', tagSlug)
    params.set('page', String(page))
    return `/articles?${params.toString()}`
}

export const ArticlePagination = ({
    pagination,
    search,
    tagSlugs,
}: {
    pagination: IArticlePagination
    search: string
    tagSlugs: string[]
}) => {
    if (pagination.totalPages <= 1) return null

    return (
        <nav aria-label="Pagination des articles">
            {pagination.page > 1 ? (
                <Link href={createArticlesUrl(search, tagSlugs, pagination.page - 1)}>
                    ← Précédent
                </Link>
            ) : (
                <span aria-disabled="true">← Précédent</span>
            )}
            <ol>
                {Array.from({ length: pagination.totalPages }, (_, index) => index + 1).map(
                    (page) => (
                        <li key={page}>
                            {page === pagination.page ? (
                                <span aria-current="page">{page}</span>
                            ) : (
                                <Link href={createArticlesUrl(search, tagSlugs, page)}>{page}</Link>
                            )}
                        </li>
                    )
                )}
            </ol>
            {pagination.page < pagination.totalPages ? (
                <Link href={createArticlesUrl(search, tagSlugs, pagination.page + 1)}>
                    Suivant →
                </Link>
            ) : (
                <span aria-disabled="true">Suivant →</span>
            )}
        </nav>
    )
}

export const ContactField = ({ field, disabled = false }: { field: IContactField; disabled?: boolean }) => {
    const id = disabled ? `preview-${field.technicalName}` : field.technicalName
    const label = <label htmlFor={id}>{field.label}{field.required ? ' *' : ''}</label>
    const common = { id, name: disabled ? undefined : field.technicalName, required: field.required, placeholder: field.placeholder, disabled }

    return <p>{label}<br />{field.type === 'textarea' ? <textarea {...common} /> : field.type === 'select' ? <select {...common} defaultValue=""><option value="" disabled>Choisir une option</option>{field.options?.map((option) => <option key={option} value={option}>{option}</option>)}</select> : <input {...common} type={field.type} />}{field.helpText && <small>{field.helpText}</small>}</p>
}

export const PageSections = ({
    sections,
    featuredArticles = [],
    features = enabledFeatures,
}: {
    sections: IPageSection[]
    featuredArticles?: IArticle[]
    features?: IFeatureFlags
}) => (
    <>
        {[...sections].sort((first, second) => first.order - second.order).map((section) => {
            if (section.type === 'hero') {
                return <header key={section.id}><h1>{section.title}</h1>{section.content && <p>{section.content}</p>}</header>
            }
            if (section.type === 'text') {
                return <section key={section.id}><h2>{section.title}</h2><p>{section.content}</p></section>
            }
            if (section.type === 'featured-articles') {
                if (!features.articles) return null
                const selected = featuredArticles.filter((article) => section.articleSlugs.includes(article.slug))
                return <section key={section.id}><h2>{section.title}</h2><ArticleList articles={selected} /></section>
            }
            if (section.href === '/contact' && !features.contact) return null
            return <section key={section.id}><h2>{section.title}</h2>{section.content && <p>{section.content}</p>}<Link href={section.href}>{section.label}</Link></section>
        })}
    </>
)