import Link from 'next/link'
import { AdminMutationForm } from '@/components'
import { contactService } from '@/services'

export default async function ContactFormAdministrationPage() {
    const configuration = await contactService.getConfiguration()
    return <main><h1>Configuration du formulaire de contact</h1><p><Link href="/administration/formulaire-contact/nouveau">Ajouter un champ</Link></p><ol>{configuration.fields.map((field) => <li key={field.id}>{field.label} ({field.type}, {field.required ? 'obligatoire' : 'facultatif'}) — <Link href={`/administration/formulaire-contact/${field.id}`}>modifier</Link><AdminMutationForm area="contactForm" operation="champ supprimé"><input type="hidden" name="id" value={field.id} /></AdminMutationForm><AdminMutationForm area="contactForm" operation="ordre modifié"><input type="hidden" name="id" value={field.id} /><button type="submit" name="move" value="up">Monter</button><button type="submit" name="move" value="down">Descendre</button></AdminMutationForm></li>)}</ol></main>
}