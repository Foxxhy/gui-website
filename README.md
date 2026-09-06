# gui-website

POC de site associatif. Il sert à valider les parcours publics, d'administration et de formulaire ; il n'est pas une implémentation de production. La pile est Next.js 16.3.4 (App Router), React 19, TypeScript 5 strict, Tailwind 4 et Biome 2.4.2. Le React Compiler est activé.

## Explorer avec un coût de contexte limité

Les instructions de [.github/copilot-instructions.md](.github/copilot-instructions.md) font autorité pour l'exploration. Quand [graphify-out/graph.json](graphify-out/graph.json) existe, interroger d'abord Graphify pour toute question d'architecture, de dépendances, d'emplacement ou de parcours de données.

## Carte du code

- `src/app/` : routes, pages et layouts App Router.
- `src/components/` : composants React réutilisables.
- `src/actions/` : Server Actions pour l'authentification, le contact et les mutations d'administration.
- `src/services/` : logique métier et orchestration.
- `src/repositories/` : accès aux données (implémentations mock aujourd'hui, MongoDB demain).
- `src/mocks/` : graines initiales pour l'implémentation mock.
- `src/types/` : contrats TypeScript partagés.
- `docs/` : décisions d'architecture (schéma MongoDB, stratégie auth).

Flux : types → repositories → services → actions/pages.

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
| `npm test` | Jest (75+ specs) |

Avant une livraison : `npm run lint`, `npm test`, `npm run build`.

## Comptes de démonstration

| Rôle | Identifiant | Mot de passe |
| --- | --- | --- |
| Administrateur | `admin` | `admin` |
| Éditeur | `editor` | `editor` |

## Authentification

- Sessions signées (HMAC-SHA256) via `AUTH_SECRET`
- Mots de passe hashés (scrypt) dans la couche repository
- Cookie HTTP-only configuré dans `.env.example`
- Protection admin : `src/proxy.ts` + layout + Server Actions

Voir [docs/decisions-auth-strategy.md](docs/decisions-auth-strategy.md).

## Données

Les repositories mock persistent en mémoire pendant l'exécution du processus. Voir [docs/decisions-mongodb-schema.md](docs/decisions-mongodb-schema.md) pour la stratégie MongoDB.

## Hors périmètre actuel

- UI shadcn et identité visuelle (phase finale)
- MongoDB (prochaine étape après stabilisation des repositories)
