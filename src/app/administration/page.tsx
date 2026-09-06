import Link from 'next/link'

export default function AdministrationPage() {
    return (
        <main>
            <h1>Administration</h1>
            <p>Les opérations de ce POC sont validées mais ne persistent pas : les données mockées sont restaurées à chaque lecture.</p>
            <section>
                <h2>Gestion du contenu</h2>
                <ul>
                    <li><Link href="/administration/pages/page-home">Accueil</Link></li>
                    <li><Link href="/administration/articles">Articles</Link></li>
                    <li><Link href="/administration/tags">Tags</Link></li>
                    <li><Link href="/administration/pages/page-association">Présentation de l’association</Link></li>
                    <li><Link href="/administration/pages/page-gestion-donnees">Gestion des données</Link></li>
                </ul>
            </section>
            <section>
                <h2>Configuration</h2>
                <ul>
                    <li><Link href="/administration/formulaire-contact">Formulaire de contact</Link></li>
                </ul>
            </section>
            <section>
                <h2>Autres</h2>
                <ul>
                    <li><Link href="/administration/analytics">Consulter les analytics</Link></li>
                    <li><Link href="/administration/utilisateurs">Gérer les utilisateurs (administrateur)</Link></li>
                </ul>
            </section>
        </main>
    )
}
