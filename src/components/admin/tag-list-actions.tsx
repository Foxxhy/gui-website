'use client'

import { useActionState, useState } from 'react'
import { PencilIcon, Trash2Icon } from 'lucide-react'
import { actionSubmitAdminMutation } from '@/actions'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import type { IActionResult } from '@/types'

const initialState: IActionResult = { success: false, message: '' }

export const TagListActions = ({
    tagId,
    tagName,
    onEdit,
}: {
    tagId: string
    tagName: string
    onEdit: (tagId: string) => void
}) => {
    const [open, setOpen] = useState(false)
    const [state, action, pending] = useActionState(actionSubmitAdminMutation, initialState)

    return (
        <div className="flex justify-end gap-2">
            <Button
                aria-label={`Modifier « ${tagName} »`}
                onClick={() => onEdit(tagId)}
                size="icon-sm"
                type="button"
                variant="outline"
            >
                <PencilIcon />
            </Button>
            <Button
                aria-label={`Supprimer « ${tagName} »`}
                onClick={() => setOpen(true)}
                size="icon-sm"
                type="button"
                variant="outline"
            >
                <Trash2Icon />
            </Button>

            <Dialog onOpenChange={setOpen} open={open}>
                <DialogContent>
                    <form action={action}>
                        <input name="area" type="hidden" value="tags" />
                        <input name="operation" type="hidden" value="supprimé" />
                        <input name="id" type="hidden" value={tagId} />
                        <DialogHeader>
                            <DialogTitle>Supprimer ce tag ?</DialogTitle>
                            <DialogDescription>
                                Le tag « {tagName} » va être supprimé. Cette action nécessite votre
                                confirmation.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="mt-4">
                            <Button
                                onClick={() => setOpen(false)}
                                type="button"
                                variant="outline"
                            >
                                Annuler
                            </Button>
                            <Button disabled={pending} type="submit" variant="destructive">
                                {pending ? 'Suppression…' : 'Supprimer'}
                            </Button>
                        </DialogFooter>
                        {state.message && !state.success ? (
                            <p
                                aria-live="polite"
                                className="mt-2 text-sm text-destructive"
                                role="alert"
                            >
                                {state.message}
                            </p>
                        ) : null}
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}
