import Link from 'next/link'
import { redirect } from 'next/navigation'
import { logoutAction } from '@/actions'
import { authService, getCurrentSession } from '@/services'

export default async function AdministrationLayout({ children }: LayoutProps<'/administration'>) {
    const session = await getCurrentSession()
    if (!session) redirect('/connexion?returnTo=/administration')
    const { user } = session
    return <><header><p>Connecté : {user.name} ({user.role})</p><nav aria-label="Navigation administration"><ul><li><Link href="/administration">Tableau de bord</Link></li><li><Link href="/administration/articles">Articles</Link></li><li><Link href="/administration/tags">Tags</Link></li><li><Link href="/administration/pages">Pages</Link></li><li><Link href="/administration/formulaire-contact">Formulaire de contact</Link></li>{authService.canManage(user.role, 'analytics') && <li><Link href="/administration/analytics">Analytics</Link></li>}{authService.canManage(user.role, 'users') && <li><Link href="/administration/utilisateurs">Utilisateurs</Link></li>}</ul></nav><form action={logoutAction}><button type="submit">Se déconnecter</button></form></header>{children}</>
}