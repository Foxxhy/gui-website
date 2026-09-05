import { AdminMutationForm } from '@/components'
import { contactService } from '@/services'

export default async function NewContactFieldPage() {
    const configuration = await contactService.getConfiguration()
    return <main><h1>Ajouter un champ</h1><AdminMutationForm area="contactForm" operation="champ ajouté" preview={{ kind: 'contactForm', configuration }}><ContactFieldInputs /></AdminMutationForm></main>
}

const ContactFieldInputs = () => <><p><label htmlFor="technicalName">Identifiant technique</label><br /><input id="technicalName" name="technicalName" required /></p><p><label htmlFor="label">Libellé</label><br /><input id="label" name="label" required /></p><p><label htmlFor="type">Type</label><br /><select id="type" name="type"><option value="text">Texte</option><option value="email">E-mail</option><option value="textarea">Zone de texte</option><option value="select">Liste</option></select></p><p><label htmlFor="placeholder">Texte d’aide / placeholder</label><br /><input id="placeholder" name="placeholder" /></p><p><label htmlFor="options">Options de liste (une par ligne)</label><br /><textarea id="options" name="options" /></p><p><label htmlFor="required">Obligatoire</label> <input id="required" name="required" type="checkbox" value="true" /></p></>