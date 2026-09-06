import { AdminMutationForm } from '@/components'
import { AdminPageHeader, ContactFieldInputs } from '@/components/admin'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { serviceContact } from '@/services'

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
