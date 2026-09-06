import Link from 'next/link'
import { AdminMutationForm, AdminPreviewButton } from '@/components'
import { AdminPageHeader, AdminTabs, FeatureFlagForm } from '@/components/admin'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { serviceContact, serviceFeature } from '@/services'

export default async function ContactFormAdministrationPage() {
    const [configuration, features] = await Promise.all([
        serviceContact.getConfiguration(),
        serviceFeature.getFlags(),
    ])

    return (
        <>
            <AdminPageHeader
                description="Configurez les champs du formulaire public et l’activation de la page contact."
                title="Formulaire de contact"
            />
            <AdminTabs
                configuration={<FeatureFlagForm enabled={features.contact} feature="contact" />}
                content={
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between gap-4">
                            <CardTitle>Champs du formulaire</CardTitle>
                            <Button
                                nativeButton={false}
                                render={<Link href="/administration/formulaire-contact/nouveau" />}
                            >
                                Ajouter un champ
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <AdminPreviewButton
                                preview={{ kind: 'contactFormConfiguration', configuration }}
                            />
                            <ol className="space-y-3">
                                {configuration.fields.map((field) => (
                                    <li
                                        className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-3"
                                        key={field.id}
                                    >
                                        <div>
                                            <p className="font-medium">{field.label}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {field.type}, {field.required ? 'obligatoire' : 'facultatif'}
                                            </p>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            <Button
                                                nativeButton={false}
                                                render={
                                                    <Link
                                                        href={`/administration/formulaire-contact/${field.id}`}
                                                    />
                                                }
                                                size="sm"
                                                variant="outline"
                                            >
                                                Modifier
                                            </Button>
                                            <AdminMutationForm area="contactForm" operation="champ supprimé">
                                                <input name="id" type="hidden" value={field.id} />
                                            </AdminMutationForm>
                                            <AdminMutationForm area="contactForm" operation="ordre modifié">
                                                <input name="id" type="hidden" value={field.id} />
                                                <Button name="move" size="sm" type="submit" value="up" variant="ghost">
                                                    Monter
                                                </Button>
                                                <Button name="move" size="sm" type="submit" value="down" variant="ghost">
                                                    Descendre
                                                </Button>
                                            </AdminMutationForm>
                                        </div>
                                    </li>
                                ))}
                            </ol>
                        </CardContent>
                    </Card>
                }
            />
        </>
    )
}
