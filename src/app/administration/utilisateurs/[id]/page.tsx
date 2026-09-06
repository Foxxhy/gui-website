import { AdminChangeUserPasswordForm, AdminMutationForm } from '@/components'
import { serviceAuth, serviceGetCurrentSession, serviceUser } from '@/services'
import { notFound, redirect } from 'next/navigation'

export default async function EditUserPage({ params }: PageProps<'/administration/utilisateurs/[id]'>) {
    const session = await serviceGetCurrentSession()
    if (!session || !serviceAuth.canManage(session.user.role, 'users')) redirect('/administration')
    const { id } = await params
    const user = await serviceUser.getUserById(id)
    if (!user) notFound()
    return <main><h1>Modifier : {user.name}</h1><AdminMutationForm area="users" operation="modifié"><input type="hidden" name="id" value={user.id} /><p><label htmlFor="name">Nom</label><br /><input id="name" name="name" defaultValue={user.name} required /></p><p><label htmlFor="email">E-mail</label><br /><input id="email" name="email" type="email" defaultValue={user.email} required /></p><p><label htmlFor="pseudonym">Pseudonyme</label><br /><input id="pseudonym" name="pseudonym" defaultValue={user.pseudonym} required /></p><p><label htmlFor="role">Rôle</label><br /><select id="role" name="role" defaultValue={user.role}><option value="editor">Éditeur</option><option value="admin">Administrateur</option><option value="blocked">Bloqué</option></select></p></AdminMutationForm><section aria-labelledby="admin-password-title"><h2 id="admin-password-title">Mot de passe</h2><AdminChangeUserPasswordForm userId={user.id} /></section><AdminMutationForm area="users" operation="supprimé"><input type="hidden" name="id" value={user.id} /></AdminMutationForm></main>
}