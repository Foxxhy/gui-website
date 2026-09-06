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
import type { IAdminNavigation } from './navigation'

const isActivePath = (pathname: string, href: string) =>
    href === '/administration' ? pathname === href : pathname === href || pathname.startsWith(`${href}/`)

export const AdminSidebarNav = ({
    navigation,
    siteTitle,
}: {
    navigation: IAdminNavigation
    siteTitle: string
}) => {
    const pathname = usePathname()

    return (
        <Sidebar collapsible="offcanvas">
            <SidebarHeader className="border-b border-sidebar-border">
                <div className="flex flex-col items-center gap-3 px-2 py-2">
                    <div
                        aria-hidden="true"
                        className="mx-auto flex size-10 items-center justify-center rounded-lg border border-pink-300 bg-pink-200 text-[10px] font-medium tracking-wide text-pink-900 uppercase"
                    >
                        Logo
                    </div>
                    <div className="text-center group-data-[collapsible=icon]:hidden">
                        <p className="font-heading text-sm font-semibold">{siteTitle}</p>
                        <p className="text-xs text-muted-foreground">Administration</p>
                    </div>
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

                {navigation.associationGroup.items.length > 0 && (
                    <SidebarGroup>
                        <SidebarGroupLabel>{navigation.associationGroup.label}</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {navigation.associationGroup.items.map((link) => (
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
                <div className="flex flex-col gap-2 p-2">
                    <Link
                        className={cn(
                            buttonVariants({
                                variant: isActivePath(pathname, navigation.account.href)
                                    ? 'secondary'
                                    : 'outline',
                            }),
                            'w-full justify-center'
                        )}
                        href={navigation.account.href}
                    >
                        {navigation.account.label}
                    </Link>
                    <form action={actionLogout}>
                        <Button className="w-full" type="submit">
                            Se déconnecter
                        </Button>
                    </form>
                </div>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
