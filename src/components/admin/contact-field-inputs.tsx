import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import type { IContactField } from '@/types'

export const ContactFieldInputs = ({ field }: { field?: IContactField }) => (
    <div className="space-y-4">
        {field && <input name="id" type="hidden" value={field.id} />}
        <div className="space-y-2">
            <Label htmlFor="technicalName">Identifiant technique</Label>
            <Input defaultValue={field?.technicalName} id="technicalName" name="technicalName" required />
        </div>
        <div className="space-y-2">
            <Label htmlFor="label">Libellé</Label>
            <Input defaultValue={field?.label} id="label" name="label" required />
        </div>
        <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select defaultValue={field?.type ?? 'text'} id="type" name="type">
                <option value="text">Texte</option>
                <option value="email">E-mail</option>
                <option value="textarea">Zone de texte</option>
                <option value="select">Liste</option>
            </Select>
        </div>
        <div className="space-y-2">
            <Label htmlFor="placeholder">Texte d’aide / placeholder</Label>
            <Input defaultValue={field?.placeholder} id="placeholder" name="placeholder" />
        </div>
        <div className="space-y-2">
            <Label htmlFor="options">Options de liste (une par ligne)</Label>
            <Textarea defaultValue={field?.options?.join('\n')} id="options" name="options" />
        </div>
        <div className="flex items-center gap-2">
            <Checkbox defaultChecked={field?.required} id="required" name="required" value="true" />
            <Label htmlFor="required">Obligatoire</Label>
        </div>
    </div>
)
