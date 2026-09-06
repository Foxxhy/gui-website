'use client'

import type { ReactNode } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export const AdminTabs = ({
    content,
    configuration,
    defaultTab = 'content',
}: {
    content: ReactNode
    configuration: ReactNode
    defaultTab?: 'content' | 'configuration'
}) => (
    <Tabs defaultValue={defaultTab}>
        <TabsList>
            <TabsTrigger value="content">Contenu</TabsTrigger>
            <TabsTrigger value="configuration">Configuration</TabsTrigger>
        </TabsList>
        <TabsContent className="mt-4 space-y-4" value="content">
            {content}
        </TabsContent>
        <TabsContent className="mt-4 space-y-4" value="configuration">
            {configuration}
        </TabsContent>
    </Tabs>
)
