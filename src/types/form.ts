import type { ICategory } from './category'

export interface IForm {
    id: string
    name: string
    email: string
    subject?: string
    category?: ICategory
    message: string
    createdAt: string
}