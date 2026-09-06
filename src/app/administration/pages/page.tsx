import Link from 'next/link'
import { serviceContent } from '@/services'

export default async function AdministrationPagesPage() {
    const pages = await serviceContent.getPages()
    return <main><h1>Gestion des pages</h1><ul>{pages.map((page) => <li key={page.id}><Link href={`/administration/pages/${page.id}`}>{page.title}</Link></li>)}</ul></main>
}