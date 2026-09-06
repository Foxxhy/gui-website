import { ChangeOwnPasswordForm } from '@/components'
import { AdminPageHeader } from '@/components/admin'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { serviceGetCurrentSession } from '@/services'
import { redirect } from 'next/navigation'

export default async function AccountPage() {
    const session = await serviceGetCurrentSession()
    if (!session) redirect('/connexion?returnTo=/administration/compte')

    return (
        <>
            <AdminPageHeader
                description={`Connecté en tant que ${session.user.name} (${session.user.role}).`}
                title="Mon compte"
            />
            <Card>
                <CardHeader>
                    <CardTitle>Modifier mon mot de passe</CardTitle>
                </CardHeader>
                <CardContent>
                    <ChangeOwnPasswordForm />
                </CardContent>
            </Card>
        </>
    )
}
