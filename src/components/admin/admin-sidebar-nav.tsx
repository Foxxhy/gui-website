'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { actionLogout } from '@/actions'
import { Button, buttonVariants } from '@/components/ui/button'
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'
import type { IRole } from '@/types'
import type { IAdminNavigation } from './navigation'

const isActivePath = (pathname: string, href: string) =>
    href === '/administration' ? pathname === href : pathname === href || pathname.startsWith(`${href}/`)

export const AdminSidebarNav = ({
    navigation,
    siteTitle,
    userName,
    userRole,
}: {
    navigation: IAdminNavigation
    siteTitle: string
    userName: string
    userRole: IRole
}) => {
    const pathname = usePathname()

    return (
        <Sidebar collapsible="offcanvas">
            <SidebarHeader className="border-b border-sidebar-border">
                <div className="px-2 py-1">
                    <p className="font-heading text-sm font-semibold">{siteTitle}</p>
                    <p className="text-xs text-muted-foreground">Administration</p>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    isActive={isActivePath(pathname, navigation.dashboard.href)}
                                    render={<Link href={navigation.dashboard.href} />}
                                >
                                    {navigation.dashboard.label}
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    isActive={isActivePath(pathname, navigation.account.href)}
                                    render={<Link href={navigation.account.href} />}
                                >
                                    {navigation.account.label}
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                {navigation.contentGroup.items.length > 0 && (
                    <SidebarGroup>
                        <SidebarGroupLabel>{navigation.contentGroup.label}</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {navigation.contentGroup.items.map((link) => (
                                    <SidebarMenuItem key={link.href}>
                                        <SidebarMenuButton
                                            isActive={isActivePath(pathname, link.href)}
                                            render={<Link href={link.href} />}
                                        >
                                            {link.label}
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                )}

                {navigation.standaloneLinks.length > 0 && (
                    <SidebarGroup>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {navigation.standaloneLinks.map((link) => (
                                    <SidebarMenuItem key={link.href}>
                                        <SidebarMenuButton
                                            isActive={isActivePath(pathname, link.href)}
                                            render={<Link href={link.href} />}
                                        >
                                            {link.label}
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                )}
            </SidebarContent>
            <SidebarFooter className="border-t border-sidebar-border">
                <div className="flex flex-col gap-3 p-2">
                    <Link
                        className={cn(buttonVariants({ variant: 'default' }), 'w-full justify-center')}
                        href="/"
                    >
                        Retour au site
                    </Link>
                    <p className="text-xs text-muted-foreground">
                        {userName} ({userRole})
                    </p>
                    <form action={actionLogout}>
                        <Button className="w-full" type="submit" variant="outline">
                            Se déconnecter
                        </Button>
                    </form>
                </div>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
