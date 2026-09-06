import { AdminMutationForm } from '@/components'
import { serviceContact } from '@/services'
import { notFound } from 'next/navigation'

export default async function EditContactFieldPage({ params }: PageProps<'/administration/formulaire-contact/[id]'>) {
    const { id } = await params
    const configuration = await serviceContact.getConfiguration()
    const field = configuration.fields.find((candidate) => candidate.id === id)
    if (!field) notFound()
    return <main><h1>Modifier le champ : {field.label}</h1><AdminMutationForm area="contactForm" operation="champ modifié" preview={{ kind: 'contactForm', configuration, fieldId: field.id }}><input type="hidden" name="id" value={field.id} /><p><label htmlFor="technicalName">Identifiant technique</label><br /><input id="technicalName" name="technicalName" defaultValue={field.technicalName} required /></p><p><label htmlFor="label">Libellé</label><br /><input id="label" name="label" defaultValue={field.label} required /></p><p><label htmlFor="type">Type</label><br /><select id="type" name="type" defaultValue={field.type}><option value="text">Texte</option><option value="email">E-mail</option><option value="textarea">Zone de texte</option><option value="select">Liste</option></select></p><p><label htmlFor="placeholder">Texte d’aide / placeholder</label><br /><input id="placeholder" name="placeholder" defaultValue={field.placeholder} /></p><p><label htmlFor="options">Options de liste (une par ligne)</label><br /><textarea id="options" name="options" defaultValue={field.options?.join('\n')} /></p><p><label htmlFor="required">Obligatoire</label> <input id="required" name="required" type="checkbox" value="true" defaultChecked={field.required} /></p></AdminMutationForm></main>
}