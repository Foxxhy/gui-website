import { AdminMutationForm } from '@/components'
import { serviceContent, serviceTag } from '@/services'
import { notFound } from 'next/navigation'

export default async function EditArticlePage({ params }: PageProps<'/administration/articles/[id]'>) {
    const { id } = await params
    const article = await serviceContent.getArticleById(id)
    if (!article) notFound()
    const tags = await serviceTag.getTags()
    const selectedTagIds = new Set(article.tags?.map((tag) => tag.id))
    return <main><h1>Modifier : {article.title}</h1><AdminMutationForm area="articles" operation="modifié" preview={{ kind: 'article', article }}><input type="hidden" name="id" value={article.id} /><p><label htmlFor="title">Titre</label><br /><input id="title" name="title" required defaultValue={article.title} /></p><p><label htmlFor="slug">Slug</label><br /><input id="slug" name="slug" required defaultValue={article.slug} /></p><p><label htmlFor="description">Extrait</label><br /><textarea id="description" name="description" defaultValue={article.description} /></p><p><label htmlFor="content">Contenu</label><br /><textarea id="content" name="content" required defaultValue={article.content} /></p><p><label htmlFor="status">Statut</label><br /><select id="status" name="status" defaultValue={article.status}><option value="draft">Brouillon</option><option value="published">Publié</option><option value="cancelled">Annulé</option></select></p><p><label htmlFor="tags">Tags</label><br /><select id="tags" name="tags" multiple defaultValue={[...selectedTagIds]} aria-describedby="tags-help">{tags.map((tag) => <option key={tag.id} value={tag.id}>{tag.name}</option>)}</select><br /><small id="tags-help">Maintenez Ctrl ou Cmd pour sélectionner plusieurs tags.</small></p></AdminMutationForm></main>
}