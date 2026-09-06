import type { IMedia } from './media'

export interface IFeatured {
    featureFlag?: boolean
}

export interface ISeo {
  metaTitle?: string
  metaDescription?: string
  image?: IMedia
  noIndex?: boolean
}

export interface IPage {
    id: string
    title: string
    slug: string
    description?: string
    content: string
    sections: IPageSection[]
    featuredImage?: IMedia
    publishedAt?: string
    seo: ISeo
    createdAt: string
    updatedAt: string
}

export type IPageSection =
        | {
                    id: string
                    type: 'hero'
                    title: string
                    content?: string
                    order: number
            }
        | {
                    id: string
                    type: 'text'
                    title?: string
                    content: string
                    order: number
            }
        | {
                    id: string
                    type: 'featured-articles'
                    title: string
                    articleSlugs: string[]
                    order: number
            }
        | {
                    id: string
                    type: 'call-to-action'
                    title: string
                    content?: string
                    label: string
                    href: string
                    order: number
            }
