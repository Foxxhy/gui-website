import { redirect } from 'next/navigation'

export default async function EditUserRedirectPage({
    params,
}: PageProps<'/administration/utilisateurs/[id]'>) {
    const { id } = await params
    redirect(`/administration/utilisateurs?user=${id}`)
}
