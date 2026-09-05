'use client'

import { useState } from 'react'
import {
    IContactFieldType,
    IStatus,
    type IArticle,
    type IContactField,
    type IContactFormConfiguration,
    type IPage,
    type IPageSection,
} from '@/types'

export type IAdminPreview =
    | { kind: 'article'; article: IArticle }
    | { kind: 'page'; page: IPage }
    | {
        kind: 'contactForm'
        configuration: IContactFormConfiguration
        fieldId?: string
    }

const getValue = (values: FormData, name: string, fallback = '') =>
    String(values.get(name) ?? fallback)

const toContactField = (
    values: FormData,
    currentField?: IContactField
): IContactField => ({
    id: currentField?.id ?? 'preview-field',
    technicalName: getValue(values, 'technicalName', currentField?.technicalName || 'champ'),
    label: getValue(values, 'label', currentField?.label || 'Nouveau champ'),
    type: getValue(values, 'type', currentField?.type || IContactFieldType.TEXT) as IContactFieldType,
    required: values.has('required'),
    placeholder: getValue(values, 'placeholder', currentField?.placeholder),
    options: getValue(values, 'options', currentField?.options?.join('\n'))
        .split('\n')
        .map((option) => option.trim())
        .filter(Boolean),
    order: currentField?.order ?? Number.MAX_SAFE_INTEGER,
})

const PreviewArticle = ({ article, values }: { article: IArticle; values: FormData }) => {
    const status = getValue(values, 'status', article.status)
    return <article><p><strong>{status === IStatus.PUBLISHED ? 'Publié' : status === IStatus.CANCELLED ? 'Annulé' : 'Brouillon'}</strong></p><h2>{getValue(values, 'title', article.title) || 'Titre de l’article'}</h2><p><strong>Slug :</strong> {getValue(values, 'slug', article.slug) || 'non renseigné'}</p><p>{getValue(values, 'description', article.description) || 'Aucun extrait.'}</p><p>{getValue(values, 'content', article.content) || 'Le contenu de l’article apparaîtra ici.'}</p>{article.author && <p>Auteur : {article.author.pseudonym}</p>}</article>
}

const PreviewSections = ({ sections }: { sections: IPageSection[] }) => (
    <ol>
        {[...sections].sort((first, second) => first.order - second.order).map((section) => (
            <li key={section.id}><strong>{section.type}</strong> — {section.type === 'text' ? section.title || section.content : section.title}</li>
        ))}
    </ol>
)

const PreviewPage = ({ page, values }: { page: IPage; values: FormData }) => (
    <><h2>{getValue(values, 'title', page.title) || 'Titre de la page'}</h2><p>{getValue(values, 'content', page.content) || 'Le contenu de la page apparaîtra ici.'}</p><h3>Sections actuelles</h3><PreviewSections sections={page.sections} /></>
)

const PreviewContactField = ({ field }: { field: IContactField }) => {
    const label = <label htmlFor={`preview-${field.technicalName}`}>{field.label}{field.required ? ' *' : ''}</label>
    if (field.type === IContactFieldType.TEXTAREA) {
        return <p>{label}<br /><textarea id={`preview-${field.technicalName}`} placeholder={field.placeholder} disabled /></p>
    }
    if (field.type === IContactFieldType.SELECT) {
        return <p>{label}<br /><select id={`preview-${field.technicalName}`} defaultValue="" disabled><option value="" disabled>Choisir une option</option>{field.options?.map((option) => <option key={option}>{option}</option>)}</select></p>
    }
    return <p>{label}<br /><input id={`preview-${field.technicalName}`} type={field.type} placeholder={field.placeholder} disabled /></p>
}

const PreviewContactForm = ({ configuration, fieldId, values }: { configuration: IContactFormConfiguration; fieldId?: string; values: FormData }) => {
    const currentField = configuration.fields.find((field) => field.id === fieldId)
    const updatedField = toContactField(values, currentField)
    const fields = currentField
        ? configuration.fields.map((field) => field.id === fieldId ? updatedField : field)
        : [...configuration.fields, updatedField]
    const [message, setMessage] = useState('')

    return <><h2>{configuration.title}</h2>{configuration.description && <p>{configuration.description}</p>}{fields.sort((first, second) => first.order - second.order).map((field) => <PreviewContactField key={field.id} field={field} />)}<button type="button" onClick={() => setMessage('Simulation réussie : aucun message n’a été envoyé.')}>Simuler l’envoi</button>{message && <output aria-live="polite">{message}</output>}</>
}

export const AdminPreview = ({ preview, values, onClose }: { preview: IAdminPreview; values: FormData; onClose: () => void }) => (
    <aside className="admin-preview" aria-label="Aperçu non enregistré">
        <div className="admin-preview__header"><h2>Aperçu</h2><button type="button" onClick={onClose}>Fermer l’aperçu</button></div>
        <p><small>Les modifications affichées ne sont pas encore enregistrées.</small></p>
        {preview.kind === 'article' && <PreviewArticle article={preview.article} values={values} />}
        {preview.kind === 'page' && <PreviewPage page={preview.page} values={values} />}
        {preview.kind === 'contactForm' && <PreviewContactForm configuration={preview.configuration} fieldId={preview.fieldId} values={values} />}
    </aside>
)