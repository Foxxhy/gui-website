import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { IPublicNavLink } from './navigation'

export const PublicNavLinks = ({
    links,
    layout = 'horizontal',
}: {
    links: IPublicNavLink[]
    layout?: 'horizontal' | 'vertical'
}) => (
    <ul className={cn('flex', layout === 'horizontal' ? 'items-center gap-1' : 'flex-col gap-2')}>
        {links.map((link) => (
            <li key={link.href}>
                {link.highlighted ? (
                    <Link
                        className={cn(
                            buttonVariants({ variant: 'default' }),
                            layout === 'vertical' && 'w-full justify-center'
                        )}
                        href={link.href}
                    >
                        {link.label}
                    </Link>
                ) : (
                    <Link
                        className={cn(
                            'rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted',
                            layout === 'vertical' && 'block'
                        )}
                        href={link.href}
                    >
                        {link.label}
                    </Link>
                )}
            </li>
        ))}
    </ul>
)
