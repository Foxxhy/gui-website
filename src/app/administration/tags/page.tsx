import Link from 'next/link'
import { AdminPageHeader } from '@/components/admin'
import { TagBadge } from '@/components/public/tag-badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { serviceTag } from '@/services'

export default async function AdministrationTagsPage() {
    const tags = await serviceTag.getTags()

    return (
        <>
            <AdminPageHeader
                description="Gérez les tags utilisés pour classer les articles."
                title="Gestion des tags"
            />
            <Card>
                <CardHeader className="flex flex-row items-center justify-between gap-4">
                    <CardTitle>Tags</CardTitle>
                    <Button nativeButton={false} render={<Link href="/administration/tags/nouveau" />}>
                        Créer un tag
                    </Button>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nom</TableHead>
                                <TableHead>Slug</TableHead>
                                <TableHead>Style</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {tags.map((tag) => (
                                <TableRow key={tag.id}>
                                    <TableCell>{tag.name}</TableCell>
                                    <TableCell>{tag.slug}</TableCell>
                                    <TableCell>
                                        <TagBadge tag={tag} />
                                    </TableCell>
                                    <TableCell>{tag.description || '—'}</TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            nativeButton={false}
                                            render={<Link href={`/administration/tags/${tag.id}`} />}
                                            size="sm"
                                            variant="outline"
                                        >
                                            Modifier
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </>
    )
}
