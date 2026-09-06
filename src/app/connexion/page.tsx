import { LoginForm } from '@/components'

export default async function LoginPage({ searchParams }: PageProps<'/connexion'>) {
    const { returnTo } = await searchParams
    const target = typeof returnTo === 'string' ? returnTo : '/administration'

    return (
        <main className="mx-auto flex min-h-svh w-full max-w-md flex-col justify-center px-4 py-8">
            <h1 className="font-heading text-3xl font-semibold">Connexion à l’administration</h1>
            <p className="mt-2 text-sm text-muted-foreground">
                Comptes de démonstration : admin / admin et editor / editor.
            </p>
            <div className="mt-6">
                <LoginForm returnTo={target} />
            </div>
        </main>
    )
}
