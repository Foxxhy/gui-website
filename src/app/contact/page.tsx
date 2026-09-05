import { ContactForm, PublicNavigation } from '@/components'
import { contactService } from '@/services'

export default async function ContactPage() {
    const configuration = await contactService.getConfiguration()
    return <><PublicNavigation /><main><h1>{configuration.title}</h1>{configuration.description && <p>{configuration.description}</p>}<ContactForm configuration={configuration} /></main></>
}