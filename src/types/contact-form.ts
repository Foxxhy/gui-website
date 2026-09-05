export enum IContactFieldType {
    TEXT = 'text',
    EMAIL = 'email',
    TEXTAREA = 'textarea',
    SELECT = 'select',
}

export interface IContactField {
    id: string
    technicalName: string
    label: string
    type: IContactFieldType
    required: boolean
    placeholder?: string
    helpText?: string
    options?: string[]
    order: number
}

export interface IContactFormConfiguration {
    id: string
    title: string
    description?: string
    fields: IContactField[]
}

export type IFieldErrors = Record<string, string>

export interface IActionResult<T = undefined> {
    success: boolean
    message: string
    errors?: IFieldErrors
    data?: T
}