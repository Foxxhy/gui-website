import Link from 'next/link'

export default function NotFound() {
    return <main><h1>Contenu introuvable</h1><p>Cette ressource n’existe pas ou n’est pas accessible au public.</p><Link href="/">Retour à l’accueil</Link></main>
}