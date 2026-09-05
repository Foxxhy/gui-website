import Link from 'next/link'
import { AdminMutationForm, AdminPreviewButton } from '@/components'
import { contentService } from '@/services'

export default async function AdministrationArticlesPage() {
    const articles = await contentService.getAllArticles()
    return <main><h1>Gestion des articles</h1><AdminPreviewButton preview={{ kind: 'articleList', articles }} /><p><Link href="/administration/articles/nouveau">Créer un article</Link></p><table><caption>Articles mockés</caption><thead><tr><th>Titre</th><th>Statut</th><th>Actions</th></tr></thead><tbody>{articles.map((article) => <tr key={article.id}><td>{article.title}</td><td>{article.status}</td><td><Link href={`/administration/articles/${article.id}`}>Consulter / modifier</Link><AdminMutationForm area="articles" operation="supprimé"><input type="hidden" name="id" value={article.id} /></AdminMutationForm></td></tr>)}</tbody></table></main>
}