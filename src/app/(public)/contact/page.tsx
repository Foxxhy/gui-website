import { ContactForm, PublicBreadcrumb } from '@/components'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion'
import { AnalyticsTracker } from '@/analytics'
import { serviceContact, serviceFeature } from '@/services'
import { notFound } from 'next/navigation'

const testimonyAccordions = [
    {
        value: 'what',
        title: 'Qu’est-ce qu’un témoignage ?',
    },
    {
        value: 'moderation',
        title: 'Modération et publication',
    },
    {
        value: 'privacy',
        title: 'Confidentialité de vos données',
    },
] as const

export default async function ContactPage() {
    const features = await serviceFeature.getFlags()
    if (!features.contact) notFound()
    const configuration = await serviceContact.getConfiguration()

    return (
        <>
            <AnalyticsTracker path="/contact" />
            <div className="space-y-6">
                <PublicBreadcrumb
                    items={[
                        { label: 'Accueil', href: '/' },
                        { label: 'Témoigner' },
                    ]}
                />
                <div className="space-y-2">
                    <h1 className="font-heading text-3xl font-semibold">{configuration.title}</h1>
                    {configuration.description && (
                        <p className="text-muted-foreground">{configuration.description}</p>
                    )}
                </div>
                <Accordion>
                    {testimonyAccordions.map((item) => (
                        <AccordionItem key={item.value} value={item.value}>
                            <AccordionTrigger>{item.title}</AccordionTrigger>
                            <AccordionContent>
                                <p className="text-muted-foreground">Texte à venir.</p>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
                <ContactForm configuration={configuration} />
            </div>
        </>
    )
}
