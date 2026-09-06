import Link from 'next/link'
import { redirect } from 'next/navigation'
import { serviceAuth, serviceGetCurrentSession, serviceUser } from '@/services'

export default async function AdministrationUsersPage() {
    const session = await serviceGetCurrentSession()
    if (!session || !serviceAuth.canManage(session.user.role, 'users')) redirect('/administration')
    const users = await serviceUser.getUsers()
    return <main><h1>Gestion des utilisateurs</h1><p><Link href="/administration/utilisateurs/nouveau">Créer un utilisateur</Link></p><ul>{users.map((user) => <li key={user.id}>{user.name} — {user.role} — <Link href={`/administration/utilisateurs/${user.id}`}>consulter / modifier</Link></li>)}</ul></main>
}