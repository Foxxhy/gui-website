'use client'

import { useActionState, useEffect, useRef } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { actionChangeOwnPassword } from '@/actions'
import { ChangeOwnPasswordFields } from '@/components/forms'
import { getRolePermissions } from '@/components/admin/role-permissions'
import { Button } from '@/components/ui/button'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { IActionResult, IAuthenticatedUser } from '@/types'

const ACCOUNT_PARAM = 'account'
const TAB_PARAM = 'tab'
const PASSWORD_FORM_ID = 'account-password-form'

type IAccountTab = 'informations' | 'password' | 'permissions'

const initialState: IActionResult = { success: false, message: '' }

const isAccountTab = (value: string | null): value is IAccountTab =>
    value === 'informations' || value === 'password' || value === 'permissions'

const formatDate = (value: string) =>
    new Date(value).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    })

const AccountInfoTab = ({
    user,
    accountLogin,
}: {
    user: IAuthenticatedUser
    accountLogin?: string
}) => (
    <dl className="space-y-4 text-sm">
        <div className="space-y-1">
            <dt className="font-medium text-muted-foreground">Nom</dt>
            <dd>{user.name}</dd>
        </div>
        <div className="space-y-1">
            <dt className="font-medium text-muted-foreground">Adresse e-mail</dt>
            <dd>{user.email}</dd>
        </div>
        <div className="space-y-1">
            <dt className="font-medium text-muted-foreground">Pseudonyme</dt>
            <dd>{user.pseudonym}</dd>
        </div>
        {accountLogin && (
            <div className="space-y-1">
                <dt className="font-medium text-muted-foreground">Identifiant de connexion</dt>
                <dd>{accountLogin}</dd>
            </div>
        )}
        <div className="space-y-1">
            <dt className="font-medium text-muted-foreground">Membre depuis</dt>
            <dd>{formatDate(user.createdAt)}</dd>
        </div>
    </dl>
)

const AccountPermissionsTab = ({ user }: { user: IAuthenticatedUser }) => {
    const { label, actions } = getRolePermissions(user.role)

    return (
        <div className="space-y-4 text-sm">
            <div className="space-y-1">
                <p className="font-medium text-muted-foreground">Rôle</p>
                <p className="text-base font-medium">{label}</p>
            </div>
            <div className="space-y-2">
                <p className="font-medium text-muted-foreground">Actions possibles</p>
                {actions.length > 0 ? (
                    <ul className="list-disc space-y-1 pl-5">
                        {actions.map((action) => (
                            <li key={action}>{action}</li>
                        ))}
                    </ul>
                ) : (
                    <p>Aucun accès à l’administration.</p>
                )}
            </div>
        </div>
    )
}

export const AccountAdminPanel = ({
    user,
    accountLogin,
}: {
    user: IAuthenticatedUser
    accountLogin?: string
}) => {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const formRef = useRef<HTMLFormElement>(null)
    const [state, action, pending] = useActionState(actionChangeOwnPassword, initialState)

    const isOpen = searchParams.get(ACCOUNT_PARAM) === '1'
    const tabParam = searchParams.get(TAB_PARAM)
    const activeTab: IAccountTab = isAccountTab(tabParam) ? tabParam : 'informations'

    const replaceSearchParams = (mutate: (params: URLSearchParams) => void) => {
        const params = new URLSearchParams(searchParams.toString())
        mutate(params)
        const query = params.toString()
        router.replace(query ? `${pathname}?${query}` : pathname)
    }

    const closePanel = () => {
        replaceSearchParams((params) => {
            params.delete(ACCOUNT_PARAM)
            params.delete(TAB_PARAM)
        })
    }

    const setActiveTab = (tab: IAccountTab) => {
        replaceSearchParams((params) => {
            params.set(ACCOUNT_PARAM, '1')
            params.set(TAB_PARAM, tab)
        })
    }

    const handleCancel = () => {
        formRef.current?.reset()
        closePanel()
    }

    useEffect(() => {
        if (state.success) {
            formRef.current?.reset()
        }
    }, [state.success])

    return (
        <Sheet onOpenChange={(nextOpen) => !nextOpen && closePanel()} open={isOpen}>
            <SheetContent className="flex w-full flex-col gap-0 p-0 sm:max-w-lg">
                <SheetHeader className="px-4 pt-4">
                    <SheetTitle>Mon compte</SheetTitle>
                    <SheetDescription>
                        Consultez vos informations et gérez votre mot de passe.
                    </SheetDescription>
                </SheetHeader>

                <div className="flex min-h-0 flex-1 flex-col">
                    <Tabs
                        className="flex min-h-0 flex-1 flex-col"
                        onValueChange={(value) => setActiveTab(value as IAccountTab)}
                        value={activeTab}
                    >
                        <TabsList className="mx-4 mt-4 w-auto max-w-full overflow-x-auto">
                            <TabsTrigger value="informations">Informations</TabsTrigger>
                            <TabsTrigger value="password">Mot de passe</TabsTrigger>
                            <TabsTrigger value="permissions">Rôle et permissions</TabsTrigger>
                        </TabsList>

                        <div className="flex-1 overflow-y-auto px-4 py-4">
                            <TabsContent className="mt-0" value="informations">
                                <AccountInfoTab accountLogin={accountLogin} user={user} />
                            </TabsContent>
                            <TabsContent className="mt-0" value="password">
                                <form
                                    action={action}
                                    className="space-y-4"
                                    id={PASSWORD_FORM_ID}
                                    ref={formRef}
                                >
                                    <ChangeOwnPasswordFields state={state} />
                                </form>
                            </TabsContent>
                            <TabsContent className="mt-0" value="permissions">
                                <AccountPermissionsTab user={user} />
                            </TabsContent>
                        </div>
                    </Tabs>

                    <SheetFooter className="border-t">
                        <Button
                            className="w-full"
                            disabled={pending}
                            form={activeTab === 'password' ? PASSWORD_FORM_ID : undefined}
                            type={activeTab === 'password' ? 'submit' : 'button'}
                        >
                            {pending ? 'Enregistrement…' : 'Sauvegarder'}
                        </Button>
                        <Button
                            className="w-full"
                            onClick={handleCancel}
                            type="button"
                            variant="outline"
                        >
                            Annuler
                        </Button>
                    </SheetFooter>
                </div>
            </SheetContent>
        </Sheet>
    )
}
