'use client'

import { useActionState, useRef } from 'react'
import { actionSubmitAdminMutation } from '@/actions'
import {
    Combobox,
    ComboboxButtonTrigger,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxItem,
    ComboboxList,
    ComboboxValue,
} from '@/components/ui/combobox'
import { IStatus, type IActionResult, type IArticle } from '@/types'

const initialState: IActionResult = { success: false, message: '' }

type StatusItem = {
    value: IStatus.DRAFT | IStatus.PUBLISHED
    label: string
}

const statusItems: StatusItem[] = [
    { value: IStatus.DRAFT, label: 'Brouillon' },
    { value: IStatus.PUBLISHED, label: 'Publié' },
]

const statusLabels: Record<IStatus, string> = {
    [IStatus.DRAFT]: 'Brouillon',
    [IStatus.PUBLISHED]: 'Publié',
    [IStatus.CANCELLED]: 'Annulé',
}

export const ArticleStatusCombobox = ({
    article,
}: {
    article: Pick<IArticle, 'id' | 'title' | 'slug' | 'description' | 'content' | 'status' | 'tags'>
}) => {
    const [state, action, pending] = useActionState(actionSubmitAdminMutation, initialState)
    const formRef = useRef<HTMLFormElement>(null)
    const statusInputRef = useRef<HTMLInputElement>(null)

    const selectedItem =
        statusItems.find((item) => item.value === article.status) ?? null

    const submitStatus = (nextStatus: IStatus.DRAFT | IStatus.PUBLISHED) => {
        if (pending || article.status === nextStatus || !formRef.current || !statusInputRef.current) {
            return
        }
        statusInputRef.current.value = nextStatus
        formRef.current.requestSubmit()
    }

    return (
        <div className="space-y-1">
            <form action={action} className="contents" ref={formRef}>
                <input name="area" type="hidden" value="articles" />
                <input name="operation" type="hidden" value="modifiée" />
                <input name="id" type="hidden" value={article.id} />
                <input name="title" type="hidden" value={article.title} />
                <input name="slug" type="hidden" value={article.slug} />
                <input name="content" type="hidden" value={article.content} />
                <input name="description" type="hidden" value={article.description ?? ''} />
                <input name="status" ref={statusInputRef} type="hidden" value={article.status} />
                {article.tags?.map((tag) => (
                    <input key={tag.id} name="tags" type="hidden" value={tag.id} />
                ))}
            </form>

            <Combobox
                disabled={pending}
                isItemEqualToValue={(a, b) => a.value === b.value}
                itemToStringLabel={(item) => item.label}
                items={statusItems}
                onValueChange={(item) => {
                    if (item) submitStatus(item.value)
                }}
                value={selectedItem}
            >
                <ComboboxButtonTrigger aria-label="Modifier le statut" disabled={pending}>
                    <ComboboxValue placeholder={statusLabels[article.status]} />
                </ComboboxButtonTrigger>
                <ComboboxContent>
                    <ComboboxEmpty>Aucun statut.</ComboboxEmpty>
                    <ComboboxList>
                        {(item: StatusItem) => (
                            <ComboboxItem key={item.value} value={item}>
                                {item.label}
                            </ComboboxItem>
                        )}
                    </ComboboxList>
                </ComboboxContent>
            </Combobox>

            {state.message && !state.success ? (
                <p aria-live="polite" className="text-xs text-destructive" role="alert">
                    {state.message}
                </p>
            ) : null}
        </div>
    )
}
