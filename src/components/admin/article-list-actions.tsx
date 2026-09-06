'use client'

import { useActionState, useState } from 'react'
import Link from 'next/link'
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

export const ArticleListActions = ({
    articleId,
    articleTitle,
}: {
    articleId: string
    articleTitle: string
}) => {
    const [open, setOpen] = useState(false)
    const [state, action, pending] = useActionState(actionSubmitAdminMutation, initialState)

    return (
        <div className="flex justify-end gap-2">
            <Button
                aria-label={`Modifier « ${articleTitle} »`}
                nativeButton={false}
                render={<Link href={`/administration/articles/${articleId}`} />}
                size="icon-sm"
                variant="outline"
            >
                <PencilIcon />
            </Button>
            <Button
                aria-label={`Supprimer « ${articleTitle} »`}
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
                        <input name="area" type="hidden" value="articles" />
                        <input name="operation" type="hidden" value="supprimé" />
                        <input name="id" type="hidden" value={articleId} />
                        <DialogHeader>
                            <DialogTitle>Supprimer cet article ?</DialogTitle>
                            <DialogDescription>
                                L’article « {articleTitle} » va être supprimé. Cette action
                                nécessite votre confirmation.
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
                            <p aria-live="polite" className="mt-2 text-sm text-destructive" role="alert">
                                {state.message}
                            </p>
                        ) : null}
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}
