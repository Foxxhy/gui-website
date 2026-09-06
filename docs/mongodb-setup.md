# Préparation MongoDB Atlas

Ce guide décrit la configuration manuelle du cluster **cluster0** et l’intégration avec l’application.

## Prérequis

- Compte MongoDB Atlas existant
- Cluster `cluster0` disponible (ou à créer)

## Bases de données

Créer trois bases sur le même cluster, une par environnement :

| Environnement | Variable `MONGODB_DB_NAME` |
| --- | --- |
| Développement | `gui-website-dev` |
| Recette | `gui-website-recette` |
| Production | `gui-website-prod` |

MongoDB crée une base à la première utilisation ; il n’est pas nécessaire de la pré-créer dans l’interface si vous préférez laisser l’application l’initialiser.

## Utilisateur applicatif

1. Dans Atlas : **Database Access** → **Add New Database User**
2. Nom suggéré : `gui_website_app`
3. Mot de passe généré (à conserver hors Git)
4. Rôle : **Read and write to specific database** sur la base de l’environnement concerné (ex. `gui-website-dev`)
5. Ne pas attribuer de rôle `atlasAdmin`

Répéter ou adapter les permissions si un même utilisateur doit accéder à plusieurs bases.

## Accès réseau

Dans **Network Access** :

- Développement : autoriser votre IP locale
- Agents cloud / CI : ajouter temporairement `0.0.0.0/0` si nécessaire, en prévoyant de restreindre l’accès avant la production

## Variables d’environnement locales

Copier [`.env.example`](../.env.example) vers `.env` (non versionné) :

```env
MONGODB_URI=mongodb+srv://gui_website_app:<password>@cluster0.<id>.mongodb.net/?retryWrites=true&w=majority
MONGODB_DB_NAME=gui-website-dev
DATA_SOURCE=mock
```

- `MONGODB_URI` : chaîne de connexion complète (credentials inclus)
- `MONGODB_DB_NAME` : base cible (`gui-website-dev`, `gui-website-recette` ou `gui-website-prod`)
- `DATA_SOURCE` : `mock` (défaut, aucune connexion requise) ou `mongodb` (active les repositories MongoDB au fur et à mesure de leur implémentation)

## Vérifier la connexion

```bash
npm run db:ping
```

En cas de succès : `Connexion MongoDB OK (base : gui-website-dev).`

Les erreurs affichées ne contiennent pas les credentials.

## Schéma des collections

Voir [src/repositories/mongodb/schema.md](../src/repositories/mongodb/schema.md).

## Architecture applicative

```
UI → Actions / Services → Repositories → Mocks ou MongoDB
```

Par défaut (`DATA_SOURCE=mock`), les repositories lisent les données de `src/mocks`. Le remplacement par MongoDB se fera progressivement dans des US dédiées, sans modifier l’UI.
