'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { AdminMutationForm } from '@/components/forms'
import { TagFormFields } from '@/components/admin/tag-form-fields'
import { TagListActions } from '@/components/admin/tag-list-actions'
import { TagBadge } from '@/components/public/tag-badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { TAG_STYLES, type ITag, type ITagStyle } from '@/types'

const emptyPreviewTag: ITag = {
    id: 'preview-tag',
    name: 'Nom du tag',
    slug: '',
    style: 'green',
    description: '',
}

const readPreviewFromForm = (form: HTMLFormElement, base?: ITag): ITag => {
    const values = new FormData(form)
    const rawStyle = String(values.get('style') ?? base?.style ?? 'green')
    const style = TAG_STYLES.includes(rawStyle as ITagStyle)
        ? (rawStyle as ITagStyle)
        : (base?.style ?? 'green')

    return {
        id: base?.id ?? 'preview-tag',
        name: String(values.get('name') ?? base?.name ?? '').trim() || 'Nom du tag',
        slug: String(values.get('slug') ?? base?.slug ?? ''),
        style,
        description: String(values.get('description') ?? base?.description ?? ''),
    }
}

export const TagAdminPanel = ({
    tags,
    initialTagId,
    initialCreate,
}: {
    tags: ITag[]
    initialTagId?: string
    initialCreate?: boolean
}) => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [open, setOpen] = useState(Boolean(initialTagId || initialCreate))
    const [mode, setMode] = useState<'create' | 'edit'>(initialCreate ? 'create' : 'edit')
    const [selectedTagId, setSelectedTagId] = useState(initialTagId)
    const selectedTag = tags.find((tag) => tag.id === selectedTagId)
    const [previewTag, setPreviewTag] = useState<ITag>(selectedTag ?? emptyPreviewTag)

    useEffect(() => {
        if (initialCreate) {
            setMode('create')
            setSelectedTagId(undefined)
            setPreviewTag(emptyPreviewTag)
            setOpen(true)
            return
        }

        if (initialTagId) {
            setMode('edit')
            setSelectedTagId(initialTagId)
            setOpen(true)
        }
    }, [initialCreate, initialTagId])

    useEffect(() => {
        if (mode === 'edit' && selectedTag) {
            setPreviewTag(selectedTag)
            return
        }
        if (mode === 'create') {
            setPreviewTag(emptyPreviewTag)
        }
    }, [mode, selectedTag])

    const closePanel = () => {
        setOpen(false)
        setSelectedTagId(undefined)
        if (searchParams.get('tag') || searchParams.get('create')) {
            router.replace('/administration/tags')
        }
    }

    const openCreate = () => {
        setMode('create')
        setSelectedTagId(undefined)
        setPreviewTag(emptyPreviewTag)
        setOpen(true)
    }

    const openEdit = (tagId: string) => {
        const tag = tags.find((candidate) => candidate.id === tagId)
        setMode('edit')
        setSelectedTagId(tagId)
        setPreviewTag(tag ?? emptyPreviewTag)
        setOpen(true)
    }

    const updatePreview = (form: HTMLFormElement) => {
        setPreviewTag(readPreviewFromForm(form, mode === 'edit' ? selectedTag : undefined))
    }

    return (
        <>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between gap-4">
                    <div>
                        <CardTitle>Tags</CardTitle>
                        <CardDescription>
                            Ajoutez ou modifiez les tags depuis un panel latéral.
                        </CardDescription>
                    </div>
                    <Button onClick={openCreate} type="button">
                        Ajouter
                    </Button>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nom</TableHead>
                                <TableHead>Slug</TableHead>
                                <TableHead>Style</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {tags.map((tag) => (
                                <TableRow key={tag.id}>
                                    <TableCell>{tag.name}</TableCell>
                                    <TableCell>{tag.slug}</TableCell>
                                    <TableCell>
                                        <TagBadge tag={tag} />
                                    </TableCell>
                                    <TableCell>{tag.description || '—'}</TableCell>
                                    <TableCell className="text-right">
                                        <TagListActions
                                            onEdit={openEdit}
                                            tagId={tag.id}
                                            tagName={tag.name}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Sheet onOpenChange={(nextOpen) => !nextOpen && closePanel()} open={open}>
                <SheetContent className="flex h-full w-full flex-col overflow-y-auto sm:max-w-lg">
                    <SheetHeader>
                        <SheetTitle>
                            {mode === 'create'
                                ? 'Ajouter'
                                : `Modifier : ${selectedTag?.name ?? ''}`}
                        </SheetTitle>
                        <SheetDescription>
                            {mode === 'create'
                                ? 'Créez un tag et prévisualisez son rendu.'
                                : 'Mettez à jour le tag. L’aperçu se met à jour automatiquement.'}
                        </SheetDescription>
                    </SheetHeader>

                    <div className="flex min-h-0 flex-1 flex-col px-4 pb-4">
                        <AdminMutationForm
                            actionsClassName="mt-auto border-t border-border pt-4"
                            area="tags"
                            className="flex flex-1 flex-col"
                            deferActions
                            footer={
                                <Button
                                    className="w-full"
                                    onClick={closePanel}
                                    type="button"
                                    variant="outline"
                                >
                                    Annuler
                                </Button>
                            }
                            formId="tag-mutation-form"
                            key={mode === 'create' ? 'create' : selectedTagId}
                            onFormValuesChange={updatePreview}
                            operation={mode === 'create' ? 'créé' : 'modifié'}
                            submitClassName="w-full"
                            submitLabel={mode === 'create' ? 'Ajouter' : 'Enregistrer'}
                        >
                            {mode === 'edit' && selectedTag ? (
                                <input name="id" type="hidden" value={selectedTag.id} />
                            ) : null}
                            <TagFormFields tag={mode === 'edit' ? selectedTag : undefined} />
                            <div className="space-y-2">
                                <div className="space-y-2 rounded-lg border border-dashed border-border p-4">
                                    <p className="text-sm font-medium">Aperçu</p>
                                    <TagBadge tag={previewTag} />
                                    {previewTag.slug ? (
                                        <p className="text-xs text-muted-foreground">
                                            Slug : {previewTag.slug}
                                        </p>
                                    ) : null}
                                </div>
                            </div>
                        </AdminMutationForm>
                    </div>
                </SheetContent>
            </Sheet>
        </>
    )
}
