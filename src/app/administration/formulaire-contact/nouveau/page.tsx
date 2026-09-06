import { AdminMutationForm } from '@/components'
import { AdminPageHeader } from '@/components/admin'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { serviceContact } from '@/services'

const ContactFieldInputs = () => (
    <div className="space-y-4">
        <div className="space-y-2">
            <Label htmlFor="technicalName">Identifiant technique</Label>
            <Input id="technicalName" name="technicalName" required />
        </div>
        <div className="space-y-2">
            <Label htmlFor="label">Libellé</Label>
            <Input id="label" name="label" required />
        </div>
        <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <select className="flex h-8 w-full rounded-lg border border-input bg-background px-2.5 text-sm" id="type" name="type">
                <option value="text">Texte</option>
                <option value="email">E-mail</option>
                <option value="textarea">Zone de texte</option>
                <option value="select">Liste</option>
            </select>
        </div>
        <div className="space-y-2">
            <Label htmlFor="placeholder">Texte d’aide / placeholder</Label>
            <Input id="placeholder" name="placeholder" />
        </div>
        <div className="space-y-2">
            <Label htmlFor="options">Options de liste (une par ligne)</Label>
            <textarea
                className="flex min-h-24 w-full rounded-lg border border-input bg-background px-2.5 py-2 text-sm"
                id="options"
                name="options"
            />
        </div>
        <div className="flex items-center gap-2">
            <Checkbox id="required" name="required" value="true" />
            <Label htmlFor="required">Obligatoire</Label>
        </div>
    </div>
)

export default async function NewContactFieldPage() {
    const configuration = await serviceContact.getConfiguration()

    return (
        <>
            <AdminPageHeader title="Ajouter un champ" />
            <Card>
                <CardHeader>
                    <CardTitle>Nouveau champ</CardTitle>
                </CardHeader>
                <CardContent>
                    <AdminMutationForm
                        area="contactForm"
                        operation="champ ajouté"
                        preview={{ kind: 'contactForm', configuration }}
                    >
                        <ContactFieldInputs />
                    </AdminMutationForm>
                </CardContent>
            </Card>
        </>
    )
}
