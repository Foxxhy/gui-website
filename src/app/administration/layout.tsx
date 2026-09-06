import { configApp } from '@/configs'
import { AdminShell, buildAdminNavigation } from '@/components/admin'
import { serviceAuth, serviceGetCurrentSession, serviceUser } from '@/services'
import { redirect } from 'next/navigation'

export default async function AdministrationLayout({ children }: LayoutProps<'/administration'>) {
    const session = await serviceGetCurrentSession()
    if (!session) redirect('/connexion?returnTo=/administration')

    const { user } = session
    const [navigation, accountLogin] = await Promise.all([
        Promise.resolve(buildAdminNavigation(user.role, serviceAuth.canManage)),
        serviceUser.getAccountLoginByUserId(user.id),
    ])

    return (
        <AdminShell
            accountLogin={accountLogin}
            navigation={navigation}
            siteTitle={configApp.site.title}
            user={user}
        >
            {children}
        </AdminShell>
    )
}
