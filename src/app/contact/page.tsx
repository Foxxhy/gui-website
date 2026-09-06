import { ContactForm, PublicNavigation } from '@/components'
import { AnalyticsTracker } from '@/analytics'
import { serviceContact, serviceFeature } from '@/services'
import { notFound } from 'next/navigation'

export default async function ContactPage() {
    const features = await serviceFeature.getFlags()
    if (!features.contact) notFound()
    const configuration = await serviceContact.getConfiguration()
    return <><AnalyticsTracker path="/contact" /><PublicNavigation features={features} /><main><h1>{configuration.title}</h1>{configuration.description && <p>{configuration.description}</p>}<ContactForm configuration={configuration} /></main></>
}