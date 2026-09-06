import Link from 'next/link'
import {
    AdminPageHeader,
    AdminTabs,
    ArticleListPreviewTab,
    ArticleStatusCombobox,
    FeatureFlagForm,
} from '@/components/admin'
import { ArticleListActions } from '@/components/admin/article-list-actions'
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
                            <Button
                                nativeButton={false}
                                render={<Link href="/administration/articles/nouveau" />}
                            >
                                Rédiger
                            </Button>
                        </CardHeader>
                        <CardContent>
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
                                                <ArticleStatusCombobox article={article} />
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <ArticleListActions
                                                    articleId={article.id}
                                                    articleTitle={article.title}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                }
                preview={<ArticleListPreviewTab articles={articles} />}
            />
        </>
    )
}
