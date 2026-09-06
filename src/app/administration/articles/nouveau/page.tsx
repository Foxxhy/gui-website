import { AdminMutationForm } from '@/components'
import { AdminPageHeader } from '@/components/admin'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Titre</Label>
                                <Input id="title" name="title" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="slug">Slug</Label>
                                <Input id="slug" name="slug" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Extrait</Label>
                                <textarea
                                    className="flex min-h-24 w-full rounded-lg border border-input bg-background px-2.5 py-2 text-sm"
                                    id="description"
                                    name="description"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="content">Contenu</Label>
                                <textarea
                                    className="flex min-h-40 w-full rounded-lg border border-input bg-background px-2.5 py-2 text-sm"
                                    id="content"
                                    name="content"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="status">Statut</Label>
                                <select
                                    className="flex h-8 w-full rounded-lg border border-input bg-background px-2.5 text-sm"
                                    defaultValue="draft"
                                    id="status"
                                    name="status"
                                >
                                    <option value="draft">Brouillon</option>
                                    <option value="published">Publié</option>
                                    <option value="cancelled">Annulé</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="tags">Tags</Label>
                                <select
                                    aria-describedby="tags-help"
                                    className="flex min-h-24 w-full rounded-lg border border-input bg-background px-2.5 py-2 text-sm"
                                    id="tags"
                                    multiple
                                    name="tags"
                                >
                                    {tags.map((tag) => (
                                        <option key={tag.id} value={tag.id}>{tag.name}</option>
                                    ))}
                                </select>
                                <p className="text-xs text-muted-foreground" id="tags-help">
                                    Maintenez Ctrl ou Cmd pour sélectionner plusieurs tags.
                                </p>
                            </div>
                        </div>
                    </AdminMutationForm>
                </CardContent>
            </Card>
        </>
    )
}
