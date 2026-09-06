'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { XIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { getTagBadgeVariant } from '@/components/public/tag-badge'
import { createArticlesUrl } from '@/lib/articles-url'
import type { ITag } from '@/types'

type ArticleFiltersProps = {
    search: string
    selectedTagSlugs: string[]
    tags: ITag[]
}

export const ArticleSearchFilters = ({
    search: initialSearch,
    selectedTagSlugs,
    tags,
}: ArticleFiltersProps) => {
    const router = useRouter()
    const [search, setSearch] = useState(initialSearch)
    const selectedTags = tags.filter((tag) => selectedTagSlugs.includes(tag.slug))
    const hasActiveFilters = search.trim().length > 0 || selectedTagSlugs.length > 0

    useEffect(() => {
        setSearch(initialSearch)
    }, [initialSearch])

    const submitSearch = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        router.push(createArticlesUrl(search, selectedTagSlugs))
    }

    const removeTag = (tagSlug: string) => {
        router.push(
            createArticlesUrl(
                search,
                selectedTagSlugs.filter((selectedTagSlug) => selectedTagSlug !== tagSlug)
            )
        )
    }

    return (
        <section aria-labelledby="article-filters-title" className="space-y-2">
            <h2 className="font-heading text-lg font-semibold" id="article-filters-title">
                Rechercher et filtrer les articles
            </h2>
            <form
                className="flex flex-col gap-2 sm:flex-row sm:items-center"
                onSubmit={submitSearch}
            >
                <Label className="sr-only" htmlFor="article-search">
                    Rechercher un article
                </Label>
                <Input
                    className="min-w-0 flex-1"
                    id="article-search"
                    name="search"
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Rechercher un article"
                    type="search"
                    value={search}
                />
                <Button className="shrink-0" type="submit">
                    Rechercher
                </Button>
            </form>
            {hasActiveFilters && (
                <div className="flex flex-wrap items-center gap-2 pt-1">
                    {selectedTags.map((tag) => (
                        <Badge
                            className="gap-1 pr-1"
                            key={tag.id}
                            variant={getTagBadgeVariant(tag.style)}
                        >
                            {tag.name}
                            <button
                                aria-label={`Retirer le filtre ${tag.name}`}
                                className="rounded-full p-0.5 hover:bg-black/10"
                                onClick={() => removeTag(tag.slug)}
                                type="button"
                            >
                                <XIcon className="size-3" />
                            </button>
                        </Badge>
                    ))}
                    <Button
                        onClick={() => router.push('/articles')}
                        type="button"
                        variant="outline"
                    >
                        Réinitialiser les critères
                    </Button>
                </div>
            )}
        </section>
    )
}

export const ArticleTagFilters = ({
    search,
    selectedTagSlugs,
    tags,
}: ArticleFiltersProps) => {
    const router = useRouter()

    const updateTags = (tagSlug: string) => {
        const tagSlugs = selectedTagSlugs.includes(tagSlug)
            ? selectedTagSlugs.filter((selectedTagSlug) => selectedTagSlug !== tagSlug)
            : [...selectedTagSlugs, tagSlug]

        router.push(createArticlesUrl(search, tagSlugs))
    }

    return (
        <section aria-labelledby="tag-filter-title" className="space-y-2">
            <h3 className="font-heading text-base font-semibold" id="tag-filter-title">
                Filtrer par tags
            </h3>
            <div className="flex flex-wrap gap-2">
                {tags.map((tag) => {
                    const selected = selectedTagSlugs.includes(tag.slug)
                    return (
                        <button
                            aria-pressed={selected}
                            className="inline-flex"
                            key={tag.id}
                            onClick={() => updateTags(tag.slug)}
                            type="button"
                        >
                            <Badge variant={selected ? getTagBadgeVariant(tag.style) : 'outline'}>
                                {tag.name}
                            </Badge>
                        </button>
                    )
                })}
            </div>
        </section>
    )
}
