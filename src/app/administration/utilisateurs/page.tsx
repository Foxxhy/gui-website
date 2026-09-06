import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import { AdminPageHeader } from '@/components/admin'
import { UserAdminPanel } from '@/components/admin/user-admin-panel'
import { serviceAuth, serviceGetCurrentSession, serviceUser } from '@/services'

export default async function AdministrationUsersPage({
    searchParams,
}: PageProps<'/administration/utilisateurs'>) {
    const session = await serviceGetCurrentSession()
    if (!session || !serviceAuth.canManage(session.user.role, 'users')) redirect('/administration')

    const [users, params] = await Promise.all([serviceUser.getUsers(), searchParams])
    const initialUserId = typeof params.user === 'string' ? params.user : undefined
    const initialCreate = params.create === '1'

    return (
        <>
            <AdminPageHeader
                description="Consultez et modifiez les comptes depuis un panel latéral."
                title="Gestion des utilisateurs"
            />
            <Suspense fallback={<p>Chargement du panel utilisateurs…</p>}>
                <UserAdminPanel
                    initialCreate={initialCreate}
                    initialUserId={initialUserId}
                    users={users}
                />
            </Suspense>
        </>
    )
}
