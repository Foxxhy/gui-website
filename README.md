# Association POC

Proof of concept fonctionnel d’un site associatif. Il valide les parcours publics, de contact, de connexion et d’administration ; l’interface repose volontairement sur du HTML sémantique, sans travail graphique abouti.

## Stack technique

- Next.js 16 (App Router) et React 19
- TypeScript strict
- Tailwind CSS 4
- Biome pour le lint, le formatage et l’organisation des imports

Le React Compiler est activé dans [next.config.ts](next.config.ts).

## Prérequis et installation

Utiliser une version LTS récente de Node.js, puis installer les dépendances :

```bash
npm ci
```

`npm install` convient également lorsqu’il est nécessaire de mettre à jour les dépendances. Le fichier de verrouillage [package-lock.json](package-lock.json) doit être conservé pour des installations reproductibles.

## Démarrer

```bash
npm run dev
```

Ouvrir ensuite l’adresse affichée par Next.js, généralement `http://localhost:3000`.

## Scripts disponibles

| Commande | Usage |
| --- | --- |
| `npm run dev` | Démarre le serveur de développement Next.js. |
| `npm run build` | Génère le build de production et vérifie TypeScript. |
| `npm run start` | Démarre l’application compilée après un build. |
| `npm run lint` | Vérifie le code avec Biome. |
| `npm run format` | Reformate les fichiers avec Biome. |

Avant une livraison, exécuter au minimum :

```bash
npm run lint
npm run build
```

## Architecture

Le projet sépare les responsabilités afin de pouvoir remplacer les données mockées par une API ou une base de données sans réécrire les pages :

| Répertoire | Responsabilité |
| --- | --- |
| [src/app](src/app) | Routes, pages et layouts de l’App Router. |
| [src/components](src/components) | Composants React réutilisables, dont les formulaires publics et d’administration. |
| [src/actions](src/actions) | Server Actions pour l’authentification, le contact et les mutations d’administration. |
| [src/services](src/services) | Logique métier, accès aux données et gestion de session. |
| [src/mocks](src/mocks) | Données seed, comptes de démonstration et configurations en mémoire. |
| [src/repositories](src/repositories) | Abstraction d’accès aux données (mocks ou MongoDB). |
| [src/types](src/types) | Contrats TypeScript partagés. |

Les imports utilisent l’alias `@/*` vers `src/*`. Les interfaces suivent la convention `I*` : `IArticle`, `IUser`, `ISession` et `IActionResult`.

## Parcours

- Public : accueil configurable (`/`), articles (`/articles`), détail (`/articles/[slug]`), présentation (`/association`), contact (`/contact`) et connexion (`/connexion`).
- Administration : tableau de bord (`/administration`), articles, pages, utilisateurs et configuration du formulaire de contact.

Les routes d’administration sont protégées par le proxy dans [src/proxy.ts](src/proxy.ts). Lorsqu’aucune session n’est présente, le visiteur est redirigé vers `/connexion` ; la destination demandée est conservée avec le paramètre `returnTo`.

## Comptes de démonstration

| Rôle | Identifiant | Mot de passe | Accès |
| --- | --- | --- | --- |
| Administrateur | `admin` | `admin` | Tous les espaces |
| Éditeur | `editor` | `editor` | Articles, pages et formulaire de contact |

## Données mockées

Les seeds, comptes et configurations sont centralisés dans `src/mocks`. Les services de `src/services` passent par la couche `src/repositories`, qui peut lire les mocks ou MongoDB selon `DATA_SOURCE`. Voir [docs/mongodb-setup.md](docs/mongodb-setup.md) pour la configuration Atlas (cluster `cluster0`, bases `gui-website-dev` / `gui-website-recette` / `gui-website-prod`).

Toutes les créations, modifications, suppressions et soumissions sont simulées. Elles retournent une réponse utilisateur mais ne modifient pas les données seed : une relecture ou un rechargement affiche donc les données initiales. En conséquence, les modifications de configuration du formulaire ne sont pas reflétées dans le formulaire public après rechargement, conformément au périmètre de démonstration retenu.

## Flux applicatifs

### Authentification

1. `loginAction()` vérifie l’identifiant et le mot de passe à l’aide de `authService`.
2. L’identifiant utilisateur est placé dans le cookie HTTP-only `association_poc_session`.
3. `getCurrentSession()` relit cette session uniquement côté serveur.
4. Les Server Actions protégées vérifient à nouveau la session et le rôle avant chaque mutation.

Cette double vérification — proxy de navigation et contrôle dans l’action serveur — doit être conservée lors de toute évolution de l’administration.

### Autorisations

| Rôle | Accès |
| --- | --- |
| `ADMIN` | Tous les espaces, y compris la gestion des utilisateurs. |
| `EDITOR` | Articles, pages et formulaire de contact. |
| `BLOCKED` | Aucune opération d’administration. |

## Sécurité de session du POC

La session de POC est stockée dans un cookie HTTP-only. `src/proxy.ts` redirige les visiteurs non connectés hors de l’administration. Les Server Actions vérifient également la session et le rôle avant toute mutation. Cette implémentation est réservée au POC et doit être remplacée par une authentification sécurisée en production.

## Limites et évolutions attendues

- Les identifiants de démonstration et le contenu du cookie ne sont pas adaptés à un environnement de production.
- Aucune donnée n’est persistée : brancher une API ou une base de données derrière les services existants.
- Ajouter une authentification sécurisée, une gestion robuste des sessions et le stockage des secrets avant tout déploiement public.
- Aucun test automatisé n’est défini à ce stade ; les contrôles disponibles sont le lint et le build.

## Documentation pour les contributeurs et agents

[AGENTS.md](AGENTS.md) décrit les conventions opérationnelles du dépôt. Pour comprendre les dépendances ou trouver l’implémentation d’un flux, consulter d’abord le graphe [graphify-out/graph.json](graphify-out/graph.json) selon les consignes de [.github/copilot-instructions.md](.github/copilot-instructions.md) : cela évite des lectures exhaustives inutiles des sources.
