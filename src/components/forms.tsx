'use client'

import { useActionState, useState } from 'react'
import { loginAction, submitAdminMutation, submitContactAction } from '@/actions'
import { IContactFieldType, type IActionResult, type IContactFormConfiguration } from '@/types'
import { AdminPreview, type IAdminPreview } from './preview'

const initialState: IActionResult = { success: false, message: '' }

export const ContactForm = ({ configuration }: { configuration: IContactFormConfiguration }) => {
    const [state, action, pending] = useActionState(submitContactAction, initialState)
    return (
        <form action={action}>
            {configuration.fields.map((field) => (
                <p key={field.id}>
                    <label htmlFor={field.technicalName}>{field.label}{field.required ? ' *' : ''}</label><br />
                    {field.type === IContactFieldType.TEXTAREA ? (
                        <textarea id={field.technicalName} name={field.technicalName} required={field.required} placeholder={field.placeholder} />
                    ) : field.type === IContactFieldType.SELECT ? (
                        <select id={field.technicalName} name={field.technicalName} required={field.required} defaultValue="">
                            <option value="" disabled>Choisir une option</option>
                            {field.options?.map((option) => <option key={option} value={option}>{option}</option>)}
                        </select>
                    ) : (
                        <input id={field.technicalName} name={field.technicalName} type={field.type} required={field.required} placeholder={field.placeholder} />
                    )}
                    {field.helpText && <small>{field.helpText}</small>}
                    {state.errors?.[field.technicalName] && <span role="alert"> {state.errors[field.technicalName]}</span>}
                </p>
            ))}
            <button type="submit" disabled={pending}>{pending ? 'Envoi en cours…' : 'Envoyer'}</button>
            {state.message && <p aria-live="polite" role={state.success ? 'status' : 'alert'}>{state.message}</p>}
        </form>
    )
}

export const LoginForm = ({ returnTo }: { returnTo: string }) => {
    const [state, action, pending] = useActionState(loginAction, initialState)
    return (
        <form action={action}>
            <input type="hidden" name="returnTo" value={returnTo} />
            <p><label htmlFor="login">Identifiant</label><br /><input id="login" name="login" required autoComplete="username" /></p>
            <p><label htmlFor="password">Mot de passe</label><br /><input id="password" name="password" type="password" required autoComplete="current-password" /></p>
            <button type="submit" disabled={pending}>{pending ? 'Connexion…' : 'Se connecter'}</button>
            {state.message && <p aria-live="polite" role="alert">{state.message}</p>}
        </form>
    )
}

export const AdminMutationForm = ({
    area,
    operation,
    children,
    preview,
}: {
    area: 'articles' | 'pages' | 'contactForm' | 'tags' | 'users'
    operation: string
    children: React.ReactNode
    preview?: IAdminPreview
}) => {
    const [state, action, pending] = useActionState(submitAdminMutation, initialState)
    const [isPreviewOpen, setIsPreviewOpen] = useState(false)
    const [previewValues, setPreviewValues] = useState(() => new FormData())
    const updatePreview = (form: HTMLFormElement) => setPreviewValues(new FormData(form))

    return <div className="admin-editor">{isPreviewOpen && preview && <AdminPreview preview={preview} values={previewValues} onClose={() => setIsPreviewOpen(false)} />}<form action={action} onInput={(event) => updatePreview(event.currentTarget)} onChange={(event) => updatePreview(event.currentTarget)}><input type="hidden" name="area" value={area} /><input type="hidden" name="operation" value={operation} />{children}<p>{preview && <button type="button" onClick={(event) => { const form = event.currentTarget.form; if (form) updatePreview(form); setIsPreviewOpen(true) }}>Afficher l’aperçu</button>} <button type="submit" disabled={pending}>{pending ? 'Traitement…' : operation}</button></p>{state.message && <p aria-live="polite" role={state.success ? 'status' : 'alert'}>{state.message}</p>}</form></div>
}