import { AdminMutationForm } from '@/components'
import { AdminPageHeader, TagFormFields } from '@/components/admin'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { ITag } from '@/types'

const newTagPreview: ITag = {
    id: 'preview-tag',
    name: '',
    slug: '',
    style: 'green',
    description: '',
}

export default function NewTagPage() {
    return (
        <>
            <AdminPageHeader title="Créer un tag" />
            <Card>
                <CardHeader>
                    <CardTitle>Informations du tag</CardTitle>
                </CardHeader>
                <CardContent>
                    <AdminMutationForm area="tags" operation="créé" preview={{ kind: 'tag', tag: newTagPreview }}>
                        <TagFormFields />
                    </AdminMutationForm>
                </CardContent>
            </Card>
        </>
    )
}
