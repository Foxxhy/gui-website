import { AdminMutationForm } from '@/components'
import { AdminPageHeader, ContactFieldInputs } from '@/components/admin'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { serviceContact } from '@/services'
import { notFound } from 'next/navigation'

export default async function EditContactFieldPage({
    params,
}: PageProps<'/administration/formulaire-contact/[id]'>) {
    const { id } = await params
    const [configuration, field] = await Promise.all([
        serviceContact.getConfiguration(),
        serviceContact.getFieldById(id),
    ])
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
