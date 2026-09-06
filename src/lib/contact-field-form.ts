import { IContactFieldType, type IContactField } from '@/types'

export const parseContactFieldOptions = (raw: string): string[] =>
    raw.split('\n').map((option) => option.trim()).filter(Boolean)

const readFormValue = (formData: FormData, name: string, fallback = '') =>
    String(formData.get(name) ?? fallback)

export const parseContactFieldFromFormData = (
    formData: FormData,
    currentField?: IContactField
): IContactField => {
    const rawType = readFormValue(formData, 'type', currentField?.type ?? IContactFieldType.TEXT)
    const type = Object.values(IContactFieldType).includes(rawType as IContactFieldType)
        ? rawType as IContactFieldType
        : currentField?.type ?? IContactFieldType.TEXT

    return {
        id: currentField?.id ?? 'preview-field',
        technicalName: readFormValue(formData, 'technicalName', currentField?.technicalName || 'champ'),
        label: readFormValue(formData, 'label', currentField?.label || 'Nouveau champ'),
        type,
        required: formData.has('required'),
        placeholder: readFormValue(formData, 'placeholder', currentField?.placeholder ?? '') || undefined,
        helpText: readFormValue(formData, 'helpText', currentField?.helpText ?? '') || undefined,
        options: parseContactFieldOptions(
            readFormValue(formData, 'options', currentField?.options?.join('\n') ?? '')
        ),
        order: currentField?.order ?? Number.MAX_SAFE_INTEGER,
    }
}
