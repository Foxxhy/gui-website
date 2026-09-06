# Décision — Schéma MongoDB

Document de référence avant branchement MongoDB. Décisions retenues pour le POC → production.

## Collections

| Collection | Rôle |
| --- | --- |
| `users` | Profils utilisateur (`IUser` sans credentials) |
| `accounts` | Identifiants de connexion (`login`, `passwordHash`, `userId`) |
| `articles` | Contenus éditoriaux |
| `tags` | Taxonomie |
| `pages` | Pages configurables (sections typées) |
| `contactFormConfigurations` | Configuration du formulaire (document actif ou versionné) |
| `contactSubmissions` | Messages reçus (append-only) |
| `analyticsEvents` | Événements analytics (append-only) |
| `featureFlags` | Document unique `{ home, articles, contact }` |

## Stratégie références vs embeds

| Relation | Décision retenue | Justification |
| --- | --- | --- |
| Article → auteur | `authorId` + `$lookup` à la lecture | Évite la dérive si le profil change |
| Article → tags | `tagIds[]` + `$lookup` | Cohérent avec CRUD tags et suppression en cascade |
| Page → articles (featured) | `articleSlugs[]` dans la section | Slugs stables pour la configuration de page |
| Affichage public | Populate auteur (pseudonyme) et tags via repository | Conserve l’interface `IArticle` actuelle côté UI |

## Indexes minimum

- `articles.slug` — unique
- `pages.slug` — unique
- `tags.slug` — unique
- `accounts.login` — unique
- `articles` — `{ status: 1, publishedAt: -1 }` pour le listing public
- `analyticsEvents.timestamp` — TTL ou index temporel pour agrégations

## Identifiants

Conserver des chaînes (`user-admin`, `article-1`) en POC ; migrer vers ObjectId MongoDB en production en conservant la même couche repository.

## Statut

Décision validée — implémentation MongoDB reportée après stabilisation de la couche repository mock.
