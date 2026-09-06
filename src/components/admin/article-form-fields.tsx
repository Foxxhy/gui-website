import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { IStatus, type IArticle, type ITag } from '@/types'

export const ArticleFormFields = ({
    article,
    tags,
}: {
    article?: Pick<IArticle, 'title' | 'slug' | 'description' | 'content' | 'status' | 'tags'>
    tags: ITag[]
}) => {
    const selectedTagIds = new Set(article?.tags?.map((tag) => tag.id))

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="title">Titre</Label>
                <Input defaultValue={article?.title} id="title" name="title" required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input defaultValue={article?.slug} id="slug" name="slug" required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="description">Extrait</Label>
                <Textarea defaultValue={article?.description} id="description" name="description" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="content">Contenu</Label>
                <Textarea
                    className="min-h-40"
                    defaultValue={article?.content}
                    id="content"
                    name="content"
                    required
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="status">Statut</Label>
                <Select defaultValue={article?.status ?? IStatus.DRAFT} id="status" name="status">
                    <option value="draft">Brouillon</option>
                    <option value="published">Publié</option>
                    <option value="cancelled">Annulé</option>
                </Select>
            </div>
            <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <Select
                    aria-describedby="tags-help"
                    className="min-h-24"
                    defaultValue={article ? [...selectedTagIds] : undefined}
                    id="tags"
                    multiple
                    name="tags"
                >
                    {tags.map((tag) => (
                        <option key={tag.id} value={tag.id}>{tag.name}</option>
                    ))}
                </Select>
                <p className="text-xs text-muted-foreground" id="tags-help">
                    Maintenez Ctrl ou Cmd pour sélectionner plusieurs tags.
                </p>
            </div>
        </div>
    )
}
