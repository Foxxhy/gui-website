import type { Metadata } from "next"
import { configApp } from '@/configs'
import "./globals.css"

export const metadata: Metadata = {
    title: configApp.site.title,
    description: configApp.site.description,
}

export default function RootLayout({ children }: LayoutProps<"/">) {
    return (
        <html lang="fr">
            <body>{children}</body>
        </html>
    )
}
