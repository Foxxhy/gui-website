import { AdminMutationForm } from '@/components'
import { tagService } from '@/services'
import { notFound } from 'next/navigation'

export default async function EditTagPage({ params }: PageProps<'/administration/tags/[id]'>) {
    const { id } = await params
    const tag = await tagService.getTagById(id)
    if (!tag) notFound()
    return <main><h1>Modifier : {tag.name}</h1><AdminMutationForm area="tags" operation="modifié"><input type="hidden" name="id" value={tag.id} /><p><label htmlFor="name">Nom</label><br /><input id="name" name="name" required defaultValue={tag.name} /></p><p><label htmlFor="slug">Slug</label><br /><input id="slug" name="slug" required defaultValue={tag.slug} /></p><p><label htmlFor="style">Style</label><br /><input id="style" name="style" required defaultValue={tag.style} /></p><p><label htmlFor="description">Description</label><br /><textarea id="description" name="description" defaultValue={tag.description} /></p></AdminMutationForm><AdminMutationForm area="tags" operation="supprimé"><input type="hidden" name="id" value={tag.id} /></AdminMutationForm></main>
}
