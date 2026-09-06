'use client'

import { useActionState, useState } from 'react'
import { CircleAlertIcon, CircleCheckIcon } from 'lucide-react'
import { actionSubmitAdminMutation } from '@/actions'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import type { IActionResult, IFeatureKey } from '@/types'

const initialState: IActionResult = { success: false, message: '' }

const featureLabels: Record<IFeatureKey, string> = {
    home: 'Page d’accueil',
    articles: 'Module Articles',
    contact: 'Page contact',
}

const featureAlerts: Record<
    IFeatureKey,
    { activeTitle: string; activeDescription: string; inactiveTitle: string; inactiveDescription: string }
> = {
    articles: {
        activeTitle: 'Fonctionnalité active',
        activeDescription: 'Les articles sont actuellement accessibles sur le site public.',
        inactiveTitle: 'Fonctionnalité inactive',
        inactiveDescription:
            'Les articles ne sont actuellement pas accessibles sur le site public. Les contenus existants sont conservés.',
    },
    home: {
        activeTitle: 'Fonctionnalité active',
        activeDescription: 'La page d’accueil est actuellement accessible sur le site public.',
        inactiveTitle: 'Fonctionnalité inactive',
        inactiveDescription:
            'La page d’accueil n’est actuellement pas accessible sur le site public. Le contenu existant est conservé.',
    },
    contact: {
        activeTitle: 'Fonctionnalité active',
        activeDescription: 'La page de contact est actuellement accessible sur le site public.',
        inactiveTitle: 'Fonctionnalité inactive',
        inactiveDescription:
            'La page de contact n’est actuellement pas accessible sur le site public. La configuration existante est conservée.',
    },
}

export const FeatureFlagForm = ({
    feature,
    enabled,
    label,
}: {
    feature: IFeatureKey
    enabled: boolean
    label?: string
}) => {
    const [state, action, pending] = useActionState(actionSubmitAdminMutation, initialState)
    const [checked, setChecked] = useState(enabled)
    const alertCopy = featureAlerts[feature]
    const switchId = `${feature}-enabled`

    return (
        <Card>
            <CardHeader>
                <CardTitle>Configuration</CardTitle>
                <CardDescription>
                    Active ou désactive la fonctionnalité côté public.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Alert>
                    {enabled ? <CircleCheckIcon /> : <CircleAlertIcon />}
                    <AlertTitle>
                        {enabled ? alertCopy.activeTitle : alertCopy.inactiveTitle}
                    </AlertTitle>
                    <AlertDescription>
                        {enabled ? alertCopy.activeDescription : alertCopy.inactiveDescription}
                    </AlertDescription>
                </Alert>

                <form action={action} className="space-y-4">
                    <input name="area" type="hidden" value="features" />
                    <input name="operation" type="hidden" value="mis à jour" />
                    <input name="feature" type="hidden" value={feature} />
                    <input name="enabled" type="hidden" value={checked ? 'true' : 'false'} />
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <Switch
                                checked={checked}
                                id={switchId}
                                onCheckedChange={setChecked}
                            />
                            <Label htmlFor={switchId}>{label ?? featureLabels[feature]}</Label>
                        </div>
                        <Button disabled={pending} type="submit">
                            {pending ? 'Traitement…' : 'Mettre à jour'}
                        </Button>
                    </div>
                    {state.message && (
                        <p
                            aria-live="polite"
                            className="text-sm"
                            role={state.success ? 'status' : 'alert'}
                        >
                            {state.message}
                        </p>
                    )}
                </form>
            </CardContent>
        </Card>
    )
}
