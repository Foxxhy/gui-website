import type { Metadata } from "next"
import { configApp } from '@/configs'
import "./globals.css"
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
    title: configApp.site.title,
    description: configApp.site.description,
}

export default function RootLayout({ children }: LayoutProps<"/">) {
    return (
        <html lang="fr" className={cn("font-sans", geist.variable)}>
            <body>{children}</body>
        </html>
    )
}
