# Schéma MongoDB

Base de données sélectionnée via `MONGODB_DB_NAME` (ex. `gui-website-dev`, `gui-website-recette`, `gui-website-prod`).

Les documents reprennent les champs des interfaces `I*` de `src/types/`. Le champ applicatif `id` est utilisé comme `_id` (string) pour rester aligné avec les mocks.

Référence décisionnelle : [`docs/decisions-mongodb-schema.md`](../../../docs/decisions-mongodb-schema.md).

## Collections

| Collection | Rôle | Source |
| --- | --- | --- |
| `users` | Profils utilisateur (`IUser`, sans credentials) | `IUser` |
| `accounts` | Identifiants (`login`, `passwordHash`, `userId`) | `IUserCredentials` |
| `articles` | Contenus éditoriaux avec `authorId` et `tagIds` | `IArticle` (populate à la lecture) |
| `tags` | Taxonomie | `ITag` |
| `pages` | Pages configurables (sections typées) | `IPage` |
| `featureFlags` | Document unique `{ home, articles, contact }` | `IFeatureFlags` |
| `contactFormConfigurations` | Configuration active du formulaire | `IContactFormConfiguration` |
| `analytics_events` | Événements analytics (append-only) | `IAnalyticsEvent` |

## Stratégie références vs embeds

| Relation | Décision | Implémentation |
| --- | --- | --- |
| Article → auteur | `authorId` + lookup à la lecture | Repository articles |
| Article → tags | `tagIds[]` + lookup à la lecture | Repository articles |
| Page → articles (featured) | `articleSlugs[]` dans la section | Inchangé côté `IPage` |
| Affichage public | Populate auteur et tags | Conserve `IArticle` côté UI |

## Indexes minimum

- `users.email` — unique
- `accounts.login` — unique
- `accounts.userId` — unique
- `articles.slug` — unique
- `articles` — `{ status: 1, publishedAt: -1 }`
- `pages.slug` — unique
- `tags.slug` — unique
- `analytics_events.timestamp` — index temporel

## Création des collections

MongoDB crée les collections à la première insertion. Les index sont assurés par les repositories MongoDB au premier accès.

## Collections futures (hors périmètre actuel)

- `contactSubmissions` — messages reçus (append-only), prévu dans la décision mais non branché au POC actuel
