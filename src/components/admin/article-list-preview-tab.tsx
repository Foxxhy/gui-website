'use client'

import { useState } from 'react'
import { CircleAlertIcon } from 'lucide-react'
import { AdminPreview } from '@/components/preview'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { IArticle } from '@/types'

export const ArticleListPreviewTab = ({ articles }: { articles: IArticle[] }) => {
    const [isPreviewOpen, setIsPreviewOpen] = useState(false)

    return (
        <Card>
            <CardHeader>
                <CardTitle>Aperçu de la liste</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <Alert>
                    <CircleAlertIcon />
                    <AlertTitle>Fonctionnalité en cours de développement</AlertTitle>
                    <AlertDescription>
                        L’aperçu de la liste des articles est encore un travail en cours. Il permet
                        de visualiser le rendu public approximatif des contenus, sans garantir une
                        fidélité complète ni une expérience finale.
                    </AlertDescription>
                </Alert>
                <Button onClick={() => setIsPreviewOpen(true)} type="button">
                    Aperçu
                </Button>
                {isPreviewOpen ? (
                    <AdminPreview
                        onClose={() => setIsPreviewOpen(false)}
                        preview={{ kind: 'articleList', articles }}
                        values={new FormData()}
                    />
                ) : null}
            </CardContent>
        </Card>
    )
}
