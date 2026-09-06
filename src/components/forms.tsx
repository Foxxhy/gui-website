'use client'

import { useActionState, useState } from 'react'
import { actionAdminChangeUserPassword, actionChangeOwnPassword, actionLogin, actionSubmitAdminMutation, actionSubmitContact } from '@/actions'
import type { IActionResult, IContactFormConfiguration } from '@/types'
import { AdminPreview, type IAdminPreview } from './preview'
import { ContactField } from './public'

const initialState: IActionResult = { success: false, message: '' }

export const ContactForm = ({ configuration }: { configuration: IContactFormConfiguration }) => {
    const [state, action, pending] = useActionState(actionSubmitContact, initialState)
    return (
        <form action={action}>
            {configuration.fields.map((field) => (
                <div key={field.id}>
                    <ContactField field={field} />
                    {state.errors?.[field.technicalName] && <span role="alert"> {state.errors[field.technicalName]}</span>}
                </div>
            ))}
            <button type="submit" disabled={pending}>{pending ? 'Envoi en cours…' : 'Envoyer'}</button>
            {state.message && <p aria-live="polite" role={state.success ? 'status' : 'alert'}>{state.message}</p>}
        </form>
    )
}

export const LoginForm = ({ returnTo }: { returnTo: string }) => {
    const [state, action, pending] = useActionState(actionLogin, initialState)
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

export const ChangeOwnPasswordForm = () => {
    const [state, action, pending] = useActionState(actionChangeOwnPassword, initialState)
    return (
        <form action={action}>
            <p><label htmlFor="currentPassword">Mot de passe actuel</label><br /><input id="currentPassword" name="currentPassword" type="password" required autoComplete="current-password" />{state.errors?.currentPassword && <span role="alert"> {state.errors.currentPassword}</span>}</p>
            <p><label htmlFor="newPassword">Nouveau mot de passe</label><br /><input id="newPassword" name="newPassword" type="password" required autoComplete="new-password" />{state.errors?.newPassword && <span role="alert"> {state.errors.newPassword}</span>}</p>
            <p><label htmlFor="confirmPassword">Confirmation du nouveau mot de passe</label><br /><input id="confirmPassword" name="confirmPassword" type="password" required autoComplete="new-password" />{state.errors?.confirmPassword && <span role="alert"> {state.errors.confirmPassword}</span>}</p>
            <button type="submit" disabled={pending}>{pending ? 'Modification…' : 'Modifier mon mot de passe'}</button>
            {state.message && <p aria-live="polite" role={state.success ? 'status' : 'alert'}>{state.message}</p>}
        </form>
    )
}

export const AdminChangeUserPasswordForm = ({ userId }: { userId: string }) => {
    const [state, action, pending] = useActionState(actionAdminChangeUserPassword, initialState)
    return (
        <form action={action}>
            <input type="hidden" name="userId" value={userId} />
            <p><label htmlFor={`newPassword-${userId}`}>Nouveau mot de passe</label><br /><input id={`newPassword-${userId}`} name="newPassword" type="password" required autoComplete="new-password" />{state.errors?.newPassword && <span role="alert"> {state.errors.newPassword}</span>}</p>
            <p><label htmlFor={`confirmPassword-${userId}`}>Confirmation du nouveau mot de passe</label><br /><input id={`confirmPassword-${userId}`} name="confirmPassword" type="password" required autoComplete="new-password" />{state.errors?.confirmPassword && <span role="alert"> {state.errors.confirmPassword}</span>}</p>
            <button type="submit" disabled={pending}>{pending ? 'Modification…' : 'Modifier le mot de passe'}</button>
            {state.message && <p aria-live="polite" role={state.success ? 'status' : 'alert'}>{state.message}</p>}
        </form>
    )
}

export const AdminMutationForm = ({
    area,
    operation,
    children,
    preview,
}: {
    area: 'articles' | 'pages' | 'contactForm' | 'tags' | 'users' | 'features'
    operation: string
    children: React.ReactNode
    preview?: IAdminPreview
}) => {
    const [state, action, pending] = useActionState(actionSubmitAdminMutation, initialState)
    const [isPreviewOpen, setIsPreviewOpen] = useState(false)
    const [previewValues, setPreviewValues] = useState(() => new FormData())
    const updatePreview = (form: HTMLFormElement) => setPreviewValues(new FormData(form))

    return <div className="admin-editor">{isPreviewOpen && preview && <AdminPreview preview={preview} values={previewValues} onClose={() => setIsPreviewOpen(false)} />}<form action={action} onInput={(event) => updatePreview(event.currentTarget)} onChange={(event) => updatePreview(event.currentTarget)}><input type="hidden" name="area" value={area} /><input type="hidden" name="operation" value={operation} />{children}<p>{preview && <button type="button" onClick={(event) => { const form = event.currentTarget.form; if (form) updatePreview(form); setIsPreviewOpen(true) }}>Afficher l’aperçu</button>} <button type="submit" disabled={pending}>{pending ? 'Traitement…' : operation}</button></p>{state.message && <p aria-live="polite" role={state.success ? 'status' : 'alert'}>{state.message}</p>}</form></div>
}