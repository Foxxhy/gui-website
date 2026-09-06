import { AdminMutationForm, PageSectionFields } from '@/components'
import { AdminPageHeader, AdminTabs, FeatureFlagForm, PageFormFields } from '@/components/admin'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { serviceContent, serviceFeature } from '@/services'
import { notFound } from 'next/navigation'

export default async function EditPagePage({ params }: PageProps<'/administration/pages/[id]'>) {
    const { id } = await params
    const page = await serviceContent.getPageById(id)
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
                    <PageFormFields page={page} />
                    <PageSectionFields sections={page.sections} />
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
