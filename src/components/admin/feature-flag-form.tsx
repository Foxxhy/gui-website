'use client'

import { AdminMutationForm } from '@/components/forms'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import type { IFeatureKey } from '@/types'

const featureLabels: Record<IFeatureKey, string> = {
    home: 'Page activée',
    articles: 'Module Articles activé',
    contact: 'Page activée',
}

export const FeatureFlagForm = ({
    feature,
    enabled,
    label,
}: {
    feature: IFeatureKey
    enabled: boolean
    label?: string
}) => (
    <Card>
        <CardHeader>
            <CardTitle>Statut du module</CardTitle>
            <CardDescription>
                Active ou désactive la fonctionnalité côté public.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <AdminMutationForm area="features" operation="Mettre à jour le statut">
                <input type="hidden" name="feature" value={feature} />
                <div className="flex items-center gap-2">
                    <Checkbox defaultChecked={enabled} id={`${feature}-enabled`} name="enabled" value="true" />
                    <input name="enabled" type="hidden" value="false" />
                    <Label htmlFor={`${feature}-enabled`}>{label ?? featureLabels[feature]}</Label>
                </div>
            </AdminMutationForm>
        </CardContent>
    </Card>
)
