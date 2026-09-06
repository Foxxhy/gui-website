import Link from 'next/link'
import type {
    IArticle,
    IArticlePagination,
    IContactField,
    IFeatureFlags,
    IPageSection,
} from '@/types'
import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { ArticleTags } from './tag-badge'
import { VisualMock } from './visual-mock'

const enabledFeatures: IFeatureFlags = {
    home: true,
    articles: true,
    contact: true,
}

export { ArticleTags } from './tag-badge'

export const ArticleList = ({ articles }: { articles: IArticle[] }) => (
    <ul className="divide-y divide-border">
        {articles.map((article) => (
            <li key={article.id}>
                <article className="flex flex-col gap-3 py-6">
                    {(article.author || article.publishedAt) && (
                        <p className="text-sm text-muted-foreground">
                            {article.author && <span>{article.author.pseudonym}</span>}
                            {article.author && article.publishedAt && <span> · </span>}
                            {article.publishedAt && (
                                <time dateTime={article.publishedAt}>
                                    {new Date(article.publishedAt).toLocaleDateString('fr-FR')}
                                </time>
                            )}
                        </p>
                    )}
                    <div className="flex gap-4 sm:gap-6">
                        <div className="min-w-0 flex-1 space-y-2">
                            <h2 className="font-heading text-xl font-semibold leading-snug">
                                <Link className="hover:underline" href={`/articles/${article.slug}`}>
                                    {article.title}
                                </Link>
                            </h2>
                            {article.description && (
                                <p className="line-clamp-2 text-sm text-muted-foreground">
                                    {article.description}
                                </p>
                            )}
                        </div>
                        <Link
                            aria-hidden="true"
                            className="shrink-0"
                            href={`/articles/${article.slug}`}
                            tabIndex={-1}
                        >
                            <VisualMock className="aspect-[4/3] w-28 rounded-md sm:w-36" />
                        </Link>
                    </div>
                    <ArticleTags tags={article.tags} />
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

export const ContactField = ({
    field,
    disabled = false,
    error,
}: {
    field: IContactField
    disabled?: boolean
    error?: string
}) => {
    const id = disabled ? `preview-${field.technicalName}` : field.technicalName
    const describedBy = [
        field.helpText ? `${id}-help` : null,
        error ? `${id}-error` : null,
    ]
        .filter(Boolean)
        .join(' ') || undefined

    const common = {
        id,
        name: disabled ? undefined : field.technicalName,
        required: field.required,
        placeholder: field.placeholder,
        disabled,
        'aria-invalid': error ? true : undefined,
        'aria-describedby': describedBy,
        className: 'w-full',
    }

    return (
        <div className="space-y-2">
            <Label htmlFor={id}>
                {field.label}
                {field.required ? ' *' : ''}
            </Label>
            {field.type === 'textarea' ? (
                <Textarea {...common} />
            ) : field.type === 'select' ? (
                <Select {...common} defaultValue="">
                    <option disabled value="">
                        Choisir une option
                    </option>
                    {field.options?.map((option) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </Select>
            ) : (
                <Input {...common} type={field.type} />
            )}
            {field.helpText && (
                <p className="text-sm text-muted-foreground" id={`${id}-help`}>
                    {field.helpText}
                </p>
            )}
            {error && (
                <p className="text-sm text-destructive" id={`${id}-error`} role="alert">
                    {error}
                </p>
            )}
        </div>
    )
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
    <div className="space-y-6">
        {[...sections].sort((first, second) => first.order - second.order).map((section) => {
            if (section.type === 'hero') {
                return (
                    <Card key={section.id} className="pb-0">
                        <CardHeader>
                            <CardTitle className="text-3xl font-semibold">
                                <h1>{section.title}</h1>
                            </CardTitle>
                            {section.content && (
                                <CardDescription className="text-base">{section.content}</CardDescription>
                            )}
                        </CardHeader>
                        <VisualMock className="aspect-[16/9] rounded-none rounded-b-xl border-0" />
                    </Card>
                )
            }
            if (section.type === 'text') {
                return (
                    <Card key={section.id}>
                        <CardHeader>
                            {section.title && (
                                <CardTitle className="text-2xl font-semibold">
                                    <h2>{section.title}</h2>
                                </CardTitle>
                            )}
                        </CardHeader>
                        <CardContent>
                            <p>{section.content}</p>
                        </CardContent>
                    </Card>
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
                <Card key={section.id}>
                    <CardHeader>
                        <CardTitle className="text-2xl font-semibold">
                            <h2>{section.title}</h2>
                        </CardTitle>
                        {section.content && <CardDescription>{section.content}</CardDescription>}
                    </CardHeader>
                    <CardFooter className="border-0 bg-transparent">
                        <Button
                            nativeButton={false}
                            render={<Link href={section.href} />}
                        >
                            {section.label}
                        </Button>
                    </CardFooter>
                </Card>
            )
        })}
    </div>
)
