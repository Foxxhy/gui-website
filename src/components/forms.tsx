'use client'

import { useActionState, useState } from 'react'
import { actionAdminChangeUserPassword, actionChangeOwnPassword, actionLogin, actionSubmitAdminMutation, actionSubmitContact } from '@/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
        <form action={action} className="space-y-4">
            <input name="returnTo" type="hidden" value={returnTo} />
            <div className="space-y-2">
                <Label htmlFor="login">Identifiant</Label>
                <Input autoComplete="username" id="login" name="login" required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input autoComplete="current-password" id="password" name="password" required type="password" />
            </div>
            <Button className="w-full" disabled={pending} type="submit">
                {pending ? 'Connexion…' : 'Connexion'}
            </Button>
            {state.message && <p aria-live="polite" className="text-sm text-destructive" role="alert">{state.message}</p>}
        </form>
    )
}

export const ChangeOwnPasswordForm = () => {
    const [state, action, pending] = useActionState(actionChangeOwnPassword, initialState)
    return (
        <form action={action} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="currentPassword">Mot de passe actuel</Label>
                <Input autoComplete="current-password" id="currentPassword" name="currentPassword" required type="password" />
                {state.errors?.currentPassword && <span className="text-sm text-destructive" role="alert">{state.errors.currentPassword}</span>}
            </div>
            <div className="space-y-2">
                <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                <Input autoComplete="new-password" id="newPassword" name="newPassword" required type="password" />
                {state.errors?.newPassword && <span className="text-sm text-destructive" role="alert">{state.errors.newPassword}</span>}
            </div>
            <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmation du nouveau mot de passe</Label>
                <Input autoComplete="new-password" id="confirmPassword" name="confirmPassword" required type="password" />
                {state.errors?.confirmPassword && <span className="text-sm text-destructive" role="alert">{state.errors.confirmPassword}</span>}
            </div>
            <Button disabled={pending} type="submit">{pending ? 'Modification…' : 'Modifier mon mot de passe'}</Button>
            {state.message && <p aria-live="polite" className="text-sm" role={state.success ? 'status' : 'alert'}>{state.message}</p>}
        </form>
    )
}

export const AdminChangeUserPasswordForm = ({ userId }: { userId: string }) => {
    const [state, action, pending] = useActionState(actionAdminChangeUserPassword, initialState)
    return (
        <form action={action} className="space-y-4">
            <input name="userId" type="hidden" value={userId} />
            <div className="space-y-2">
                <Label htmlFor={`newPassword-${userId}`}>Nouveau mot de passe</Label>
                <Input autoComplete="new-password" id={`newPassword-${userId}`} name="newPassword" required type="password" />
                {state.errors?.newPassword && <span className="text-sm text-destructive" role="alert">{state.errors.newPassword}</span>}
            </div>
            <div className="space-y-2">
                <Label htmlFor={`confirmPassword-${userId}`}>Confirmation du nouveau mot de passe</Label>
                <Input autoComplete="new-password" id={`confirmPassword-${userId}`} name="confirmPassword" required type="password" />
                {state.errors?.confirmPassword && <span className="text-sm text-destructive" role="alert">{state.errors.confirmPassword}</span>}
            </div>
            <Button disabled={pending} type="submit">{pending ? 'Modification…' : 'Modifier le mot de passe'}</Button>
            {state.message && <p aria-live="polite" className="text-sm" role={state.success ? 'status' : 'alert'}>{state.message}</p>}
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

    return <div className="admin-editor">{isPreviewOpen && preview && <AdminPreview preview={preview} values={previewValues} onClose={() => setIsPreviewOpen(false)} />}<form action={action} className="space-y-4" onInput={(event) => updatePreview(event.currentTarget)} onChange={(event) => updatePreview(event.currentTarget)}><input type="hidden" name="area" value={area} /><input type="hidden" name="operation" value={operation} />{children}<div className="flex flex-wrap gap-2">{preview && <Button onClick={(event) => { const form = event.currentTarget.form; if (form) updatePreview(form); setIsPreviewOpen(true) }} type="button" variant="outline">Afficher l’aperçu</Button>}<Button disabled={pending} type="submit">{pending ? 'Traitement…' : operation}</Button></div>{state.message && <p aria-live="polite" className="text-sm" role={state.success ? 'status' : 'alert'}>{state.message}</p>}</form></div>
}