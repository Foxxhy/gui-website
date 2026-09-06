import { Suspense } from 'react'
import { AdminPageHeader } from '@/components/admin'
import { TagAdminPanel } from '@/components/admin/tag-admin-panel'
import { serviceTag } from '@/services'

export default async function AdministrationTagsPage({
    searchParams,
}: PageProps<'/administration/tags'>) {
    const [tags, params] = await Promise.all([serviceTag.getTags(), searchParams])
    const initialTagId = typeof params.tag === 'string' ? params.tag : undefined
    const initialCreate = params.create === '1'

    return (
        <>
            <AdminPageHeader
                description="Gérez les tags utilisés pour classer les articles."
                title="Gestion des tags"
            />
            <Suspense fallback={<p>Chargement du panel tags…</p>}>
                <TagAdminPanel
                    initialCreate={initialCreate}
                    initialTagId={initialTagId}
                    tags={tags}
                />
            </Suspense>
        </>
    )
}
