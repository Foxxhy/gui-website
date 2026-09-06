import { PublicShell } from '@/components/public/public-shell'
import { configApp } from '@/configs'
import { serviceFeature } from '@/services'

export default async function PublicLayout({ children }: LayoutProps<'/'>) {
    const features = await serviceFeature.getFlags()

    return (
        <PublicShell features={features} siteTitle={configApp.site.title}>
            {children}
        </PublicShell>
    )
}
