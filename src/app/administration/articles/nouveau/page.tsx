import { AdminMutationForm } from '@/components'
import { AdminPageHeader, ArticleFormFields } from '@/components/admin'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { serviceTag } from '@/services'
import { IStatus, type IArticle } from '@/types'

const newArticlePreview: IArticle = {
    id: 'preview-article',
    title: '',
    slug: '',
    description: '',
    content: '',
    status: IStatus.DRAFT,
    createdAt: '',
    updatedAt: '',
}

export default async function NewArticlePage() {
    const tags = await serviceTag.getTags()

    return (
        <>
            <AdminPageHeader
                description="Page dédiée à la création d’un nouvel article."
                title="Créer un article"
            />
            <Card>
                <CardHeader>
                    <CardTitle>Contenu et métadonnées</CardTitle>
                </CardHeader>
                <CardContent>
                    <AdminMutationForm area="articles" operation="créé" preview={{ kind: 'article', article: newArticlePreview }}>
                        <ArticleFormFields tags={tags} />
                    </AdminMutationForm>
                </CardContent>
            </Card>
        </>
    )
}
