import Link from 'next/link'
import { AdminMutationForm, AdminPreviewButton } from '@/components'
import { contactService, featureService } from '@/services'

export default async function ContactFormAdministrationPage() {
    const [configuration, features] = await Promise.all([
        contactService.getConfiguration(),
        featureService.getFlags(),
    ])
    return <main><h1>Configuration du formulaire de contact</h1><section><h2>Statut</h2><AdminMutationForm area="features" operation="Mettre à jour le statut"><input type="hidden" name="feature" value="contact" /><p><input id="contact-enabled" type="checkbox" name="enabled" value="true" defaultChecked={features.contact} /><input type="hidden" name="enabled" value="false" /><label htmlFor="contact-enabled">Page activée</label></p></AdminMutationForm></section><AdminPreviewButton preview={{ kind: 'contactFormConfiguration', configuration }} /><p><Link href="/administration/formulaire-contact/nouveau">Ajouter un champ</Link></p><ol>{configuration.fields.map((field) => <li key={field.id}>{field.label} ({field.type}, {field.required ? 'obligatoire' : 'facultatif'}) — <Link href={`/administration/formulaire-contact/${field.id}`}>modifier</Link><AdminMutationForm area="contactForm" operation="champ supprimé"><input type="hidden" name="id" value={field.id} /></AdminMutationForm><AdminMutationForm area="contactForm" operation="ordre modifié"><input type="hidden" name="id" value={field.id} /><button type="submit" name="move" value="up">Monter</button><button type="submit" name="move" value="down">Descendre</button></AdminMutationForm></li>)}</ol></main>
}