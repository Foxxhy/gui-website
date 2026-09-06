# Schéma MongoDB initial

Base de données sélectionnée via `MONGODB_DB_NAME` (ex. `gui-website-dev`, `gui-website-recette`, `gui-website-prod`).

Les documents reprennent les champs des interfaces `I*` de `src/types/`. Le champ applicatif `id` est utilisé comme `_id` (string) pour rester aligné avec les mocks.

## Collections prévues

### `users`

Source : `IUser`

- Pas de mots de passe (l’authentification reste mockée dans le POC).
- Index suggéré (migration future) : `email` (unique).

### `articles`

Source : `IArticle`

- Conserver la dénormalisation actuelle (`tags`, `author` embarqués) comme dans les mocks.
- Index suggéré (migration future) : `slug` (unique), `status`.

### `tags`

Source : `ITag`

- Index suggéré (migration future) : `slug` (unique).

### `settings`

Documents clé/valeur :

| `_id` | Contenu |
| --- | --- |
| `featureFlags` | `IFeatureFlags` |
| `contactForm` | `IContactFormConfiguration` |

### `analytics_events`

Source : `IAnalyticsEvent`

- `timestamp` stocké en `Date` BSON.
- Index suggéré (migration future) : `timestamp`, `type`.

### `pages` (hors périmètre de migration immédiate)

Source : `IPage`

- Documentée pour les futures US ; collection créée uniquement lors de la migration des pages.

## Création des collections

MongoDB crée les collections à la première insertion. Aucune collection ni donnée n’est initialisée dans cette US.
