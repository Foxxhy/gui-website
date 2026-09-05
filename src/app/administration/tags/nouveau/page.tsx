import { AdminMutationForm } from '@/components'

export default function NewTagPage() {
    return <main><h1>Créer un tag</h1><AdminMutationForm area="tags" operation="créé"><p><label htmlFor="name">Nom</label><br /><input id="name" name="name" required /></p><p><label htmlFor="slug">Slug</label><br /><input id="slug" name="slug" required /></p><p><label htmlFor="style">Style</label><br /><input id="style" name="style" required /></p><p><label htmlFor="description">Description</label><br /><textarea id="description" name="description" /></p></AdminMutationForm></main>
}
