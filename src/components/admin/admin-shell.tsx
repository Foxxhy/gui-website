'use client'

import { Suspense } from 'react'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AccountAdminPanel } from './account-admin-panel'
import { AdminSidebarNav } from './admin-sidebar-nav'
import type { IAdminNavigation } from './navigation'
import type { IAuthenticatedUser } from '@/types'

export const AdminShell = ({
    children,
    navigation,
    siteTitle,
    user,
    accountLogin,
}: {
    children: React.ReactNode
    navigation: IAdminNavigation
    siteTitle: string
    user: IAuthenticatedUser
    accountLogin?: string
}) => (
    <SidebarProvider>
        <Suspense fallback={null}>
            <AdminSidebarNav navigation={navigation} siteTitle={siteTitle} />
        </Suspense>
        <SidebarInset>
            <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
                <SidebarTrigger />
                <p className="text-sm text-muted-foreground md:hidden">Administration</p>
            </header>
            <div className="flex flex-1 flex-col p-4 md:p-6">{children}</div>
        </SidebarInset>
        <Suspense fallback={null}>
            <AccountAdminPanel accountLogin={accountLogin} user={user} />
        </Suspense>
    </SidebarProvider>
)
