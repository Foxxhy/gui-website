# Décision — Stratégie d’authentification

Document de référence avant branchement MongoDB et déploiement.

## Modèle de données

- **`users`** : profil (`name`, `email`, `pseudonym`, `role`, timestamps)
- **`accounts`** : credentials séparés (`login`, `passwordHash`, `userId`)
- Un compte `BLOCKED` peut exister sans `account` (pas de connexion possible)

## Mots de passe

- Hash via `scrypt` (Node.js natif, sel aléatoire par mot de passe)
- Format stocké : `{salt}:{hash}` en hexadécimal
- Comparaison en temps constant (`timingSafeEqual`)

## Sessions

- Cookie HTTP-only contenant un **jeton signé** (HMAC-SHA256), pas l’ID utilisateur brut
- Payload : `{ userId, exp }` encodé en base64url + signature
- Secret : variable `AUTH_SECRET` (obligatoire en production)
- Invalidation : relecture du profil à chaque requête ; comptes `BLOCKED` rejetés

## Protection des routes

1. **`proxy.ts`** : jeton valide (signature + expiration) + utilisateur existant et non bloqué (sync)
2. **Layout admin** : relecture session serveur
3. **Server Actions** : `serviceGetCurrentSession()` + `serviceAuth.canPerform()`

## Évolutions production (hors POC)

- Rate limiting login / contact / analytics
- Rotation de session à la connexion
- Store de sessions révoquées ou sessions serveur en base

## Statut

Décision validée — implémentation en cours dans la couche auth et repository mock.
