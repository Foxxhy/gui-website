import Link from 'next/link'
import type { IFeatureFlags } from '@/types'
import { filterPublicLinks, publicFooterLinks } from './navigation'

export const PublicFooter = ({
    features,
    siteTitle,
}: {
    features: IFeatureFlags
    siteTitle: string
}) => {
    const links = filterPublicLinks(publicFooterLinks, features)

    return (
        <footer className="border-t border-border bg-muted/40">
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6">
                <div>
                    <p className="font-heading text-base font-semibold">{siteTitle}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Plan du site et accès aux pages publiques.
                    </p>
                </div>
                <nav aria-label="Plan du site">
                    <ul className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
                        {links.map((link) => (
                            <li key={link.href}>
                                <Link
                                    className="text-sm font-medium hover:underline"
                                    href={link.href}
                                >
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </footer>
    )
}
