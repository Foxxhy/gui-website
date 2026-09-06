'use client'

import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AdminSidebarNav } from './admin-sidebar-nav'
import type { IAdminNavigation } from './navigation'

export const AdminShell = ({
    children,
    navigation,
    siteTitle,
}: {
    children: React.ReactNode
    navigation: IAdminNavigation
    siteTitle: string
    userName?: string
    userRole?: string
}) => (
    <SidebarProvider>
        <AdminSidebarNav navigation={navigation} siteTitle={siteTitle} />
        <SidebarInset>
            <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
                <SidebarTrigger />
                <p className="text-sm text-muted-foreground md:hidden">Administration</p>
            </header>
            <div className="flex flex-1 flex-col p-4 md:p-6">{children}</div>
        </SidebarInset>
    </SidebarProvider>
)
