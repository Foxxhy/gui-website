import Link from 'next/link'
import { redirect } from 'next/navigation'
import { actionLogout } from '@/actions'
import { serviceAuth, serviceGetCurrentSession } from '@/services'

export default async function AdministrationLayout({ children }: LayoutProps<'/administration'>) {
    const session = await serviceGetCurrentSession()
    if (!session) redirect('/connexion?returnTo=/administration')
    const { user } = session
    return (
        <>
            <header>
                <p>Connecté : {user.name} ({user.role})</p>
                <nav aria-label="Navigation administration">
                    <ul>
                        <li><Link href="/administration">Tableau de bord</Link></li>
                        <li><Link href="/administration/compte">Mon compte</Link></li>
                        <li>
                            Gestion du contenu
                            <ul>
                                <li><Link href="/administration/pages/page-home">Accueil</Link></li>
                                <li><Link href="/administration/articles">Articles</Link></li>
                                <li><Link href="/administration/tags">Tags</Link></li>
                                <li><Link href="/administration/pages/page-association">Présentation de l’association</Link></li>
                                <li><Link href="/administration/pages/page-gestion-donnees">Gestion des données</Link></li>
                            </ul>
                        </li>
                        {serviceAuth.canManage(user.role, 'users') && (
                            <li><Link href="/administration/utilisateurs">Gestion des utilisateurs</Link></li>
                        )}
                        <li>
                            Configuration
                            <ul>
                                <li><Link href="/administration/formulaire-contact">Formulaire de contact</Link></li>
                            </ul>
                        </li>
                        {serviceAuth.canManage(user.role, 'analytics') && (
                            <li><Link href="/administration/analytics">Analytics</Link></li>
                        )}
                    </ul>
                </nav>
                <form action={actionLogout}><button type="submit">Se déconnecter</button></form>
            </header>
            {children}
        </>
    )
}
