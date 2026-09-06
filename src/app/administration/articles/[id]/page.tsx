import { AdminMutationForm } from '@/components'
import { AdminPageHeader, ArticleFormFields } from '@/components/admin'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { serviceContent, serviceTag } from '@/services'
import { notFound } from 'next/navigation'

export default async function EditArticlePage({ params }: PageProps<'/administration/articles/[id]'>) {
    const { id } = await params
    const article = await serviceContent.getArticleById(id)
    if (!article) notFound()
    const tags = await serviceTag.getTags()

    return (
        <>
            <AdminPageHeader
                description="Page dédiée à l’édition complète de l’article."
                title={`Modifier : ${article.title}`}
            />
            <Card>
                <CardHeader>
                    <CardTitle>Contenu et métadonnées</CardTitle>
                </CardHeader>
                <CardContent>
                    <AdminMutationForm area="articles" operation="modifié" preview={{ kind: 'article', article }}>
                        <input name="id" type="hidden" value={article.id} />
                        <ArticleFormFields article={article} tags={tags} />
                    </AdminMutationForm>
                </CardContent>
            </Card>
        </>
    )
}
