<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# gui-website

POC de site associatif. Il sert à valider les parcours publics, d'administration et de formulaire ; il n'est pas une implémentation de production. La pile est Next.js 16.3.4 (App Router), React 19, TypeScript 5 strict, Tailwind 4 et Biome 2.4.2. Le React Compiler est activé.

## Explorer avec un coût de contexte limité

Les instructions de [.github/copilot-instructions.md](.github/copilot-instructions.md) font autorité pour l'exploration. Quand [graphify-out/graph.json](graphify-out/graph.json) existe, interroger d'abord Graphify pour toute question d'architecture, de dépendances, d'emplacement ou de parcours de données. Ne lire les sources concernées qu'après une requête ciblée, pour modifier ou déboguer le comportement identifié. Ne pas dupliquer ici la documentation détaillée des relations entre fichiers.

Avant d'écrire du code Next.js, respecter le bloc auto-généré ci-dessus : consulter le guide pertinent dans `node_modules/next/dist/docs/` de la version installée.

## Carte du code

- `src/app/` : routes, pages et layouts App Router. L'interface publique comprend `/`, `/articles`, `/articles/[slug]`, `/association`, `/contact` et `/connexion`. Le back office est sous `/administration/*` (articles, pages, formulaire de contact et utilisateurs).
- `src/components/` : composants React réutilisables. `forms.tsx` contient les formulaires public/admin ; `public.tsx` contient les éléments de rendu public.
- `src/types/` : contrats TypeScript. Les interfaces sont nommées avec le préfixe `I`; les index exportent les contrats publics.
- `src/mocks/data.ts` : graines en mémoire pour utilisateurs, comptes, contenus, pages et configuration de contact. `src/mocks/index.ts` est le point d'accès.
- `src/services/` : frontière de logique métier et de données (`serviceAuth`, `serviceContent`, `serviceContact`, `serviceUser`, session). Chaque module est un dossier (`module.ts`, `module.spec.ts`, `index.ts`). Toute future API ou base de données doit être branchée derrière ces services, pas directement depuis une page ou un composant.
- `src/actions/` : Server Actions pour l'authentification, les mutations d'administration et l'envoi du contact. Même convention dossier + `index` + spec ; les barrels `@/actions` / `@/services` restent les points d'import privilégiés.
- `src/analytics/` : logique analytics canonique (`serviceAnalytics`, tracking, stats) et `AnalyticsTracker` client. `src/services/analytics/` réexporte uniquement le pont service.
- `src/configs/` : configuration applicative (`app/`) avec la même convention dossier + index + spec.
- `src/proxy.ts` : protection de navigation des routes d'administration.

Flux habituel : types et mocks alimentent les services ; les actions orchestrent les mutations et autorisations ; les pages et composants affichent les résultats. Préserver cette séparation pour les nouvelles fonctionnalités.

## Données, authentification et autorisation

Toutes les données sont mockées : il n'existe ni base de données ni persistance. Les méthodes de mutation simulent une réponse `IActionResult`; après rechargement, les graines initiales sont restaurées. Ne pas présenter une mutation comme durable sans ajouter explicitement une couche de persistance.

La session est le cookie HTTP-only `association_poc_session`. `actionLogin()` authentifie l'utilisateur, stocke son identifiant dans ce cookie et ne redirige que vers `/administration` ou l'URL d'administration fournie dans `returnTo`. `serviceGetCurrentSession()` relit le cookie côté serveur. `proxy()` redirige toute requête non authentifiée vers `/connexion` tout en conservant la destination demandée dans `returnTo`.

Les contrôles de `proxy()` ne suffisent pas : chaque mutation protégée doit relire la session et vérifier `serviceAuth.canManage()`, comme le fait `actionSubmitAdminMutation()`. Les rôles sont :

- `ADMIN` : tous les espaces, y compris la gestion des utilisateurs.
- `EDITOR` : articles, pages et formulaire de contact, mais pas utilisateurs.
- `BLOCKED` : accès aux opérations d'administration refusé.

Comptes de démonstration : `admin` / `admin` et `editor` / `editor`. Le cookie et les identifiants en clair sont acceptables uniquement pour ce POC : avant une mise en production, remplacer ce mécanisme par une authentification et une gestion de session sécurisées.

## Conventions d'implémentation

- Utiliser l'alias `@/*` vers `src/*` plutôt que des chemins relatifs profonds.
- Garder `use server` en tête des modules de Server Actions. Les modules ne pouvant s'exécuter que côté serveur, notamment la session, importent `server-only`.
- Ne pas faire importer de module serveur par un composant client. Garder les vérifications d'autorisation dans les actions/services serveur, même si l'interface masque déjà une action interdite.
- Suivre Biome : indentation de quatre espaces, points-virgules seulement lorsque nécessaires, imports organisés, règles recommandées Next.js et React. Les directives Tailwind sont prises en charge par le parseur CSS.
- Conserver TypeScript strict et les types explicites aux frontières : formulaires, services et données mockées.

## Commandes de validation

- `npm run dev` : démarre le serveur de développement Next.js et active le proxy.
- `npm run lint` : vérifie le code avec Biome.
- `npm test` : exécute les specs Jest (`*.spec.ts`).
- `npm run build` : vérifie le build de production Next.js.
- `npm run format` : reformate les fichiers avec Biome et modifie le répertoire de travail.

Après une modification applicative, exécuter au minimum le lint et les tests ; lancer aussi le build lorsqu'elle touche au routage, aux composants, aux types, aux actions ou à la configuration.
