import Link from 'next/link'

export default function AdministrationPage() {
    return <main><h1>Administration</h1><p>Les opérations de ce POC sont validées mais ne persistent pas : les données mockées sont restaurées à chaque lecture.</p><ul><li><Link href="/administration/articles">Gérer les articles</Link></li><li><Link href="/administration/pages">Gérer les pages</Link></li><li><Link href="/administration/formulaire-contact">Configurer le formulaire de contact</Link></li><li><Link href="/administration/analytics">Consulter les analytics</Link></li><li><Link href="/administration/utilisateurs">Gérer les utilisateurs (administrateur)</Link></li></ul></main>
}