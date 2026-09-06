import Link from 'next/link'
import { AdminMutationForm, AdminPreviewButton } from '@/components'
import { AdminPageHeader, AdminTabs, FeatureFlagForm } from '@/components/admin'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { serviceContent, serviceFeature } from '@/services'

export default async function AdministrationArticlesPage() {
    const [articles, features] = await Promise.all([
        serviceContent.getAllArticles(),
        serviceFeature.getFlags(),
    ])

    return (
        <>
            <AdminPageHeader
                description="Gérez la liste des articles et la configuration du module."
                title="Gestion des articles"
            />
            <AdminTabs
                configuration={<FeatureFlagForm enabled={features.articles} feature="articles" />}
                content={
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between gap-4">
                            <CardTitle>Liste des articles</CardTitle>
                            <Button nativeButton={false} render={<Link href="/administration/articles/nouveau" />}>
                                Créer un article
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <AdminPreviewButton preview={{ kind: 'articleList', articles }} />
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Titre</TableHead>
                                        <TableHead>Statut</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {articles.map((article) => (
                                        <TableRow key={article.id}>
                                            <TableCell>{article.title}</TableCell>
                                            <TableCell>
                                                <Badge variant="secondary">{article.status}</Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        nativeButton={false}
                                                        render={
                                                            <Link
                                                                href={`/administration/articles/${article.id}`}
                                                            />
                                                        }
                                                        size="sm"
                                                        variant="outline"
                                                    >
                                                        Consulter / modifier
                                                    </Button>
                                                    <AdminMutationForm area="articles" operation="supprimé">
                                                        <input name="id" type="hidden" value={article.id} />
                                                    </AdminMutationForm>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                }
            />
        </>
    )
}
