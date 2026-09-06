# Revue technique et refactorisation

Document de synthèse de la revue technique réalisée sur le POC gui-website. Les principes directeurs appliqués : **KISS**, **SRP**, **DRY**.

## Résumé

Le projet présentait une architecture globalement saine (UI → actions → services → repositories → mocks), mais avec une **double couche de repositories** : une couche active (`mock/*.mock.ts` + factory) et une couche legacy morte (~620 lignes). Cette revue a supprimé le code mort, unifié l’accès aux données via `getRepositories()`, réduit les duplications UI admin/public, et clarifié les responsabilités sans introduire de nouvelle abstraction.

---

## Problèmes identifiés

### KISS — complexité inutile

| Problème | Impact | Décision |
| --- | --- | --- |
| Double couche repositories (legacy + active) | Confusion, risque de réutilisation par erreur | Suppression de la couche legacy |
| `mock-store` central orphelin | Abstraction prématurée non utilisée | Suppression |
| `services/auth/password.ts` (hash sync) en parallèle de `password-hashing` | Deux mécanismes pour le même besoin | Suppression du module sync |
| `analytics/utils.ts` dupliquait `analytics/stats.ts` | Duplication de logique | Suppression de `utils.ts` |

### SRP — responsabilités

| Problème | Impact | Décision |
| --- | --- | --- |
| `proxy.ts` lisait `@/mocks/data` directement | Contournement de la couche auth | Délégation à `serviceAuth.getSessionFromToken` |
| Auth/users/password importaient `repositoryUser` hors factory | Deux portes d’entrée données | Passage par `getRepositories().users` |
| Formulaires admin dupliqués (create/edit) | Pages difficiles à maintenir | Extraction de composants dédiés |
| Whitelist `areas` dupliquée dans l’action admin | Risque d’incohérence | Constante `MUTATION_AREAS` dans les types |

### DRY — duplication

| Problème | Impact | Décision |
| --- | --- | --- |
| Champs article/tag/contact répétés sur 6 pages | Maintenance coûteuse | `ArticleFormFields`, `TagFormFields`, `ContactFieldInputs` |
| Classes CSS textarea/select répétées | Style incohérent | Composants `Textarea` et `Select` |
| Navigation publique header/mobile dupliquée | Deux implémentations à synchroniser | `PublicNavLinks` |
| `serviceRequiredError` / `serviceMaxLengthError` exportés mais inutilisés | Code mort | Utilisation dans les validateurs services |

---

## Refactorisations réalisées

### Phase 1 — Suppression code mort

- Suppression des dossiers legacy : `repositories/{content,tags,auth,features,contact,analytics}`, `mock-store`, `users/mock.ts`, `users/users.ts`
- Suppression de `services/auth/password.ts`, `analytics/utils.ts`
- Retrait de `jest-environment-jsdom` (tests en environnement `node`)

### Phase 2 — Unification accès données

- Déplacement de `users.mock.ts` vers `repositories/mock/users.mock.ts`
- Services auth, users, password : `getRepositories().users`
- `proxy.ts` async, validation via `serviceAuth.getSessionFromToken`
- Ajout de `MUTATION_AREAS` dans `src/types/auth.ts`

### Phase 3 — DRY composants

- Ajout de `components/ui/textarea.tsx` et `components/ui/select.tsx`
- Extraction : `ArticleFormFields`, `TagFormFields`, `ContactFieldInputs`, `PublicNavLinks`
- Simplification des pages admin articles, tags, formulaire contact

### Phase 4 — Validation

- Utilisation de `serviceRequiredError` / `serviceMaxLengthError` dans `serviceContent` et `serviceTag`
- Suppression de `serviceFutureAbuseControls` (export jamais importé)

### Phase 5 — Tests

- Test factory : users exposés via `getRepositories()`
- Test auth : session valide/bloquée via token
- Tests validation : helpers required/max-length
- Mise à jour `proxy.spec.ts` (proxy async)

---

## Architecture cible

```
UI (pages, components)
  ↓
Server Actions
  ↓
Services (logique métier, validation)
  ↓
getRepositories() (factory)
  ↓
mock/*.mock.ts  |  mongodb stubs (futur)
```

Le proxy admin suit le même chemin auth : `proxy → serviceAuth → getRepositories().users`.

---

## Backlog (non traité volontairement)

| Item | Raison du report |
| --- | --- |
| Implémentation MongoDB des repositories | Hors périmètre POC ; stubs déjà en place |
| Refonte de `actionSubmitAdminMutation` | Parsing FormData acceptable pour un POC |
| Fusion `analytics/` / `services/analytics/` | Pont intentionnel documenté dans AGENTS.md |
| Déplacer `shadcn` en devDependency | Faible valeur, risque CI |
| Rate limiting / anti-spam production | Prévu avant mise en production |
| Persistance réelle des mutations mock | Nécessite branchement MongoDB |

---

## Critères d’acceptation

### KISS

- [x] Abstractions inutiles identifiées et supprimées (legacy repos, mock-store, hash sync)
- [x] Aucune architecture complexe ajoutée
- [x] Solutions adaptées aux besoins actuels du POC

### SRP

- [x] Responsabilités clarifiées (proxy → serviceAuth, données → factory)
- [x] Composants formulaires extraits sans découpage excessif
- [x] Pas de fragmentation artificielle

### DRY

- [x] Duplications principales identifiées et mutualisées (formulaires, nav, validation)
- [x] Pas d’abstraction prématurée pour quelques lignes

### Architecture

- [x] Organisation revue et simplifiée
- [x] UI / logique / accès données cohérents
- [x] Mocks remplaçables via factory (MongoDB stubs prêts)
- [x] Types cohérents (`IUserRepository` unique dans `types/user.ts`)

### Qualité

- [x] Dépendances inutiles identifiées (`jest-environment-jsdom` retiré)
- [x] Code mort supprimé
- [x] Refactorisations proportionnées au projet
- [x] Comportement fonctionnel inchangé
- [x] Tests existants + nouveaux tests passent (112 tests)

---

## Validation

```bash
npm run lint
npm test
npm run build
```

Tous les checks passent après refactorisation.
