import { configApp } from '@/configs'
import { AdminShell, buildAdminNavigation } from '@/components/admin'
import { serviceAuth, serviceGetCurrentSession } from '@/services'
import { redirect } from 'next/navigation'

export default async function AdministrationLayout({ children }: LayoutProps<'/administration'>) {
    const session = await serviceGetCurrentSession()
    if (!session) redirect('/connexion?returnTo=/administration')

    const { user } = session
    const navigation = buildAdminNavigation(user.role, serviceAuth.canManage)

    return (
        <AdminShell
            navigation={navigation}
            siteTitle={configApp.site.title}
            userName={user.name}
            userRole={user.role}
        >
            {children}
        </AdminShell>
    )
}
