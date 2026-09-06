import { AdminMutationForm } from '@/components'
import { AdminPageHeader } from '@/components/admin'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { TAG_STYLES, type ITag } from '@/types'

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
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nom</Label>
                                <Input id="name" name="name" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="slug">Slug</Label>
                                <Input id="slug" name="slug" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="style">Style</Label>
                                <select
                                    className="flex h-8 w-full rounded-lg border border-input bg-background px-2.5 text-sm"
                                    defaultValue="green"
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
                                    id="description"
                                    name="description"
                                />
                            </div>
                        </div>
                    </AdminMutationForm>
                </CardContent>
            </Card>
        </>
    )
}
