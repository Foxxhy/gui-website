'use client'

import { MenuIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet'
import type { IPublicNavLink } from './navigation'
import { PublicNavLinks } from './public-nav-links'

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
            <nav aria-label="Navigation principale" className="px-4">
                <PublicNavLinks layout="vertical" links={links} />
            </nav>
        </SheetContent>
    </Sheet>
)
