# Association POC

Proof of concept fonctionnel d’un site associatif. Il valide les parcours publics, de contact, de connexion et d’administration.

## Stack technique

- Next.js 16 (App Router) et React 19
- TypeScript strict
- Tailwind CSS 4 et Shadcn UI (`base-nova`)
- React Compiler activé
- Biome pour le lint, le formatage et l’organisation des imports
- Jest pour les tests unitaires

## Démarrer

```bash
npm ci
npm run dev
```

## Scripts

| Commande | Usage |
| --- | --- |
| `npm run dev` | Serveur de développement |
| `npm run build` | Build production |
| `npm run lint` | Biome |
| `npm test` | Jest |

Avant une livraison : `npm run lint`, `npm test`, `npm run build`.

## Parcours principaux

### Public

- `/` — Accueil
- `/articles`, `/articles/[slug]` — Articles
- `/association` — Présentation
- `/contact` — Formulaire (libellé « Témoigner »)
- `/gestion-des-donnees` — Gestion des données

### Administration

- `/connexion` — Authentification
- `/administration/*` — Back office (articles, pages, tags, formulaire contact, utilisateurs, analytics)

## Architecture

| Répertoire | Responsabilité |
| --- | --- |
| [src/app](src/app) | Routes, pages et layouts |
| [src/components/public](src/components/public) | Interface publique (header, footer, contenu) |
| [src/components/admin](src/components/admin) | Interface d’administration |
| [src/components/ui](src/components/ui) | Composants Shadcn générés |
| [src/components/forms.tsx](src/components/forms.tsx) | Formulaires publics et admin |
| [src/actions](src/actions) | Server Actions |
| [src/services](src/services) | Logique métier et validation |
| [src/repositories/mock](src/repositories/mock) | Implémentations mock actives |
| [src/repositories/mongodb](src/repositories/mongodb) | Infrastructure MongoDB (stubs) |
| [src/repositories/factory.ts](src/repositories/factory.ts) | Point d’entrée `getRepositories()` |
| [src/mocks](src/mocks) | Graines de démonstration |
| [src/types](src/types) | Contrats TypeScript |
| [src/analytics](src/analytics) | Tracking et statistiques |
| [src/configs](src/configs) | Configuration applicative |
| [src/proxy.ts](src/proxy.ts) | Protection des routes admin |
| [docs](docs) | Décisions d’architecture et revue technique |

Flux : **UI → actions → services → `getRepositories()` → mock / MongoDB**.

## Comptes de démonstration

| Rôle | Identifiant | Mot de passe |
| --- | --- | --- |
| Administrateur | `admin` | `admin` |
| Éditeur | `editor` | `editor` |

## Authentification

- Sessions signées (HMAC-SHA256) via `AUTH_SECRET`
- Mots de passe hashés (scrypt) — voir [docs/decisions-auth-strategy.md](docs/decisions-auth-strategy.md)
- Protection admin : `src/proxy.ts` délègue à `serviceAuth`, complété par le layout et les Server Actions

## Données

Les services passent par `getRepositories()` selon `DATA_SOURCE`. Voir :

- [docs/decisions-mongodb-schema.md](docs/decisions-mongodb-schema.md)
- [docs/mongodb-setup.md](docs/mongodb-setup.md)
- [docs/revue-technique-refactorisation.md](docs/revue-technique-refactorisation.md)

## Hors périmètre actuel

- Persistance MongoDB complète (repositories stub uniquement)
- Durcissement production (rate limiting, anti-spam, audit sécurité)
- Hébergement et déploiement
