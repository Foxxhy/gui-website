import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from '@/components/ui/empty'
import { VisualMock } from './visual-mock'

export const ArticlesEmptyState = ({ hasActiveFilters }: { hasActiveFilters: boolean }) => (
    <Empty className="border border-dashed">
        <EmptyHeader>
            <EmptyMedia>
                <VisualMock className="aspect-square w-32" label="Illustration à venir" />
            </EmptyMedia>
            <EmptyTitle>
                {hasActiveFilters ? 'Aucun article trouvé' : 'Aucun article publié'}
            </EmptyTitle>
            <EmptyDescription>
                {hasActiveFilters
                    ? 'Élargissez votre recherche ou retirez certains filtres pour afficher davantage de résultats.'
                    : 'Les actualités de l’association seront bientôt disponibles ici.'}
            </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
            {hasActiveFilters ? (
                <Button nativeButton={false} render={<Link href="/articles" />}>
                    Réinitialiser la recherche
                </Button>
            ) : (
                <Button nativeButton={false} render={<Link href="/" />} variant="outline">
                    Retourner à l’accueil
                </Button>
            )}
        </EmptyContent>
    </Empty>
)
