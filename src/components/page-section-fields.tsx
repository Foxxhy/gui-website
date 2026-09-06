import type { ReactNode } from 'react'
import type { IPageSection } from '@/types'

const fieldId = (sectionId: string, field: string) => `section-${sectionId}-${field}`

const SectionGroup = ({
    title,
    children,
}: {
    title: string
    children: ReactNode
}) => (
    <fieldset>
        <legend>{title}</legend>
        {children}
    </fieldset>
)

const HeroOrTextFields = ({ section }: { section: Extract<IPageSection, { type: 'hero' | 'text' }> }) => {
    const titleId = fieldId(section.id, 'title')
    const contentId = fieldId(section.id, 'content')
    return (
        <>
            <p>
                <label htmlFor={titleId}>Titre</label>
                <br />
                <input
                    id={titleId}
                    name={titleId}
                    defaultValue={section.title ?? ''}
                    required={section.type === 'hero'}
                />
            </p>
            <p>
                <label htmlFor={contentId}>Contenu</label>
                <br />
                <textarea
                    id={contentId}
                    name={contentId}
                    defaultValue={section.content ?? ''}
                    required={section.type === 'text'}
                />
            </p>
        </>
    )
}

const CallToActionFields = ({ section }: { section: Extract<IPageSection, { type: 'call-to-action' }> }) => {
    const titleId = fieldId(section.id, 'title')
    const contentId = fieldId(section.id, 'content')
    const labelId = fieldId(section.id, 'label')
    const hrefId = fieldId(section.id, 'href')
    return (
        <>
            <p>
                <label htmlFor={titleId}>Titre</label>
                <br />
                <input id={titleId} name={titleId} defaultValue={section.title} required />
            </p>
            <p>
                <label htmlFor={contentId}>Contenu</label>
                <br />
                <textarea id={contentId} name={contentId} defaultValue={section.content ?? ''} />
            </p>
            <p>
                <label htmlFor={labelId}>Libellé du lien</label>
                <br />
                <input id={labelId} name={labelId} defaultValue={section.label} required />
            </p>
            <p>
                <label htmlFor={hrefId}>Lien</label>
                <br />
                <input id={hrefId} name={hrefId} defaultValue={section.href} required />
            </p>
        </>
    )
}

const FeaturedArticlesFields = ({
    section,
}: {
    section: Extract<IPageSection, { type: 'featured-articles' }>
}) => {
    const titleId = fieldId(section.id, 'title')
    return (
        <p>
            <label htmlFor={titleId}>Titre</label>
            <br />
            <input id={titleId} name={titleId} defaultValue={section.title} required />
            <br />
            <small>Articles mis en avant : {section.articleSlugs.join(', ') || 'aucun'}</small>
        </p>
    )
}

const SectionFields = ({ section }: { section: IPageSection }) => {
    if (section.type === 'hero' || section.type === 'text') {
        return <HeroOrTextFields section={section} />
    }
    if (section.type === 'call-to-action') {
        return <CallToActionFields section={section} />
    }
    if (section.type === 'featured-articles') {
        return <FeaturedArticlesFields section={section} />
    }
    return null
}

const sectionLabel = (section: IPageSection) => {
    if (section.type === 'hero') return section.title || 'Introduction'
    if (section.type === 'text') return section.title || 'Section texte'
    if (section.type === 'call-to-action') return section.title || 'Appel à l’action'
    if (section.type === 'featured-articles') return section.title || 'Articles à la une'
    return 'Section'
}

/** Groupes éditoriaux pour la page Gestion des données (structure US). */
const DATA_PAGE_GROUPS: { title: string; sectionIds: string[] }[] = [
    { title: 'Introduction', sectionIds: ['data-hero'] },
    {
        title: 'Données collectées',
        sectionIds: ['data-collected', 'data-analytics', 'data-contact'],
    },
    { title: 'Utilisation des données', sectionIds: ['data-usage'] },
    { title: 'Données non collectées', sectionIds: ['data-not-collected'] },
    { title: 'Conservation des données', sectionIds: ['data-retention'] },
    { title: 'Contact', sectionIds: ['data-contact-cta'] },
]

export const PageSectionFields = ({ sections }: { sections: IPageSection[] }) => {
    const sorted = [...sections].sort((first, second) => first.order - second.order)
    const byId = new Map(sorted.map((section) => [section.id, section]))
    const isDataPage = byId.has('data-hero')

    if (isDataPage) {
        return (
            <section>
                <h2>Sections</h2>
                {DATA_PAGE_GROUPS.map((group) => {
                    const groupSections = group.sectionIds
                        .map((id) => byId.get(id))
                        .filter((section): section is IPageSection => Boolean(section))
                    if (groupSections.length === 0) return null
                    return (
                        <SectionGroup key={group.title} title={group.title}>
                            {groupSections.map((section) => (
                                <SectionGroup key={section.id} title={sectionLabel(section)}>
                                    <SectionFields section={section} />
                                </SectionGroup>
                            ))}
                        </SectionGroup>
                    )
                })}
            </section>
        )
    }

    return (
        <section>
            <h2>Sections</h2>
            {sorted.map((section) => (
                <SectionGroup key={section.id} title={`${section.order} — ${section.type} : ${sectionLabel(section)}`}>
                    <SectionFields section={section} />
                </SectionGroup>
            ))}
        </section>
    )
}
