import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { TAG_STYLES, type ITag } from '@/types'

export const TagFormFields = ({ tag }: { tag?: Pick<ITag, 'name' | 'slug' | 'style' | 'description'> }) => (
    <div className="space-y-4">
        <div className="space-y-2">
            <Label htmlFor="name">Nom</Label>
            <Input defaultValue={tag?.name} id="name" name="name" required />
        </div>
        <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input defaultValue={tag?.slug} id="slug" name="slug" required />
        </div>
        <div className="space-y-2">
            <Label htmlFor="style">Style</Label>
            <Select defaultValue={tag?.style ?? 'green'} id="style" name="style" required>
                {TAG_STYLES.map((style) => (
                    <option key={style} value={style}>{style}</option>
                ))}
            </Select>
        </div>
        <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea defaultValue={tag?.description} id="description" name="description" />
        </div>
    </div>
)
