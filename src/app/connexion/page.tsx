import { LoginForm, PublicNavigation } from '@/components'

export default async function LoginPage({ searchParams }: PageProps<'/connexion'>) {
    const { returnTo } = await searchParams
    const target = typeof returnTo === 'string' ? returnTo : '/administration'
    return <><PublicNavigation /><main><h1>Connexion à l’administration</h1><p>Comptes de démonstration : admin / admin et editor / editor.</p><LoginForm returnTo={target} /></main></>
}