import { AnalyticsTracker } from '@/analytics'

export default function DataManagementPage() {
    return (
        <>
            <AnalyticsTracker path="/gestion-des-donnees" />
            <div className="space-y-4">
                <h1 className="font-heading text-3xl font-semibold">Gestion des données</h1>
                <p>
                    Cette page présentera les informations relatives à la gestion de vos données
                    personnelles. Le contenu définitif sera ajouté lors d’une étape ultérieure.
                </p>
            </div>
        </>
    )
}
