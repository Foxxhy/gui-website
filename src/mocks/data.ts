import {
    ICategory,
    IContactFieldType,
    IRole,
    IStatus,
    type IArticle,
    type IContactFormConfiguration,
    type IFeatureFlags,
    type IPage,
    type ITag,
    type IUser,
} from '@/types'

export interface IMockAccount {
    user: IUser
    login: string
    passwordHash: string
}

export const users: IUser[] = [
    {
        id: 'user-admin',
        name: 'Administratrice du POC',
        email: 'admin@association.test',
        pseudonym: 'Admin Association',
        role: IRole.ADMIN,
        createdAt: '2026-01-01T09:00:00.000Z',
        updatedAt: '2026-01-01T09:00:00.000Z',
    },
    {
        id: 'user-editor',
        name: 'Éditeur du POC',
        email: 'editor@association.test',
        pseudonym: 'Équipe éditoriale',
        role: IRole.EDITOR,
        createdAt: '2026-01-05T09:00:00.000Z',
        updatedAt: '2026-01-05T09:00:00.000Z',
    },
    {
        id: 'user-blocked',
        name: 'Compte bloqué',
        email: 'blocked@association.test',
        pseudonym: 'Compte bloqué',
        role: IRole.BLOCKED,
        createdAt: '2026-01-10T09:00:00.000Z',
        updatedAt: '2026-01-10T09:00:00.000Z',
    },
]

// Hash pré-calculés (scrypt) pour les comptes démo ; aucun mot de passe en clair dans le dépôt.
export const accounts: IMockAccount[] = [
    {
        user: users[0],
        login: 'admin',
        passwordHash: 'scrypt:VTJDNipPx0IAeWuC110ubQ:nKZSn5WNQJF_avB9nG0khMgz3R3sexjwXJbtHaiJo6DUwi-R58IkPhoyLnv6nBeuB_cKw0_DuFPChJE1fHMLMg',
    },
    {
        user: users[1],
        login: 'editor',
        passwordHash: 'scrypt:IJylgnI7fwg9KWB6UnkJOQ:M-kbOmvy1dBDV19byHIDiWhDzRH-iteLyLhHoKfetAgJpdeTMPlDAI9gTCWvpwVMHf4OismXJARs-35SWvDPew',
    },
]

export const featureFlags: IFeatureFlags = {
    home: true,
    articles: true,
    contact: true,
}

export const tags: ITag[] = [
    { id: 'tag-association', name: 'Association', slug: 'association', style: 'green', description: 'La vie et les actions de l’association.' },
    { id: 'tag-evenement', name: 'Événement', slug: 'evenement', style: 'blue', description: 'Les rendez-vous ouverts au public.' },
    { id: 'tag-culture', name: 'Culture', slug: 'culture', style: 'purple' },
]

export const articles: IArticle[] = [
    {
        id: 'article-1',
        title: 'Bienvenue sur le site de notre association',
        slug: 'bienvenue-association',
        description: 'Découvrez le projet associatif et les premiers rendez-vous de l’année.',
        content: 'Notre association réunit des personnes qui souhaitent agir ensemble. Cette première actualité présente nos objectifs et les rendez-vous à venir.',
        category: ICategory.ACTUALITES,
        tags: [tags[0]],
        author: users[0],
        status: IStatus.PUBLISHED,
        publishedAt: '2026-02-01T10:00:00.000Z',
        createdAt: '2026-01-20T10:00:00.000Z',
        updatedAt: '2026-02-01T10:00:00.000Z',
    },
    {
        id: 'article-2',
        title: 'Atelier participatif du printemps',
        slug: 'atelier-participatif-printemps',
        description: 'Un temps d’échange ouvert à toutes et tous pour imaginer nos prochaines actions.',
        content: 'L’atelier du printemps permettra de recueillir les idées des adhérents et des habitants. Venez partager vos propositions.',
        category: ICategory.EVENEMENTS,
        tags: [tags[0], tags[1]],
        author: users[1],
        status: IStatus.PUBLISHED,
        publishedAt: '2026-03-12T14:00:00.000Z',
        createdAt: '2026-03-01T10:00:00.000Z',
        updatedAt: '2026-03-12T14:00:00.000Z',
    },
    {
        id: 'article-3',
        title: 'Projet en préparation',
        slug: 'projet-en-preparation',
        description: 'Brouillon réservé au back office.',
        content: 'Ce contenu n’est pas encore publié.',
        category: ICategory.PROJETS,
        author: users[1],
        status: IStatus.DRAFT,
        createdAt: '2026-04-01T10:00:00.000Z',
        updatedAt: '2026-04-01T10:00:00.000Z',
    },
]

export const pages: IPage[] = [
    {
        id: 'page-home',
        title: 'Accueil',
        slug: 'accueil',
        content: 'Page d’accueil configurable du POC.',
        sections: [
            { id: 'home-hero', type: 'hero', title: 'Association POC', content: 'Agir ensemble pour notre territoire.', order: 1 },
            { id: 'home-text', type: 'text', title: 'Notre démarche', content: 'Cette page est alimentée par une configuration mockée et ordonnée.', order: 2 },
            { id: 'home-articles', type: 'featured-articles', title: 'À la une', articleSlugs: ['bienvenue-association', 'atelier-participatif-printemps'], order: 3 },
            { id: 'home-contact', type: 'call-to-action', title: 'Nous contacter', content: 'Une question ou une proposition ?', label: 'Accéder au contact', href: '/contact', order: 4 },
        ],
        seo: {},
        createdAt: '2026-01-01T09:00:00.000Z',
        updatedAt: '2026-01-01T09:00:00.000Z',
    },
    {
        id: 'page-association',
        title: 'Présentation de l’association',
        slug: 'association',
        content: 'Informations de présentation.',
        sections: [
            { id: 'association-hero', type: 'hero', title: 'Notre association', content: 'Une association ouverte, utile et engagée.', order: 1 },
            { id: 'association-history', type: 'text', title: 'Notre histoire', content: 'L’association est née d’une volonté de créer du lien et de développer des initiatives locales.', order: 2 },
            { id: 'association-values', type: 'text', title: 'Nos valeurs et activités', content: 'Nous défendons l’écoute, la solidarité et la participation. Nous organisons des ateliers, rencontres et projets collectifs.', order: 3 },
        ],
        seo: {},
        createdAt: '2026-01-01T09:00:00.000Z',
        updatedAt: '2026-01-01T09:00:00.000Z',
    },
]

export const contactFormConfiguration: IContactFormConfiguration = {
    id: 'contact-form',
    title: 'Contacter l’association',
    description: 'Les champs de ce formulaire proviennent de la configuration mockée.',
    fields: [
        { id: 'field-name', technicalName: 'name', label: 'Nom', type: IContactFieldType.TEXT, required: true, placeholder: 'Votre nom', order: 1 },
        { id: 'field-email', technicalName: 'email', label: 'Adresse e-mail', type: IContactFieldType.EMAIL, required: true, placeholder: 'vous@exemple.fr', order: 2 },
        { id: 'field-subject', technicalName: 'subject', label: 'Sujet', type: IContactFieldType.SELECT, required: true, helpText: 'Choisissez le motif de votre demande.', options: ['Information', 'Adhésion', 'Partenariat'], order: 3 },
        { id: 'field-message', technicalName: 'message', label: 'Message', type: IContactFieldType.TEXTAREA, required: true, placeholder: 'Votre message', order: 4 },
    ],
}