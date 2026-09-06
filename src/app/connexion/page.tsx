import { LoginForm } from '@/components'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default async function LoginPage({ searchParams }: PageProps<'/connexion'>) {
    const { returnTo } = await searchParams
    const target = typeof returnTo === 'string' ? returnTo : '/administration'

    return (
        <main className="flex min-h-svh items-center justify-center px-4 py-8">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Connexion</CardTitle>
                    <CardDescription>
                        Accès réservé aux membres de l’association. Comptes de démonstration :
                        admin / admin et editor / editor.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <LoginForm returnTo={target} />
                </CardContent>
            </Card>
        </main>
    )
}
