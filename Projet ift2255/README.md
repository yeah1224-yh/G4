# Prototype Interactif - Plateforme de Choix de Cours

## Description

Ce prototype démontre les fonctionnalités principales de la plateforme de choix de cours pour les étudiants de l'UdeM. Il simule les cas d'utilisation les plus importants avec des données fictives.

## Fonctionnalités Démonstrées

### ✅ Cas d'Utilisation Implémentés

1. **CU1 - Recherche de cours**
   - Recherche par code, titre ou mots-clés
   - Filtrage par programme
   - Affichage des résultats en cartes

2. **CU2 - Consultation des détails d'un cours**
   - Informations complètes du cours
   - Statistiques académiques
   - Avis étudiants agrégés
   - Modal détaillée

3. **CU3 - Comparaison de cours**
   - Ajout de cours à la comparaison (max 3)
   - Tableau comparatif dynamique
   - Critères multiples (difficulté, charge, prérequis, etc.)

4. **CU4 - Consultation des avis étudiants**
   - Affichage des avis avec notes
   - Évaluation de la difficulté et charge de travail
   - Seuil minimal respecté (n≥5 simulé)

5. **CU5 - Gestion du profil**
   - Préférences théorie/pratique
   - Centres d'intérêt
   - Sauvegarde des préférences

## Données Simulées

Le prototype utilise des données fictives représentatives :

- **4 cours** de différents programmes (IFT, GLO)
- **Avis étudiants** avec notes et commentaires
- **Statistiques académiques** (moyennes, inscrits, échecs)
- **Prérequis et co-requis** réalistes

## Technologies Utilisées

- **HTML5** : Structure sémantique
- **CSS3** : Styles modernes avec Bootstrap 5
- **JavaScript ES6** : Logique interactive
- **Bootstrap 5** : Framework CSS responsive
- **Font Awesome** : Icônes

## Installation et Utilisation

### Prérequis
- Navigateur web moderne (Chrome, Firefox, Safari, Edge)
- Serveur web local (optionnel)

### Lancement
1. **Option 1 - Fichier local** : Ouvrir `index.html` directement dans le navigateur
2. **Option 2 - Serveur local** :
   ```bash
   # Avec Python
   python -m http.server 8000
   
   # Avec Node.js
   npx serve .
   
   # Puis ouvrir http://localhost:8000
   ```

### Navigation
1. **Recherche** : Saisir des critères dans la barre de recherche
2. **Détails** : Cliquer sur une carte de cours
3. **Comparaison** : Utiliser le bouton "Comparer" ou "Ajouter à la comparaison"
4. **Profil** : Cliquer sur "Profil" dans la navigation

## Démonstration des Scénarios

### Scénario 1 : Recherche et Consultation
1. Rechercher "développement" ou "IFT"
2. Cliquer sur "IFT2255 - Développement de logiciels"
3. Consulter les détails, statistiques et avis
4. Fermer la modal

### Scénario 2 : Comparaison de Cours
1. Rechercher des cours d'informatique
2. Ajouter "IFT2255" à la comparaison
3. Ajouter "IFT2004" à la comparaison
4. Ajouter "IFT3000" à la comparaison
5. Consulter le tableau comparatif
6. Vider la comparaison

### Scénario 3 : Gestion du Profil
1. Cliquer sur "Profil" dans la navigation
2. Modifier les préférences (théorie/pratique)
3. Sélectionner des centres d'intérêt
4. Sauvegarder le profil

## Limitations du Prototype

- **Données statiques** : Pas de base de données réelle
- **Authentification** : Simulée, pas de vraie sécurité
- **API externe** : Pas d'intégration avec Planifium
- **Collecte d'avis** : Pas de bot Discord réel
- **Persistance** : Données perdues au rechargement

## Améliorations Possibles

- **Base de données** : Intégration avec PostgreSQL
- **API REST** : Backend avec FastAPI ou Express.js
- **Authentification** : Système de connexion réel
- **Recherche avancée** : Filtres multiples et tri
- **Export** : Génération de PDF pour les comparaisons
- **Mobile** : Application mobile native

## Conformité aux Exigences

### ✅ Besoins Fonctionnels Couverts
- Recherche de cours ✓
- Consultation des détails ✓
- Comparaison de cours ✓
- Avis étudiants ✓
- Profil et personnalisation ✓

### ✅ Besoins Non Fonctionnels
- **Accessibilité** : Interface responsive et intuitive
- **Performance** : Temps de réponse instantané (données locales)
- **Utilisabilité** : Navigation claire et logique
- **Compatibilité** : Fonctionne sur tous les navigateurs modernes

## Code Source

Le prototype est entièrement open source et peut être utilisé comme base pour le développement de la plateforme complète.

### Structure des Fichiers
```
prototype/
├── index.html          # Page principale
├── script.js           # Logique JavaScript
└── README.md           # Documentation
```

### Points d'Extension
- **Modularisation** : Séparer les composants en modules
- **Tests** : Ajouter des tests unitaires
- **Documentation** : JSDoc pour les fonctions
- **Optimisation** : Minification et compression
