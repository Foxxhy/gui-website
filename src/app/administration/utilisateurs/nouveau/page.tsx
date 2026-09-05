import { AdminMutationForm } from '@/components'

export default function NewUserPage() {
    return <main><h1>Créer un utilisateur</h1><AdminMutationForm area="users" operation="créé"><p><label htmlFor="name">Nom</label><br /><input id="name" name="name" required /></p><p><label htmlFor="email">E-mail</label><br /><input id="email" name="email" type="email" required /></p><p><label htmlFor="pseudonym">Pseudonyme</label><br /><input id="pseudonym" name="pseudonym" required /></p><p><label htmlFor="role">Rôle</label><br /><select id="role" name="role"><option value="editor">Éditeur</option><option value="admin">Administrateur</option><option value="blocked">Bloqué</option></select></p></AdminMutationForm></main>
}