import Link from 'next/link'
import { AdminPageHeader } from '@/components/admin'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { serviceContent } from '@/services'

export default async function AdministrationPagesPage() {
    const pages = await serviceContent.getPages()

    return (
        <>
            <AdminPageHeader
                description="Index des pages administrables du site public."
                title="Gestion du contenu — Pages"
            />
            <Card>
                <CardHeader>
                    <CardTitle>Pages</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-2">
                        {pages.map((page) => (
                            <li key={page.id}>
                                <Link className="font-medium hover:underline" href={`/administration/pages/${page.id}`}>
                                    {page.title}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
        </>
    )
}
