'use client'

import type { ReactNode } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export const AdminTabs = ({
    content,
    configuration,
    preview,
    defaultTab = 'content',
}: {
    content: ReactNode
    configuration: ReactNode
    preview?: ReactNode
    defaultTab?: 'content' | 'configuration' | 'preview'
}) => (
    <Tabs defaultValue={defaultTab}>
        <TabsList>
            <TabsTrigger value="content">Contenu</TabsTrigger>
            {preview ? <TabsTrigger value="preview">Aperçu</TabsTrigger> : null}
            <TabsTrigger value="configuration">Configuration</TabsTrigger>
        </TabsList>
        <TabsContent className="mt-4 space-y-4" value="content">
            {content}
        </TabsContent>
        {preview ? (
            <TabsContent className="mt-4 space-y-4" value="preview">
                {preview}
            </TabsContent>
        ) : null}
        <TabsContent className="mt-4 space-y-4" value="configuration">
            {configuration}
        </TabsContent>
    </Tabs>
)
