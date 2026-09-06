import { AdminPageHeader } from '@/components/admin'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function AdministrationPage() {
    return (
        <>
            <AdminPageHeader
                description="Les opérations de ce POC sont validées mais ne persistent pas : les données mockées sont restaurées à chaque lecture."
                title="Administration"
            />
            <Card>
                <CardHeader>
                    <CardTitle>Bienvenue dans le back office</CardTitle>
                    <CardDescription>
                        Utilisez la barre latérale pour accéder aux espaces de gestion du contenu,
                        des utilisateurs, du formulaire de contact et des analytics.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">
                        Les contenus complexes disposent de pages dédiées. Les informations simples,
                        comme les utilisateurs, peuvent être gérées depuis un panel latéral.
                    </p>
                </CardContent>
            </Card>
        </>
    )
}
