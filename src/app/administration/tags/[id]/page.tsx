import { AdminMutationForm } from '@/components'
import { AdminPageHeader, TagFormFields } from '@/components/admin'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { serviceTag } from '@/services'
import { notFound } from 'next/navigation'

export default async function EditTagPage({ params }: PageProps<'/administration/tags/[id]'>) {
    const { id } = await params
    const tag = await serviceTag.getTagById(id)
    if (!tag) notFound()

    return (
        <>
            <AdminPageHeader title={`Modifier : ${tag.name}`} />
            <Card>
                <CardHeader>
                    <CardTitle>Informations du tag</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <AdminMutationForm area="tags" operation="modifié" preview={{ kind: 'tag', tag }}>
                        <input name="id" type="hidden" value={tag.id} />
                        <TagFormFields tag={tag} />
                    </AdminMutationForm>
                    <AdminMutationForm area="tags" operation="supprimé">
                        <input name="id" type="hidden" value={tag.id} />
                    </AdminMutationForm>
                </CardContent>
            </Card>
        </>
    )
}
