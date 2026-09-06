import { redirect } from 'next/navigation'

export default async function EditTagPage({ params }: PageProps<'/administration/tags/[id]'>) {
    const { id } = await params
    redirect(`/administration/tags?tag=${encodeURIComponent(id)}`)
}
