import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { IPage } from '@/types'

export const PageFormFields = ({
    page,
}: {
    page: Pick<IPage, 'title' | 'content'>
}) => (
    <div className="space-y-4">
        <div className="space-y-2">
            <Label htmlFor="title">Titre</Label>
            <Input defaultValue={page.title} id="title" name="title" required />
        </div>
        <div className="space-y-2">
            <Label htmlFor="content">Contenu</Label>
            <Textarea
                className="min-h-24"
                defaultValue={page.content}
                id="content"
                name="content"
                required
            />
        </div>
    </div>
)
