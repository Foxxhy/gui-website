import { AdminMutationForm } from '@/components'
import { AdminPageHeader } from '@/components/admin'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { serviceTag } from '@/services'
import { TAG_STYLES } from '@/types'
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
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nom</Label>
                                <Input defaultValue={tag.name} id="name" name="name" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="slug">Slug</Label>
                                <Input defaultValue={tag.slug} id="slug" name="slug" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="style">Style</Label>
                                <select
                                    className="flex h-8 w-full rounded-lg border border-input bg-background px-2.5 text-sm"
                                    defaultValue={tag.style}
                                    id="style"
                                    name="style"
                                    required
                                >
                                    {TAG_STYLES.map((style) => (
                                        <option key={style} value={style}>{style}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <textarea
                                    className="flex min-h-24 w-full rounded-lg border border-input bg-background px-2.5 py-2 text-sm"
                                    defaultValue={tag.description}
                                    id="description"
                                    name="description"
                                />
                            </div>
                        </div>
                    </AdminMutationForm>
                    <AdminMutationForm area="tags" operation="supprimé">
                        <input name="id" type="hidden" value={tag.id} />
                    </AdminMutationForm>
                </CardContent>
            </Card>
        </>
    )
}
