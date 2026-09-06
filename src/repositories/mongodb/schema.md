# Schéma MongoDB

Base de données sélectionnée via `MONGODB_DB_NAME` (ex. `gui-website-dev`, `gui-website-recette`, `gui-website-prod`).

Les documents reprennent les champs des interfaces `I*` de `src/types/`. Le champ applicatif `id` est utilisé comme `_id` (string) pour rester aligné avec les mocks.

Référence décisionnelle : [docs/decisions-mongodb-schema.md](../../docs/decisions-mongodb-schema.md).

## Collections

| Collection | Rôle |
| --- | --- |
| `users` | Profils utilisateur (`IUser`, sans credentials) |
| `accounts` | Identifiants de connexion (`login`, `passwordHash`, `userId`) |
| `articles` | Contenus éditoriaux (`authorId`, `tagIds[]` — populate à la lecture) |
| `tags` | Taxonomie |
| `pages` | Pages configurables (sections typées) |
| `contactFormConfigurations` | Document `_id: contactForm` — `IContactFormConfiguration` |
| `contactSubmissions` | Messages reçus (append-only) |
| `featureFlags` | Document `_id: featureFlags` — `IFeatureFlags` |
| `analyticsEvents` | Événements analytics (append-only, `timestamp` en BSON Date) |

## Stratégie références vs embeds

| Relation | Stockage MongoDB | Lecture repository |
| --- | --- | --- |
| Article → auteur | `authorId` | Populate `IUser` dans `IArticle.author` |
| Article → tags | `tagIds[]` | Populate `ITag[]` dans `IArticle.tags` |
| Page → articles featured | `articleSlugs[]` dans la section | Inchangé côté UI |

## Indexes suggérés

- `accounts.login` — unique
- `articles.slug` — unique
- `articles` — `{ status: 1, publishedAt: -1 }`
- `pages.slug` — unique
- `tags.slug` — unique
- `analyticsEvents.timestamp` — index temporel

## Création des collections

MongoDB crée les collections à la première insertion. Aucune donnée n’est initialisée automatiquement.
