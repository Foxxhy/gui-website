import Link from 'next/link'
import { AdminMutationForm, AdminPreviewButton } from '@/components'
import { serviceContent, serviceFeature } from '@/services'

export default async function AdministrationArticlesPage() {
    const [articles, features] = await Promise.all([
        serviceContent.getAllArticles(),
        serviceFeature.getFlags(),
    ])
    return <main><h1>Gestion des articles</h1><section><h2>Statut</h2><AdminMutationForm area="features" operation="Mettre à jour le statut"><input type="hidden" name="feature" value="articles" /><p><input id="articles-enabled" type="checkbox" name="enabled" value="true" defaultChecked={features.articles} /><input type="hidden" name="enabled" value="false" /><label htmlFor="articles-enabled">Module Articles activé</label></p></AdminMutationForm></section><AdminPreviewButton preview={{ kind: 'articleList', articles }} /><p><Link href="/administration/articles/nouveau">Créer un article</Link></p><table><caption>Articles mockés</caption><thead><tr><th>Titre</th><th>Statut</th><th>Actions</th></tr></thead><tbody>{articles.map((article) => <tr key={article.id}><td>{article.title}</td><td>{article.status}</td><td><Link href={`/administration/articles/${article.id}`}>Consulter / modifier</Link><AdminMutationForm area="articles" operation="supprimé"><input type="hidden" name="id" value={article.id} /></AdminMutationForm></td></tr>)}</tbody></table></main>
}