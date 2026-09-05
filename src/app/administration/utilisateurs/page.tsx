import Link from 'next/link'
import { redirect } from 'next/navigation'
import { authService, getCurrentSession, userService } from '@/services'

export default async function AdministrationUsersPage() {
    const session = await getCurrentSession()
    if (!session || !authService.canManage(session.user.role, 'users')) redirect('/administration')
    const users = await userService.getUsers()
    return <main><h1>Gestion des utilisateurs</h1><p><Link href="/administration/utilisateurs/nouveau">Créer un utilisateur</Link></p><ul>{users.map((user) => <li key={user.id}>{user.name} — {user.role} — <Link href={`/administration/utilisateurs/${user.id}`}>consulter / modifier</Link></li>)}</ul></main>
}