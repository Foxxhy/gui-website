'use client'

import Link from 'next/link'
import { MenuIcon } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import type { IPublicNavLink } from './navigation'

export const PublicMobileNav = ({ links }: { links: IPublicNavLink[] }) => (
    <Sheet>
        <SheetTrigger
            render={
                <Button
                    aria-label="Ouvrir le menu de navigation"
                    className="md:hidden"
                    size="icon"
                    variant="outline"
                />
            }
        >
            <MenuIcon />
        </SheetTrigger>
        <SheetContent className="w-full max-w-xs" side="right">
            <SheetHeader>
                <SheetTitle>Navigation</SheetTitle>
            </SheetHeader>
            <nav aria-label="Navigation principale">
                <ul className="flex flex-col gap-2 px-4">
                    {links.map((link) => (
                        <li key={link.href}>
                            {link.highlighted ? (
                                <Link
                                    className={cn(
                                        buttonVariants({ variant: 'default' }),
                                        'w-full justify-center'
                                    )}
                                    href={link.href}
                                >
                                    {link.label}
                                </Link>
                            ) : (
                                <Link
                                    className="block rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted"
                                    href={link.href}
                                >
                                    {link.label}
                                </Link>
                            )}
                        </li>
                    ))}
                </ul>
            </nav>
        </SheetContent>
    </Sheet>
)
