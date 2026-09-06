import type { IFeatureFlags } from '@/types'
import { PublicFooter } from './public-footer'
import { PublicHeader } from './public-header'

export const PublicShell = ({
    children,
    features,
    siteTitle,
}: {
    children: React.ReactNode
    features: IFeatureFlags
    siteTitle: string
}) => (
    <div className="flex min-h-svh flex-col">
        <PublicHeader features={features} siteTitle={siteTitle} />
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">{children}</main>
        <PublicFooter features={features} siteTitle={siteTitle} />
    </div>
)
