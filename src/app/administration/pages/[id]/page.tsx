import { AdminMutationForm, PageSectionFields } from '@/components'
import { serviceContent, serviceFeature } from '@/services'
import { notFound } from 'next/navigation'

export default async function EditPagePage({ params }: PageProps<'/administration/pages/[id]'>) {
    const { id } = await params
    const page = (await serviceContent.getPages()).find((candidate) => candidate.id === id)
    if (!page) notFound()
    const features = page.slug === 'accueil' ? await serviceFeature.getFlags() : undefined
    return (
        <main>
            <h1>Modifier : {page.title}</h1>
            {features && (
                <section>
                    <h2>Statut</h2>
                    <AdminMutationForm area="features" operation="Mettre à jour le statut">
                        <input type="hidden" name="feature" value="home" />
                        <p>
                            <input id="home-enabled" type="checkbox" name="enabled" value="true" defaultChecked={features.home} />
                            <input type="hidden" name="enabled" value="false" />
                            <label htmlFor="home-enabled">Page activée</label>
                        </p>
                    </AdminMutationForm>
                </section>
            )}
            <AdminMutationForm area="pages" operation="modifiée" preview={{ kind: 'page', page }}>
                <input type="hidden" name="id" value={page.id} />
                <p>
                    <label htmlFor="title">Titre</label>
                    <br />
                    <input id="title" name="title" defaultValue={page.title} required />
                </p>
                <p>
                    <label htmlFor="content">Contenu</label>
                    <br />
                    <textarea id="content" name="content" defaultValue={page.content} required />
                </p>
                <PageSectionFields sections={page.sections} />
            </AdminMutationForm>
        </main>
    )
}
