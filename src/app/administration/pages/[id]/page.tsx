import { AdminMutationForm, PageSectionFields } from '@/components'
import { AdminPageHeader, AdminTabs, FeatureFlagForm } from '@/components/admin'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { serviceContent, serviceFeature } from '@/services'
import { notFound } from 'next/navigation'

export default async function EditPagePage({ params }: PageProps<'/administration/pages/[id]'>) {
    const { id } = await params
    const page = (await serviceContent.getPages()).find((candidate) => candidate.id === id)
    if (!page) notFound()

    const features = page.slug === 'accueil' ? await serviceFeature.getFlags() : undefined
    const isHomePage = page.slug === 'accueil'

    const contentForm = (
        <Card>
            <CardHeader>
                <CardTitle>Contenu de la page</CardTitle>
            </CardHeader>
            <CardContent>
                <AdminMutationForm area="pages" operation="modifiée" preview={{ kind: 'page', page }}>
                    <input name="id" type="hidden" value={page.id} />
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Titre</Label>
                            <Input defaultValue={page.title} id="title" name="title" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="content">Contenu</Label>
                            <textarea
                                className="flex min-h-24 w-full rounded-lg border border-input bg-background px-2.5 py-2 text-sm"
                                defaultValue={page.content}
                                id="content"
                                name="content"
                                required
                            />
                        </div>
                        <PageSectionFields sections={page.sections} />
                    </div>
                </AdminMutationForm>
            </CardContent>
        </Card>
    )

    if (isHomePage && features) {
        return (
            <>
                <AdminPageHeader
                    description="Modifiez la page d’accueil et son activation publique."
                    title={`Modifier : ${page.title}`}
                />
                <AdminTabs
                    configuration={<FeatureFlagForm enabled={features.home} feature="home" />}
                    content={contentForm}
                />
            </>
        )
    }

    return (
        <>
            <AdminPageHeader title={`Modifier : ${page.title}`} />
            {contentForm}
        </>
    )
}
