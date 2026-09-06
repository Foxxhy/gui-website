import { redirect } from 'next/navigation'

export default function NewTagPage() {
    redirect('/administration/tags?create=1')
}
