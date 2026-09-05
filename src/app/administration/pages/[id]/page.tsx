import { AdminMutationForm } from '@/components'
import { contentService } from '@/services'
import { notFound } from 'next/navigation'

export default async function EditPagePage({ params }: PageProps<'/administration/pages/[id]'>) {
    const { id } = await params
    const page = (await contentService.getPages()).find((candidate) => candidate.id === id)
    if (!page) notFound()
    return <main><h1>Modifier : {page.title}</h1><p>Les sections actuelles sont listées pour préparer leur future édition structurée.</p><ol>{page.sections.map((section) => <li key={section.id}>{section.order} — {section.type} : {section.type === 'text' ? section.content : section.title}</li>)}</ol><AdminMutationForm area="pages" operation="modifiée" preview={{ kind: 'page', page }}><input type="hidden" name="id" value={page.id} /><p><label htmlFor="title">Titre</label><br /><input id="title" name="title" defaultValue={page.title} required /></p><p><label htmlFor="content">Contenu</label><br /><textarea id="content" name="content" defaultValue={page.content} required /></p></AdminMutationForm></main>
}