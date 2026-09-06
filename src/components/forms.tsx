'use client'

import { useActionState, useState } from 'react'
import { CircleAlertIcon, CircleCheckIcon } from 'lucide-react'
import { actionAdminChangeUserPassword, actionChangeOwnPassword, actionLogin, actionSubmitAdminMutation, actionSubmitContact } from '@/actions'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { IActionResult, IContactFormConfiguration } from '@/types'
import { AdminPreview, type IAdminPreview } from './preview'
import { ContactField } from './public'

const initialState: IActionResult = { success: false, message: '' }

export const ContactForm = ({ configuration }: { configuration: IContactFormConfiguration }) => {
    const [state, action, pending] = useActionState(actionSubmitContact, initialState)

    return (
        <form action={action} className="space-y-4">
            {configuration.fields.map((field) => (
                <ContactField
                    error={state.errors?.[field.technicalName]}
                    field={field}
                    key={field.id}
                />
            ))}
            <div className="space-y-2">
                <div className="flex items-start gap-2">
                    <Checkbox
                        aria-invalid={state.errors?.consent ? true : undefined}
                        id="consent"
                        name="consent"
                        required
                        value="on"
                    />
                    <Label className="font-normal leading-snug" htmlFor="consent">
                        J’accepte que mon témoignage soit traité et modéré par l’association.
                    </Label>
                </div>
                {state.errors?.consent && (
                    <p className="text-sm text-destructive" role="alert">
                        {state.errors.consent}
                    </p>
                )}
            </div>
            <div className="flex justify-end">
                <Button disabled={pending} type="submit">
                    {pending ? 'Envoi en cours…' : 'Envoyer'}
                </Button>
            </div>
            {state.message && (
                <Alert variant={state.success ? 'default' : 'destructive'}>
                    {state.success ? <CircleCheckIcon /> : <CircleAlertIcon />}
                    <AlertTitle>{state.success ? 'Message envoyé' : 'Envoi impossible'}</AlertTitle>
                    <AlertDescription>{state.message}</AlertDescription>
                </Alert>
            )}
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

export const ChangeOwnPasswordFields = ({ state }: { state: IActionResult }) => (
    <>
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
        {state.message && <p aria-live="polite" className="text-sm" role={state.success ? 'status' : 'alert'}>{state.message}</p>}
    </>
)

export const ChangeOwnPasswordForm = () => {
    const [state, action, pending] = useActionState(actionChangeOwnPassword, initialState)
    return (
        <form action={action} className="space-y-4">
            <ChangeOwnPasswordFields state={state} />
            <Button disabled={pending} type="submit">{pending ? 'Modification…' : 'Modifier mon mot de passe'}</Button>
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
    submitLabel,
    submitClassName,
    submitVariant = 'default',
    footer,
    formId,
    deferActions = false,
    middleSlot,
    onFormValuesChange,
    className,
    actionsClassName,
}: {
    area: 'articles' | 'pages' | 'contactForm' | 'tags' | 'users' | 'features'
    operation: string
    children: React.ReactNode
    preview?: IAdminPreview
    submitLabel?: string
    submitClassName?: string
    submitVariant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
    footer?: React.ReactNode
    formId?: string
    deferActions?: boolean
    middleSlot?: React.ReactNode
    onFormValuesChange?: (form: HTMLFormElement) => void
    className?: string
    actionsClassName?: string
}) => {
    const [state, action, pending] = useActionState(actionSubmitAdminMutation, initialState)
    const [isPreviewOpen, setIsPreviewOpen] = useState(false)
    const [previewValues, setPreviewValues] = useState(() => new FormData())
    const updatePreview = (form: HTMLFormElement) => {
        setPreviewValues(new FormData(form))
        onFormValuesChange?.(form)
    }

    const actions = (
        <div
            className={[
                footer ? 'flex flex-col gap-2' : 'flex flex-wrap gap-2',
                actionsClassName,
            ]
                .filter(Boolean)
                .join(' ')}
        >
            {preview && (
                <Button
                    onClick={(event) => {
                        const form = event.currentTarget.form
                        if (form) updatePreview(form)
                        setIsPreviewOpen(true)
                    }}
                    type="button"
                    variant="outline"
                >
                    Afficher l’aperçu
                </Button>
            )}
            <Button
                className={submitClassName}
                disabled={pending}
                form={deferActions ? formId : undefined}
                type="submit"
                variant={submitVariant}
            >
                {pending ? 'Traitement…' : (submitLabel ?? operation)}
            </Button>
            {footer}
        </div>
    )

    return (
        <div className={['admin-editor space-y-4', className].filter(Boolean).join(' ')}>
            {isPreviewOpen && preview && (
                <AdminPreview
                    onClose={() => setIsPreviewOpen(false)}
                    preview={preview}
                    values={previewValues}
                />
            )}
            <form
                action={action}
                className="space-y-4"
                id={formId}
                onChange={(event) => updatePreview(event.currentTarget)}
                onInput={(event) => updatePreview(event.currentTarget)}
            >
                <input name="area" type="hidden" value={area} />
                <input name="operation" type="hidden" value={operation} />
                {children}
                {!deferActions && actions}
                {state.message && (
                    <p
                        aria-live="polite"
                        className="text-sm"
                        role={state.success ? 'status' : 'alert'}
                    >
                        {state.message}
                    </p>
                )}
            </form>
            {deferActions && middleSlot}
            {deferActions && actions}
        </div>
    )
}
