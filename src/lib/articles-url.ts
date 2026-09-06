export const createArticlesUrl = (search: string, tagSlugs: string[], page = 1) => {
    const params = new URLSearchParams()
    const normalizedSearch = search.trim()

    if (normalizedSearch) params.set('search', normalizedSearch)
    for (const tagSlug of tagSlugs) params.append('tags', tagSlug)
    params.set('page', String(page))

    return `/articles?${params.toString()}`
}
