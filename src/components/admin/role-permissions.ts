import { ADMINISTRATION_PERMISSIONS, IRole, type IServiceAdminArea } from '@/types'

export const ROLE_LABELS: Record<IRole, string> = {
    [IRole.ADMIN]: 'Administrateur',
    [IRole.EDITOR]: 'Éditeur',
    [IRole.BLOCKED]: 'Bloqué',
}

const AREA_ACTIONS: Record<IServiceAdminArea, string> = {
    articles: 'Gérer les articles',
    pages: 'Gérer les pages',
    tags: 'Gérer les tags',
    contactForm: 'Gérer le formulaire de contact',
    users: 'Gérer les utilisateurs',
    features: 'Gérer la configuration des modules',
    analytics: 'Consulter les analytics',
}

const COMMON_ACTIONS = ['Modifier son mot de passe']

export const getRolePermissions = (role: IRole) => {
    if (role === IRole.BLOCKED) {
        return { label: ROLE_LABELS[role], actions: [] as string[] }
    }

    const areaActions = (Object.keys(ADMINISTRATION_PERMISSIONS) as IServiceAdminArea[])
        .filter((area) => (ADMINISTRATION_PERMISSIONS[area] as readonly IRole[]).includes(role))
        .map((area) => AREA_ACTIONS[area])

    return {
        label: ROLE_LABELS[role],
        actions: [...areaActions, ...COMMON_ACTIONS],
    }
}
