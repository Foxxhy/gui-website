import Link from 'next/link'
import { serviceTag } from '@/services'

export default async function AdministrationTagsPage() {
    const tags = await serviceTag.getTags()
    return <main><h1>Gestion des tags</h1><p><Link href="/administration/tags/nouveau">Créer un tag</Link></p><table><caption>Tags mockés</caption><thead><tr><th>Nom</th><th>Slug</th><th>Style</th><th>Description</th><th>Actions</th></tr></thead><tbody>{tags.map((tag) => <tr key={tag.id}><td>{tag.name}</td><td>{tag.slug}</td><td>{tag.style}</td><td>{tag.description || '—'}</td><td><Link href={`/administration/tags/${tag.id}`}>Modifier</Link></td></tr>)}</tbody></table></main>
}
