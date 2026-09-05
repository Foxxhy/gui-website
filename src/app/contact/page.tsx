import { ContactForm, PublicNavigation } from '@/components'
import { contactService, featureService } from '@/services'
import { notFound } from 'next/navigation'

export default async function ContactPage() {
    const features = await featureService.getFlags()
    if (!features.contact) notFound()
    const configuration = await contactService.getConfiguration()
    return <><PublicNavigation features={features} /><main><h1>{configuration.title}</h1>{configuration.description && <p>{configuration.description}</p>}<ContactForm configuration={configuration} /></main></>
}