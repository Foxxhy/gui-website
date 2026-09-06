import { redirect } from 'next/navigation'

export default function AccountPage() {
    redirect('/administration?account=1&tab=password')
}
