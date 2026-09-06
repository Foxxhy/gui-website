# Association POC

Proof of concept fonctionnel d’un site associatif. Il valide les parcours publics, de contact, de connexion et d’administration.

## Stack technique

- Next.js 16 (App Router) et React 19
- TypeScript strict
- Tailwind CSS 4
- Biome pour le lint, le formatage et l’organisation des imports

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

## Architecture

| Répertoire | Responsabilité |
| --- | --- |
| [src/app](src/app) | Routes, pages et layouts |
| [src/components](src/components) | Composants React réutilisables |
| [src/actions](src/actions) | Server Actions |
| [src/services](src/services) | Logique métier |
| [src/repositories](src/repositories) | Accès aux données (mock ou MongoDB via `DATA_SOURCE`) |
| [src/mocks](src/mocks) | Graines de démonstration |
| [src/types](src/types) | Contrats TypeScript |
| [docs](docs) | Décisions d’architecture |

Flux : types → repositories → services → actions/pages.

## Comptes de démonstration

| Rôle | Identifiant | Mot de passe |
| --- | --- | --- |
| Administrateur | `admin` | `admin` |
| Éditeur | `editor` | `editor` |

## Authentification

- Sessions signées (HMAC-SHA256) via `AUTH_SECRET`
- Mots de passe hashés (scrypt) — voir [docs/decisions-auth-strategy.md](docs/decisions-auth-strategy.md)
- Protection admin : `src/proxy.ts` + layout + Server Actions

## Données

Les services passent par `src/repositories` selon `DATA_SOURCE`. Voir :

- [docs/decisions-mongodb-schema.md](docs/decisions-mongodb-schema.md)
- [docs/mongodb-setup.md](docs/mongodb-setup.md)

## Hors périmètre actuel

- UI shadcn et identité visuelle (phase finale)
