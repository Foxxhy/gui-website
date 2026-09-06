import { ChangeOwnPasswordForm } from '@/components'
import { serviceGetCurrentSession } from '@/services'
import { redirect } from 'next/navigation'

export default async function AccountPage() {
    const session = await serviceGetCurrentSession()
    if (!session) redirect('/connexion?returnTo=/administration/compte')
    return (
        <main>
            <h1>Mon compte</h1>
            <p>Connecté en tant que {session.user.name} ({session.user.role}).</p>
            <section aria-labelledby="password-change-title">
                <h2 id="password-change-title">Modifier mon mot de passe</h2>
                <ChangeOwnPasswordForm />
            </section>
        </main>
    )
}
