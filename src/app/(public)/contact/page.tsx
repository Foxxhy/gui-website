import { ContactForm } from '@/components'
import { AnalyticsTracker } from '@/analytics'
import { serviceContact, serviceFeature } from '@/services'
import { notFound } from 'next/navigation'

export default async function ContactPage() {
    const features = await serviceFeature.getFlags()
    if (!features.contact) notFound()
    const configuration = await serviceContact.getConfiguration()

    return (
        <>
            <AnalyticsTracker path="/contact" />
            <div className="space-y-6">
                <div className="space-y-2">
                    <h1 className="font-heading text-3xl font-semibold">Témoigner</h1>
                    <p className="text-muted-foreground">
                        Partagez votre expérience ou votre message avec l’association.
                    </p>
                </div>
                <div className="space-y-2">
                    <h2 className="font-heading text-xl font-semibold">{configuration.title}</h2>
                    {configuration.description && (
                        <p className="text-muted-foreground">{configuration.description}</p>
                    )}
                </div>
                <ContactForm configuration={configuration} />
            </div>
        </>
    )
}
