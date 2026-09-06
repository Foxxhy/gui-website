import { createArticlesUrl } from './articles-url'

describe('createArticlesUrl', () => {
    it('builds a paginated articles url with search and tags', () => {
        expect(createArticlesUrl('solidarité', ['tech', 'news'], 2)).toBe(
            '/articles?search=solidarit%C3%A9&tags=tech&tags=news&page=2'
        )
    })

    it('defaults to page 1', () => {
        expect(createArticlesUrl('', ['tech'])).toBe('/articles?tags=tech&page=1')
    })
})
