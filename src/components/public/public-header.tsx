import Link from 'next/link'
import type { IFeatureFlags } from '@/types'
import { filterPublicLinks, publicNavLinks } from './navigation'
import { PublicMobileNav } from './public-mobile-nav'
import { PublicNavLinks } from './public-nav-links'
import { VisualMock } from './visual-mock'

export const PublicHeader = ({
    features,
    siteTitle,
}: {
    features: IFeatureFlags
    siteTitle: string
}) => {
    const links = filterPublicLinks(publicNavLinks, features)

    return (
        <header className="border-b border-border">
            <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
                <Link className="flex shrink-0 items-center gap-3" href="/">
                    <VisualMock
                        className="aspect-square w-10 rounded-md text-[0.5rem]"
                        label="LOGO"
                    />
                    <span className="font-heading text-base font-semibold sm:text-lg">
                        {siteTitle}
                    </span>
                </Link>

                <nav
                    aria-label="Navigation principale"
                    className="hidden md:block"
                >
                    <PublicNavLinks layout="horizontal" links={links} />
                </nav>

                <PublicMobileNav links={links} />
            </div>
        </header>
    )
}
