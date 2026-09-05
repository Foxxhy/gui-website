# Fondations de sécurité du POC

## Flux applicatif

Les données suivent le flux suivant :

`Interface → Server Action → session → autorisation → DTO validé → service → mocks`

Les composants et les pages ne lisent pas directement les mocks. Les accès passent par `src/services/`. Les Server Actions relisent toujours la session côté serveur : masquer un bouton n'est jamais un contrôle d'accès.

## Validation

Les entrées provenant d'un formulaire sont non fiables. Les limites, formats, listes de valeurs autorisées et unicités sont vérifiés dans les services, notamment dans `src/services/validation.ts`, avant toute mutation. Les données envoyées aux services sont des DTO explicites ; les champs arbitraires d'un `FormData` ne doivent pas être propagés.

## Authentification et rôles

- `ADMIN` peut gérer tous les espaces, les utilisateurs et la configuration.
- `EDITOR` peut gérer les contenus éditoriaux et le formulaire de contact.
- `BLOCKED` ne peut pas accéder à l'administration.

Le proxy fournit un premier filtrage des routes `/administration`. Le layout relit la session et chaque action sensible vérifie à nouveau le rôle avec `authService`. Cette authentification mockée n'est pas une authentification de production.

## XSS et Markdown

Les contenus Markdown sont rendus par `MarkdownContent`, après passage dans `sanitizeMarkdown`. L'allowlist exclut les scripts, les gestionnaires d'événements, les formulaires, les iframes et les protocoles dangereux. Le HTML ne doit jamais être envoyé directement à `dangerouslySetInnerHTML`.

Les contenus futurs devront conserver cette frontière. Si l'allowlist évolue, elle devra être revue avec des tests XSS. Les URL dynamiques doivent accepter uniquement les protocoles nécessaires (`http`, `https`, `mailto`).

Une CSP avec nonce est ajoutée aux réponses du proxy d'administration. Sa configuration devra être vérifiée avec les scripts et styles du déploiement réel.

## Données sensibles

Les comptes du mock (`admin/admin`, `editor/editor`) sont fictifs et réservés aux démonstrations locales. Aucun mot de passe réel, token, secret ou clé API ne doit être ajouté aux mocks. Les secrets futurs doivent être fournis par des variables d'environnement serveur et ne doivent jamais utiliser `NEXT_PUBLIC_`.

## Protections différées

Le POC ne fournit pas encore de garantie de production pour :

- l'authentification réelle, le hachage et la révocation des sessions ;
- le rate limiting distribué, le CAPTCHA et l'anti-spam ;
- la persistance des journaux d'audit ;
- le stockage, l'analyse antivirus et la détection MIME réelle des uploads ;
- la base de données et les contrôles d'accès associés.

`validateUploadMetadata` prépare les contrôles de taille, MIME, extension et nom, mais aucun upload n'est accepté actuellement. `futureAbuseControls` documente les points d'intégration du rate limiting et de l'anti-spam.

Avant la production, ces contrôles devront être fournis par des services réels, testés et observés.
