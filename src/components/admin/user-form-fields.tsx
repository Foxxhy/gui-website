import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { IRole, type IUser } from '@/types'

export const UserFormFields = ({ user }: { user?: IUser }) => (
    <>
        {user && <input name="id" type="hidden" value={user.id} />}
        <div className="space-y-2">
            <Label htmlFor="name">Nom</Label>
            <Input defaultValue={user?.name} id="name" name="name" required />
        </div>
        <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input defaultValue={user?.email} id="email" name="email" required type="email" />
        </div>
        <div className="space-y-2">
            <Label htmlFor="pseudonym">Pseudonyme</Label>
            <Input defaultValue={user?.pseudonym} id="pseudonym" name="pseudonym" required />
        </div>
        <div className="space-y-2">
            <Label htmlFor="role">Rôle</Label>
            <Select defaultValue={user?.role ?? IRole.EDITOR} id="role" name="role">
                <option value={IRole.EDITOR}>Éditeur</option>
                <option value={IRole.ADMIN}>Administrateur</option>
                <option value={IRole.BLOCKED}>Bloqué</option>
            </Select>
        </div>
        {!user && (
            <>
                <div className="space-y-2">
                    <Label htmlFor="login">Identifiant de connexion</Label>
                    <Input id="login" name="login" required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="password">Mot de passe initial</Label>
                    <Input id="password" name="password" required type="password" />
                </div>
            </>
        )}
    </>
)
