# Documentation Technique -

## Architecture Technique

### Stack Technologique

**Backend :**
- **Laravel 12** : Framework PHP moderne avec Eloquent ORM
- **Laravel Sanctum** : Authentification par token API
- **MySQL** : Base de données relationnelle
- **PHP 8.4** : Version moderne du langage

**Frontend :**
- **Next.js 15** : Framework React avec App Router
- **React 19** : Bibliothèque UI avec hooks modernes
- **NextAuth.js 5** : Authentification côté client
- **Sass** : Préprocesseur CSS pour le styling

## Architecture Backend (Laravel)

### Modèles de Données

#### 1. **User** (`app/Models/User.php`)
Le modèle utilisateur standard pour les clients finaux :
- **Attributs** : `name`, `email`, `password`, `role_id`
- **Relations** : `belongsTo(Role::class)`
- **Fonctionnalités** : Authentification, vérification des permissions
- **Méthode clé** : `hasPermission($permissionCode)` - Vérifie si l'utilisateur a une permission spécifique

#### 2. **Admin** (`app/Models/Admin.php`)
Modèle séparé pour les administrateurs :
- **Attributs** : `name`, `email`, `password`, `role_id`
- **Relations** : `belongsTo(Role::class)`
- **Authentification** : Utilise Sanctum avec tokens dédiés

#### 3. **Role** (`app/Models/Role.php`)
Gestion des rôles utilisateurs :
- **Attributs** : `name`, `code`, `all_permissions`
- **Relations** : 
  - `belongsToMany(Permission::class)` via table pivot `role_permission`
  - `hasMany(Admin::class)`
- **Logique** : Le flag `all_permissions` accorde tous les droits

#### 4. **Permission** (`app/Models/Permission.php`)
Système de permissions granulaire :
- **Attributs** : `name`, `code`
- **Codes utilisés** :
  - `products.create`, `products.update`, `products.delete`, `products.price.update`
  - `users.read`, `users.create`, `users.update`, `users.delete`
  - `admins.read`, `admins.create`, `admins.update`, `admins.delete`

#### 5. **Product** (`app/Models/Product.php`)
Modèle central pour les produits :
- **Attributs** : `name`, `description`, `price`, `image`, `stock`, `is_active`, `category`, `sku`
- **Casts** : `price` (decimal:2), `is_active` (boolean), `stock` (integer)
- **Validation** : SKU unique, prix positif, stock non négatif

### Contrôleurs API

#### 1. **AuthController** (`app/Http/Controllers/AuthController.php`)
Gestion de l'authentification utilisateur :
- `register()` : Inscription avec validation et hachage du mot de passe
- `login()` : Connexion avec génération de token Sanctum
- `logout()` : Suppression du token actuel
- **Sécurité** : Suppression des anciens tokens à chaque connexion

#### 2. **AdminAuthController** (`app/Http/Controllers/AdminAuthController.php`)
Authentification administrateur :
- `register()` : Inscription admin avec attribution de rôle
- `login()` : Connexion avec chargement des rôles et permissions
- `me()` : Récupération des informations admin avec permissions
- `getRoles()` : Liste des rôles disponibles pour l'inscription

#### 3. **ProductController** (`app/Http/Controllers/ProductController.php`)
Gestion complète des produits :
- `publicIndex()` : Catalogue public avec filtres et pagination
- `index()` : Liste admin avec filtres étendus
- `store()` : Création avec validation stricte
- `update()` : Modification avec vérification des permissions prix
- `destroy()` : Suppression sécurisée

### Système de Middleware

#### 1. **EnsureUserRole** (`app/Http/Middleware/EnsureUserRole.php`)
Vérifie que l'utilisateur est bien de type `User` standard.

#### 2. **EnsureAdminRole** (`app/Http/Middleware/EnsureAdminRole.php`)
Contrôle l'accès admin :
- Vérifie l'existence d'un rôle
- Autorise uniquement `super_admin` et `catalog`

#### 3. **CheckProductPermission** (`app/Http/Middleware/CheckProductPermission.php`)
Middleware granulaire pour les permissions :
- Vérifie les permissions spécifiques (ex: `products.price.update`)
- Gère le flag `all_permissions` pour les super-admins
- Retourne des erreurs détaillées en cas d'accès refusé

### Routes API (`routes/api.php`)

#### Routes Publiques
- `GET /api/products` : Catalogue public avec filtres

#### Routes Authentifiées Utilisateur
- `POST /api/auth/register` : Inscription
- `POST /api/auth/login` : Connexion
- `POST /api/auth/logout` : Déconnexion
- `GET /api/auth/me` : Profil utilisateur

#### Routes Administrateur
- `POST /api/admin/auth/register` : Inscription admin
- `POST /api/admin/auth/login` : Connexion admin
- `GET /api/admin/auth/roles` : Liste des rôles
- `GET /api/admin/products` : Gestion des produits
- `POST /api/admin/products` : Création (permission `products.create`)
- `PUT /api/admin/products/{id}` : Modification (permission `products.update`)
- `DELETE /api/admin/products/{id}` : Suppression (permission `products.delete`)

## Architecture Frontend (Next.js)

### Organisation des Composants

#### 1. **Composants UI** (`src/components/ui/`)
Composants réutilisables et génériques :

**Button.jsx** - Bouton polyvalent avec système de variantes :
- **Variantes** : `primary`, `secondary`, `success`, `danger`, `warning`, `outline`, `ghost`
- **Tailles** : `small`, `medium`, `large`
- **États** : `loading` (avec spinner), `disabled`
- **Accessibilité** : Support des attributs ARIA et navigation clavier
- **Personnalisation** : Classes CSS additionnelles et props étendues

**Modal.jsx** - Modal générique avec gestion complète :
- **Tailles** : `small`, `medium`, `large`, `xlarge` (responsive)
- **Fonctionnalités** : Fermeture par Escape/backdrop, blocage du scroll
- **Structure** : Header optionnel, contenu personnalisable
- **Accessibilité** : Focus management et événements clavier

**Notification.jsx** - Système de notifications toast :
- **Types** : `success`, `error`, `warning`, `info` avec icônes spécifiques
- **Fonctionnalités** : Couleurs adaptatives, fermeture manuelle
- **Animation** : Transitions fluides d'apparition/disparition
- **Position** : Fixe en haut à droite

**NotificationWrapper.jsx** - Wrapper de connexion au contexte :
- Intégration avec `NotificationContext`
- Gestion automatique de l'affichage/masquage
- Propagation des actions utilisateur

**Pagination.jsx** - Pagination avancée et intelligente :
- **Navigation** : Affichage adaptatif (1, 2, 3, ..., dernière)
- **Informations** : "Affichage de X à Y sur Z résultats"
- **Contrôles** : Sélecteur de taille (6, 12, 24, 48 éléments)
- **Accessibilité** : Labels ARIA et navigation clavier
- **États** : Boutons précédent/suivant contextuels

**ConfirmDialog.jsx** - Dialogue de confirmation réutilisable :
- **Props** : Titre, message, textes des boutons personnalisables
- **Variantes** : Couleur du bouton de confirmation
- **États** : Support du loading sur confirmation
- **Fermeture** : Bouton ou clic backdrop

**CartAnimation.jsx** - Animation d'ajout au panier :
- **Trigger** : Activation par props `trigger`
- **Feedback** : Quantité et nom du produit ajouté
- **Animation** : Timer automatique avec disparition
- **Design** : Icône de validation et texte informatif

**CartHeader.jsx** - En-tête de panier avec gestion SSR :
- **Hydratation** : Gestion des différences serveur/client
- **Affichage** : Conditionnel selon contenu du panier
- **Intégration** : Connecté au `CartContext` et `CartModal`
- **Badge** : Compteur d'articles avec style distinctif

#### 2. **Composants Dashboard** (`src/components/dashboard/`)
Interface d'administration :

**DashboardHeader.jsx** - En-tête avec informations utilisateur :
- **Affichage** : Nom et rôle de l'administrateur connecté
- **Actions** : Bouton de déconnexion avec confirmation
- **Intégration** : Connecté au `AuthContext` et `NotificationContext`
- **Style** : Design professionnel avec informations contextuelles

**DashboardNavigation.jsx** - Navigation par onglets intelligente :
- **Onglets** : Gestion des produits, Paramètres (selon permissions)
- **Contrôle des permissions** : Masquage automatique des onglets non autorisés
- **Navigation** : Changement d'onglet avec état actif
- **Responsive** : Adaptation mobile avec icônes et labels

**ProductsTab.jsx** - Gestion complète des produits :
- **CRUD complet** : Création, lecture, modification, suppression
- **Modal de création** : Formulaire avec validation en temps réel
- **Modals d'édition** : Formulaire pré-rempli avec permissions prix
- **Dialogue de suppression** : Confirmation avec protection contre erreurs
- **Gestion des permissions** : Contrôle granulaire des actions selon le rôle
- **Feedback utilisateur** : Notifications de succès/erreur

**SettingsTab.jsx** - Paramètres et gestion :
- **État actuel** : Placeholder pour fonctionnalités futures
- **Structure** : Prêt pour l'intégration de gestion des utilisateurs
- **Design** : Cohérent avec le reste de l'interface admin

#### 3. **Composants Produits** (`src/components/products/`)
Gestion du catalogue :

**ProductList.jsx** - Liste admin avec gestion complète :
- **Affichage** : Grille de cartes produits avec informations détaillées
- **Actions** : Boutons modifier/supprimer selon permissions
- **Modals intégrés** : Édition inline avec formulaire pré-rempli
- **Dialogue de suppression** : Confirmation avec nom du produit
- **Gestion des permissions** : Contrôle des actions selon le rôle
- **États** : Loading, erreur, liste vide avec messages appropriés
- **Images** : Placeholder SVG médical en cas d'erreur de chargement

**PublicProductList.jsx** - Affichage public optimisé :
- **Grille responsive** : Adaptation mobile/desktop
- **Pagination intégrée** : Utilise le composant `Pagination`
- **États** : Loading avec spinner, erreur avec retry, liste vide
- **Actions** : Bouton de rafraîchissement en cas d'erreur
- **Performance** : Rendu conditionnel optimisé

**ProductFilters.jsx** - Filtres avancés et recherche :
- **Recherche textuelle** : Nom, description, SKU
- **Filtres catégorie** : Dropdown avec options dynamiques
- **Tri** : Par nom, prix, date de création, stock
- **Ordre** : Croissant/décroissant
- **Réactivité** : Déclenchement automatique des requêtes
- **Reset** : Bouton pour effacer tous les filtres

**PublicProductCard.jsx** - Carte produit e-commerce :
- **Design** : Interface moderne avec informations complètes
- **Images** : Gestion des erreurs avec placeholder médical SVG
- **Informations** : Nom, description, catégorie, prix, stock
- **Indicateurs de stock** : Couleurs selon disponibilité (vert/orange/rouge)
- **Contrôles quantité** : Sélecteur avec validation stock
- **Ajout au panier** : Animation et feedback visuel
- **État panier** : Affichage si déjà dans le panier
- **Accessibilité** : Labels ARIA et navigation clavier

#### 4. **Composants Panier** (`src/components/cart/`)
Système e-commerce :

**CartModal.jsx** - Modal du panier avec expérience utilisateur optimisée :
- **Structure** : Header avec titre et compteur d'articles
- **Contenu** : Liste des articles ou état vide avec message d'encouragement
- **Fermeture** : Escape, clic backdrop, ou bouton dédié
- **Animations** : Transitions fluides d'ouverture/fermeture
- **Actions** : Bouton "Continuer mes achats" et vider le panier
- **Responsive** : Adaptation mobile avec scroll optimisé

**CartItem.jsx** - Élément individuel du panier :
- **Affichage** : Image, nom, catégorie, prix unitaire
- **Contrôles quantité** : Boutons +/- et input numérique
- **Validation** : Respect du stock disponible
- **Avertissements** : Alerte si stock limité
- **Prix total** : Calcul automatique par article
- **Suppression** : Bouton dédié avec icône poubelle
- **Formatage** : Prix en euros avec formatage français

**CartSummary.jsx** - Résumé des achats avec calculs automatiques :
- **Sous-total** : Somme des articles avec compteur
- **Frais de livraison** : Gratuit au-dessus de 50€, sinon 4.99€
- **TVA** : Calcul automatique à 20% (réglementation française)
- **Total final** : Somme complète avec formatage
- **Actions** : Bouton "Commander maintenant" et "Continuer mes achats"
- **Informations sécurité** : Badges de paiement sécurisé et livraison rapide

**CartButton.jsx** - Bouton d'accès au panier flottant :
- **Position** : Fixe en bas à droite (mobile-first)
- **Badge** : Compteur d'articles avec animation
- **Affichage conditionnel** : Visible uniquement si panier non vide
- **Intégration** : Connecté au `CartModal` et `CartAnimation`
- **Accessibilité** : Label ARIA avec nombre d'articles

#### 5. **Composants Formulaires** (`src/components/forms/`)

**ProductForm.jsx** - Formulaire de création/édition de produits :
- **Champs** : Nom, description, prix, stock, catégorie, image, SKU, statut actif
- **Validation** : Champs requis, prix positif, stock non négatif, SKU unique
- **Permissions** : Contrôle d'édition du prix selon les droits utilisateur
- **États** : Mode création/édition avec pré-remplissage
- **Feedback** : Messages d'erreur en temps réel
- **Accessibilité** : Labels associés et navigation clavier

### Gestion d'État (Contextes)

#### 1. **AuthContext** (`src/contexts/AuthContext.js`)
Gestion de l'authentification :
- État de connexion administrateur
- Informations utilisateur et permissions
- Fonctions de connexion/déconnexion
- Vérification des permissions (`hasPermission()`)

#### 2. **ProductContext** (`src/contexts/ProductContext.js`)
Gestion des produits côté admin :
- État des produits avec loading/error
- CRUD operations (create, read, update, delete)
- Intégration avec l'API backend
- Gestion optimiste des mises à jour

#### 3. **PublicProductContext** (`src/contexts/PublicProductContext.js`)
Catalogue public :
- Chargement des produits avec filtres
- Pagination et recherche
- État de chargement et erreurs
- Cache des résultats

#### 4. **CartContext** (`src/contexts/CartContext.js`)
Système de panier optimisé :
- **Persistance** : Sauvegarde dans localStorage
- **Performance** : Utilisation de `useMemo` et `useCallback`
- **Fonctionnalités** :
  - `addToCart()` : Ajout avec gestion des quantités
  - `updateQuantity()` : Modification des quantités
  - `removeFromCart()` : Suppression d'articles
  - `clearCart()` : Vidage complet
  - Calculs optimisés des totaux

#### 5. **NotificationContext** (`src/contexts/NotificationContext.js`)
Système de notifications :
- Notifications toast avec types (success, error, warning)
- Auto-dismiss configurable
- Gestion des IDs uniques
- Fonction de suppression manuelle

### Pages et Routing

#### Pages Publiques
- **`/`** : Page d'accueil avec catalogue public
- **`/admin`** : Interface d'administration

#### API Routes (Next.js)
- **`/api/products`** : Proxy vers l'API Laravel
- **`/api/admin/products`** : Gestion admin des produits
- **`/api/auth/*`** : Authentification utilisateur
- **`/api/admin/auth/*`** : Authentification admin

### Hooks Personnalisés

#### 1. **useForm** (`src/hooks/useForm.js`)
Hook générique pour la gestion des formulaires :
- **Gestion d'état** : Valeurs, erreurs, état de soumission
- **Validation** : En temps réel avec messages d'erreur
- **Actions** : Reset, setError, setFormError
- **Réactivité** : Re-render automatique sur changement

#### 2. **useApi** (`src/hooks/useApi.js`)
Hook pour les appels API standardisés :
- **États** : Loading, error, success avec transitions
- **Retry** : Logique de retry automatique configurable
- **Cache** : Mise en cache des réponses pour performance
- **Abort** : Annulation des requêtes en cours

#### 3. **useModal** (`src/hooks/useModal.js`)
Hook pour la gestion des modals :
- **État** : isOpen, data (données du modal)
- **Actions** : open(data), close(), toggle()
- **Persistance** : Conservation des données lors de l'ouverture

#### 4. **useCartAnimation** (`src/hooks/useCartAnimation.js`)
Hook pour les animations d'ajout au panier :
- **Trigger** : Activation des animations
- **Données** : Quantité et nom du produit
- **État** : Gestion de l'animation en cours

#### 5. **useHydration** (`src/hooks/useHydration.js`)
Hook pour gérer l'hydratation SSR :
- **useHydration** : Détection de l'hydratation côté client
- **useLocalStorage** : Accès sécurisé à localStorage
- **Prévention** : Évite les erreurs d'hydratation SSR/client

### Architecture des Styles

#### **Variables SCSS** (`src/styles/_variables.scss`)
Système de design cohérent :
- **Couleurs** : Palette principale, secondaire, états (success, error, warning)
- **Typographie** : Tailles, poids, familles de polices
- **Espacements** : Marges, paddings, gaps standardisés
- **Breakpoints** : Responsive design avec media queries
- **Animations** : Durées, courbes d'accélération
- **Ombres** : Système d'élévation cohérent

#### **Styles par Composant**
Organisation modulaire des styles :
- **cart.scss** : Styles du système de panier (990 lignes)
- **pagination.scss** : Styles de pagination avancés (359 lignes)
- **Home.scss** : Styles de la page d'accueil
- **Variables** : Import centralisé des variables SCSS

## Fonctionnalités Principales

### 1. **Système d'Authentification**
- **Double authentification** : Utilisateurs et Administrateurs
- **Tokens sécurisés** : Laravel Sanctum avec refresh automatique
- **Sessions persistantes** : Sauvegarde côté client
- **Protection des routes** : Middleware et redirections

### 2. **Gestion des Rôles et Permissions**
- **Rôles prédéfinis** :
  - `super_admin` : Accès complet (all_permissions = true)
  - `catalog` : Gestion des produits uniquement
- **Permissions granulaires** : Contrôle fin des actions
- **Vérification côté client** : Interface adaptée selon les droits

### 3. **Catalogue de Produits**
- **CRUD complet** : Création, lecture, modification, suppression
- **Validation stricte** : SKU unique, prix positifs, stock cohérent
- **Filtres avancés** : Catégorie, prix, recherche textuelle
- **Pagination optimisée** : Performance et UX

### 4. **Système de Panier**
- **Persistance locale** : Sauvegarde dans localStorage
- **Gestion des quantités** : Ajout, modification, suppression
- **Calculs en temps réel** : Totaux automatiques
- **Interface intuitive** : Modal avec animations

### 5. **Interface Responsive**
- **Design moderne** : SCSS avec variables et mixins
- **Composants réutilisables** : Architecture modulaire
- **Animations fluides** : Transitions et micro-interactions
- **Accessibilité** : Support clavier et screen readers

## Sécurité

### Backend
- **Validation stricte** : Tous les inputs sont validés
- **Sanitisation** : Protection contre les injections
- **Tokens sécurisés** : Laravel Sanctum avec expiration
- **Permissions granulaires** : Contrôle d'accès fin

### Frontend
- **Protection des routes** : Middleware Next.js
- **Validation côté client** : Feedback immédiat
- **Gestion des erreurs** : Messages utilisateur appropriés
- **Persistance sécurisée** : Données sensibles protégées

## Performance

### Optimisations Backend
- **Requêtes optimisées** : Eager loading des relations
- **Pagination** : Limitation des résultats
- **Cache** : Mise en cache des données fréquentes
- **Indexation** : Index sur les champs de recherche

### Optimisations Frontend
- **Memoization** : useMemo et useCallback pour les calculs
- **Lazy loading** : Chargement à la demande
- **Code splitting** : Séparation des bundles
- **Optimistic updates** : Mise à jour immédiate de l'UI
- **Hydratation SSR** : Gestion des différences serveur/client

## Base de Données

### Structure des Tables
- **users** : Utilisateurs avec rôles
- **products** : Catalogue des produits
- **roles** : Rôles utilisateurs
- **permissions** : Permissions granulaires
- **role_permission** : Table pivot pour les relations
- **personal_access_tokens** : Tokens Sanctum

### Seeders
- **RolePermissionSeeder** : Création des rôles et permissions
- **AdminSeeder** : Comptes administrateurs par défaut
- **ProductSeeder** : Données de test pour les produits