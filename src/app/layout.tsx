import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import { headers } from 'next/headers'
import { configApp } from '@/configs'
import { TooltipProvider } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import './globals.css'

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
    title: configApp.site.title,
    description: configApp.site.description,
}

export default async function RootLayout({ children }: LayoutProps<'/'>) {
    const nonce = (await headers()).get('x-nonce') ?? undefined

    return (
        <html lang="fr" className={cn('font-sans', geist.variable)} data-nonce={nonce}>
            <body>
                <TooltipProvider>{children}</TooltipProvider>
            </body>
        </html>
    )
}
