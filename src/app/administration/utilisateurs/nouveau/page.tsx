import { redirect } from 'next/navigation'

export default function NewUserRedirectPage() {
    redirect('/administration/utilisateurs?create=1')
}
