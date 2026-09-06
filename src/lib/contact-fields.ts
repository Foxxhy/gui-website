import { IContactFieldType, type IContactField } from '@/types'

const parseFieldType = (value: unknown): IContactFieldType | undefined => {
    if (typeof value !== 'string') return undefined
    return Object.values(IContactFieldType).includes(value as IContactFieldType)
        ? value as IContactFieldType
        : undefined
}

const parseOptions = (value: unknown): string[] | undefined => {
    if (typeof value !== 'string') return undefined
    const options = value
        .split('\n')
        .map((option) => option.trim())
        .filter(Boolean)
    return options.length > 0 ? options : undefined
}

export const buildContactFieldFromFormData = (
    formData: FormData,
    existing?: IContactField,
    nextOrder = 1
): IContactField => {
    const type = parseFieldType(formData.get('type')) ?? existing?.type ?? IContactFieldType.TEXT
    const requiredValues = formData.getAll('required').map(String)
    const required = requiredValues.includes('true') || requiredValues.includes('on')

    return {
        id: existing?.id ?? `field-${Date.now()}`,
        technicalName: String(formData.get('technicalName') ?? existing?.technicalName ?? '').trim(),
        label: String(formData.get('label') ?? existing?.label ?? '').trim(),
        type,
        required,
        placeholder: String(formData.get('placeholder') ?? '').trim() || undefined,
        options: parseOptions(formData.get('options')),
        order: existing?.order ?? nextOrder,
    }
}
