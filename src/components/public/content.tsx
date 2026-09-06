import Link from 'next/link'
import type {
    IArticle,
    IArticlePagination,
    IContactField,
    IFeatureFlags,
    IPageSection,
} from '@/types'
import { Button } from '@/components/ui/button'
import { ArticleTags } from './tag-badge'
import { VisualMock } from './visual-mock'

const enabledFeatures: IFeatureFlags = {
    home: true,
    articles: true,
    contact: true,
}

export { ArticleTags } from './tag-badge'

export const ArticleList = ({ articles }: { articles: IArticle[] }) => (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
            <li key={article.id}>
                <article className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card">
                    <VisualMock className="aspect-[16/10] rounded-none border-0" />
                    <div className="flex flex-1 flex-col gap-3 p-4">
                        <h2 className="font-heading text-lg font-semibold">
                            <Link className="hover:underline" href={`/articles/${article.slug}`}>
                                {article.title}
                            </Link>
                        </h2>
                        {article.description && (
                            <p className="text-sm text-muted-foreground">{article.description}</p>
                        )}
                        <ArticleTags tags={article.tags} />
                        <div className="mt-auto space-y-1 text-sm text-muted-foreground">
                            {article.category && <p>Catégorie : {article.category}</p>}
                            {article.author && <p>Auteur : {article.author.pseudonym}</p>}
                            {article.publishedAt && (
                                <p>
                                    Publié le :{' '}
                                    {new Date(article.publishedAt).toLocaleDateString('fr-FR')}
                                </p>
                            )}
                        </div>
                        <Button
                            className="w-full sm:w-auto"
                            nativeButton={false}
                            render={<Link href={`/articles/${article.slug}`} />}
                        >
                            Lire l’article
                        </Button>
                    </div>
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
        <nav aria-label="Pagination des articles" className="flex flex-wrap items-center gap-4">
            {pagination.page > 1 ? (
                <Link href={createArticlesUrl(search, tagSlugs, pagination.page - 1)}>
                    ← Précédent
                </Link>
            ) : (
                <span aria-disabled="true">← Précédent</span>
            )}
            <ol className="flex flex-wrap gap-2">
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
                return (
                    <header key={section.id} className="space-y-4">
                        <VisualMock className="max-w-xl" />
                        <h1 className="font-heading text-3xl font-semibold">{section.title}</h1>
                        {section.content && <p className="text-muted-foreground">{section.content}</p>}
                    </header>
                )
            }
            if (section.type === 'text') {
                return (
                    <section key={section.id} className="space-y-3">
                        <h2 className="font-heading text-2xl font-semibold">{section.title}</h2>
                        <p>{section.content}</p>
                    </section>
                )
            }
            if (section.type === 'featured-articles') {
                if (!features.articles) return null
                const selected = featuredArticles.filter((article) => section.articleSlugs.includes(article.slug))
                return (
                    <section key={section.id} className="space-y-4">
                        <h2 className="font-heading text-2xl font-semibold">{section.title}</h2>
                        <ArticleList articles={selected} />
                    </section>
                )
            }
            if (section.href === '/contact' && !features.contact) return null
            return (
                <section key={section.id} className="space-y-3">
                    <h2 className="font-heading text-2xl font-semibold">{section.title}</h2>
                    {section.content && <p>{section.content}</p>}
                    <Button
                        nativeButton={false}
                        render={<Link href={section.href} />}
                    >
                        {section.label}
                    </Button>
                </section>
            )
        })}
    </>
)
