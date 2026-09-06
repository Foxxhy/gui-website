import { AdminMutationForm } from '@/components'
import { AdminPageHeader } from '@/components/admin'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { serviceContact } from '@/services'
import { notFound } from 'next/navigation'

const ContactFieldInputs = ({
    field,
}: {
    field?: {
        id: string
        technicalName: string
        label: string
        type: string
        placeholder?: string
        options?: string[]
        required: boolean
    }
}) => (
    <div className="space-y-4">
        {field && <input name="id" type="hidden" value={field.id} />}
        <div className="space-y-2">
            <Label htmlFor="technicalName">Identifiant technique</Label>
            <Input defaultValue={field?.technicalName} id="technicalName" name="technicalName" required />
        </div>
        <div className="space-y-2">
            <Label htmlFor="label">Libellé</Label>
            <Input defaultValue={field?.label} id="label" name="label" required />
        </div>
        <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <select
                className="flex h-8 w-full rounded-lg border border-input bg-background px-2.5 text-sm"
                defaultValue={field?.type ?? 'text'}
                id="type"
                name="type"
            >
                <option value="text">Texte</option>
                <option value="email">E-mail</option>
                <option value="textarea">Zone de texte</option>
                <option value="select">Liste</option>
            </select>
        </div>
        <div className="space-y-2">
            <Label htmlFor="placeholder">Texte d’aide / placeholder</Label>
            <Input defaultValue={field?.placeholder} id="placeholder" name="placeholder" />
        </div>
        <div className="space-y-2">
            <Label htmlFor="options">Options de liste (une par ligne)</Label>
            <textarea
                className="flex min-h-24 w-full rounded-lg border border-input bg-background px-2.5 py-2 text-sm"
                defaultValue={field?.options?.join('\n')}
                id="options"
                name="options"
            />
        </div>
        <div className="flex items-center gap-2">
            <Checkbox defaultChecked={field?.required} id="required" name="required" value="true" />
            <Label htmlFor="required">Obligatoire</Label>
        </div>
    </div>
)

export default async function EditContactFieldPage({
    params,
}: PageProps<'/administration/formulaire-contact/[id]'>) {
    const { id } = await params
    const configuration = await serviceContact.getConfiguration()
    const field = configuration.fields.find((candidate) => candidate.id === id)
    if (!field) notFound()

    return (
        <>
            <AdminPageHeader title={`Modifier le champ : ${field.label}`} />
            <Card>
                <CardHeader>
                    <CardTitle>Configuration du champ</CardTitle>
                </CardHeader>
                <CardContent>
                    <AdminMutationForm
                        area="contactForm"
                        operation="champ modifié"
                        preview={{ kind: 'contactForm', configuration, fieldId: field.id }}
                    >
                        <ContactFieldInputs field={field} />
                    </AdminMutationForm>
                </CardContent>
            </Card>
        </>
    )
}
