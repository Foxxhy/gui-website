import type { Metadata } from "next"
import { appConfig } from '@/configs'
import "./globals.css"

export const metadata: Metadata = {
    title: appConfig.site.title,
    description: appConfig.site.description,
}

export default function RootLayout({ children }: LayoutProps<"/">) {
    return (
        <html lang="fr">
            <body>{children}</body>
        </html>
    )
}
