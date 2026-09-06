import { IRole } from '@/types'
import { getRolePermissions, ROLE_LABELS } from './role-permissions'

describe('getRolePermissions', () => {
    it('returns admin permissions including users and features', () => {
        const permissions = getRolePermissions(IRole.ADMIN)

        expect(permissions.label).toBe(ROLE_LABELS[IRole.ADMIN])
        expect(permissions.actions).toEqual([
            'Gérer les articles',
            'Gérer les pages',
            'Gérer les tags',
            'Gérer le formulaire de contact',
            'Gérer les utilisateurs',
            'Gérer la configuration des modules',
            'Consulter les analytics',
            'Modifier son mot de passe',
        ])
    })

    it('returns editor permissions without users or features', () => {
        const permissions = getRolePermissions(IRole.EDITOR)

        expect(permissions.actions).toEqual([
            'Gérer les articles',
            'Gérer les pages',
            'Gérer les tags',
            'Gérer le formulaire de contact',
            'Consulter les analytics',
            'Modifier son mot de passe',
        ])
        expect(permissions.actions).not.toContain('Gérer les utilisateurs')
        expect(permissions.actions).not.toContain('Gérer la configuration des modules')
    })

    it('returns no actions for blocked users', () => {
        expect(getRolePermissions(IRole.BLOCKED)).toEqual({
            label: ROLE_LABELS[IRole.BLOCKED],
            actions: [],
        })
    })
})
