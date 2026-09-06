'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getTagBadgeVariant } from '@/components/public/tag-badge'
import type { ITag } from '@/types'

const createArticlesUrl = (search: string, tagSlugs: string[]) => {
    const params = new URLSearchParams()
    const normalizedSearch = search.trim()

    if (normalizedSearch) params.set('search', normalizedSearch)
    for (const tagSlug of tagSlugs) params.append('tags', tagSlug)
    params.set('page', '1')

    return `/articles?${params.toString()}`
}

export const ArticleFilters = ({
    search: initialSearch,
    selectedTagSlugs,
    tags,
}: {
    search: string
    selectedTagSlugs: string[]
    tags: ITag[]
}) => {
    const router = useRouter()
    const [search, setSearch] = useState(initialSearch)

    useEffect(() => {
        setSearch(initialSearch)
    }, [initialSearch])

    const updateTags = (tagSlug: string) => {
        const tagSlugs = selectedTagSlugs.includes(tagSlug)
            ? selectedTagSlugs.filter((selectedTagSlug) => selectedTagSlug !== tagSlug)
            : [...selectedTagSlugs, tagSlug]

        router.push(createArticlesUrl(search, tagSlugs))
    }

    const submitSearch = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        router.push(createArticlesUrl(search, selectedTagSlugs))
    }

    return (
        <section aria-labelledby="article-filters-title">
            <h2 id="article-filters-title">Rechercher et filtrer les articles</h2>
            <form onSubmit={submitSearch}>
                <label htmlFor="article-search">Rechercher un article</label>
                <input
                    id="article-search"
                    name="search"
                    onChange={(event) => setSearch(event.target.value)}
                    type="search"
                    value={search}
                />
                <button type="submit">Rechercher</button>
            </form>
            <section aria-labelledby="tag-filter-title">
                <h3 id="tag-filter-title">Filtrer par tags</h3>
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
            </section>
            {selectedTagSlugs.length > 0 && (
                <section aria-labelledby="selected-tags-title">
                    <h3 id="selected-tags-title">Tags sélectionnés</h3>
                    <ul>
                        {tags
                            .filter((tag) => selectedTagSlugs.includes(tag.slug))
                            .map((tag) => (
                                <li key={tag.id} className="flex items-center gap-2">
                                    <Badge variant={getTagBadgeVariant(tag.style)}>{tag.name}</Badge>
                                    <Button
                                        onClick={() => updateTags(tag.slug)}
                                        size="sm"
                                        type="button"
                                        variant="ghost"
                                    >
                                        Retirer
                                    </Button>
                                </li>
                            ))}
                    </ul>
                    </section>
            )}
            {(search.trim() || selectedTagSlugs.length > 0) && (
                <button onClick={() => router.push('/articles')} type="button">
                    Réinitialiser les critères
                </button>
            )}
        </section>
    )
}
