import { AdminMutationForm } from '@/components'
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
    return <main><h1>Créer un article</h1><AdminMutationForm area="articles" operation="créé" preview={{ kind: 'article', article: newArticlePreview }}><p><label htmlFor="title">Titre</label><br /><input id="title" name="title" required /></p><p><label htmlFor="slug">Slug</label><br /><input id="slug" name="slug" required /></p><p><label htmlFor="description">Extrait</label><br /><textarea id="description" name="description" /></p><p><label htmlFor="content">Contenu</label><br /><textarea id="content" name="content" required /></p><p><label htmlFor="status">Statut</label><br /><select id="status" name="status" defaultValue="draft"><option value="draft">Brouillon</option><option value="published">Publié</option><option value="cancelled">Annulé</option></select></p><p><label htmlFor="tags">Tags</label><br /><select id="tags" name="tags" multiple aria-describedby="tags-help">{tags.map((tag) => <option key={tag.id} value={tag.id}>{tag.name}</option>)}</select><br /><small id="tags-help">Maintenez Ctrl ou Cmd pour sélectionner plusieurs tags.</small></p></AdminMutationForm></main>
}