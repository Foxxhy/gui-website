import type { IPageSection } from '@/types'

const getValue = (values: FormData, name: string, fallback = '') =>
    String(values.get(name) ?? fallback).trim()

const fieldName = (sectionId: string, field: string) => `section-${sectionId}-${field}`

const hasSectionFields = (values: FormData, sectionId: string) =>
    values.has(fieldName(sectionId, 'title'))
    || values.has(fieldName(sectionId, 'content'))
    || values.has(fieldName(sectionId, 'label'))
    || values.has(fieldName(sectionId, 'href'))

export const parsePageSectionsFromFormData = (
    values: FormData,
    existingSections: IPageSection[]
): IPageSection[] =>
    existingSections.map((section) => {
        if (!hasSectionFields(values, section.id)) return section

        if (section.type === 'hero') {
            return {
                ...section,
                title: getValue(values, fieldName(section.id, 'title'), section.title),
                content: getValue(values, fieldName(section.id, 'content'), section.content ?? '') || undefined,
            }
        }

        if (section.type === 'text') {
            return {
                ...section,
                title: getValue(values, fieldName(section.id, 'title'), section.title ?? '') || undefined,
                content: getValue(values, fieldName(section.id, 'content'), section.content),
            }
        }

        if (section.type === 'call-to-action') {
            return {
                ...section,
                title: getValue(values, fieldName(section.id, 'title'), section.title),
                content: getValue(values, fieldName(section.id, 'content'), section.content ?? '') || undefined,
                label: getValue(values, fieldName(section.id, 'label'), section.label),
                href: getValue(values, fieldName(section.id, 'href'), section.href),
            }
        }

        if (section.type === 'featured-articles') {
            return {
                ...section,
                title: getValue(values, fieldName(section.id, 'title'), section.title),
            }
        }

        return section
    })

export const validatePageSections = (sections: IPageSection[]): string | undefined => {
    for (const section of sections) {
        if (section.type === 'hero' && !section.title.trim()) {
            return 'Le titre d’une section hero est obligatoire.'
        }
        if (section.type === 'text' && !section.content.trim()) {
            return 'Le contenu d’une section texte est obligatoire.'
        }
        if (section.type === 'call-to-action') {
            if (!section.title.trim()) return 'Le titre d’une section d’action est obligatoire.'
            if (!section.label.trim()) return 'Le libellé d’une section d’action est obligatoire.'
            if (!section.href.trim()) return 'Le lien d’une section d’action est obligatoire.'
        }
        if (section.type === 'featured-articles' && !section.title.trim()) {
            return 'Le titre d’une section d’articles est obligatoire.'
        }
    }
    return undefined
}
