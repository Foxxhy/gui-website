import type { ILink } from './link'

export interface IAddress {
    street?: string
    postalCode?: string
    city?: string
    country?: string
}

export interface ISocialLinks {
    facebook?: ILink
    instagram?: ILink
    linkedin?: ILink
    youtube?: ILink
    twitter?: ILink
}

export interface IContact {
    email?: string
    phone?: string
    address?: IAddress
    socialLinks?: ISocialLinks
}
