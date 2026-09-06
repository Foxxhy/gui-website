'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
    AdminChangeUserPasswordForm,
    AdminMutationForm,
} from '@/components/forms'
import { UserFormFields } from '@/components/admin/user-form-fields'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { IRole, type IUser } from '@/types'
import { ROLE_LABELS } from './role-permissions'

export const UserAdminPanel = ({
    users,
    initialUserId,
    initialCreate,
}: {
    users: IUser[]
    initialUserId?: string
    initialCreate?: boolean
}) => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [open, setOpen] = useState(Boolean(initialUserId || initialCreate))
    const [mode, setMode] = useState<'create' | 'edit'>(initialCreate ? 'create' : 'edit')
    const [selectedUserId, setSelectedUserId] = useState(initialUserId)

    const selectedUser = users.find((user) => user.id === selectedUserId)

    useEffect(() => {
        if (initialCreate) {
            setMode('create')
            setSelectedUserId(undefined)
            setOpen(true)
            return
        }

        if (initialUserId) {
            setMode('edit')
            setSelectedUserId(initialUserId)
            setOpen(true)
        }
    }, [initialCreate, initialUserId])

    const closePanel = () => {
        setOpen(false)
        setSelectedUserId(undefined)
        if (searchParams.get('user') || searchParams.get('create')) {
            router.replace('/administration/utilisateurs')
        }
    }

    const openCreate = () => {
        setMode('create')
        setSelectedUserId(undefined)
        setOpen(true)
    }

    const openEdit = (userId: string) => {
        setMode('edit')
        setSelectedUserId(userId)
        setOpen(true)
    }

    return (
        <>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between gap-4">
                    <div>
                        <CardTitle>Utilisateurs</CardTitle>
                        <CardDescription>
                            Gérez les comptes et les rôles depuis ce panel.
                        </CardDescription>
                    </div>
                    <Button onClick={openCreate} type="button">
                        Créer un utilisateur
                    </Button>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nom</TableHead>
                                <TableHead>E-mail</TableHead>
                                <TableHead>Rôle</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>
                                        <Badge variant="secondary">{ROLE_LABELS[user.role]}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex flex-wrap items-center justify-end gap-2">
                                            <Button
                                                onClick={() => openEdit(user.id)}
                                                size="sm"
                                                type="button"
                                                variant="outline"
                                            >
                                                Modifier
                                            </Button>
                                            <AdminMutationForm
                                                area="users"
                                                operation="supprimé"
                                                submitClassName="h-7 px-2.5 text-[0.8rem]"
                                                submitLabel="Supprimer"
                                            >
                                                <input name="id" type="hidden" value={user.id} />
                                            </AdminMutationForm>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Sheet onOpenChange={(nextOpen) => !nextOpen && closePanel()} open={open}>
                <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
                    <SheetHeader>
                        <SheetTitle>
                            {mode === 'create'
                                ? 'Créer un utilisateur'
                                : `Modifier : ${selectedUser?.name ?? ''}`}
                        </SheetTitle>
                        <SheetDescription>
                            {mode === 'create'
                                ? 'Ajoutez un nouveau compte administrateur ou éditeur.'
                                : 'Mettez à jour les informations ou le mot de passe de l’utilisateur.'}
                        </SheetDescription>
                    </SheetHeader>

                    <div className="space-y-6 px-4 pb-4">
                        <AdminMutationForm
                            area="users"
                            deferActions
                            footer={
                                <Button
                                    className="w-full"
                                    onClick={closePanel}
                                    type="button"
                                    variant="outline"
                                >
                                    Annuler
                                </Button>
                            }
                            formId="user-mutation-form"
                            middleSlot={
                                mode === 'edit' && selectedUser ? (
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Mot de passe</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <AdminChangeUserPasswordForm
                                                userId={selectedUser.id}
                                            />
                                        </CardContent>
                                    </Card>
                                ) : null
                            }
                            operation={mode === 'create' ? 'créé' : 'modifié'}
                            submitClassName="w-full"
                            submitLabel="Sauvegarder"
                        >
                            <div className="space-y-4">
                                <UserFormFields user={mode === 'edit' ? selectedUser : undefined} />
                            </div>
                        </AdminMutationForm>
                    </div>
                </SheetContent>
            </Sheet>
        </>
    )
}
