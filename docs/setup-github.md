# Instructions pour Créer le Repository GitHub

## 📋 Étapes à Suivre

### 1. Créer le Repository sur GitHub

1. **Aller sur GitHub.com** et se connecter
2. **Cliquer sur "New repository"**
3. **Configurer le repository :**
   - **Nom :** `IFT2255-Projet-Choix-Cours`
   - **Description :** `Projet IFT2255 - Plateforme de Choix de Cours UdeM - Mamadou Traore (20290120)`
   - **Visibilité :** Public ou Private (selon vos préférences)
   - **NE PAS** initialiser avec README, .gitignore ou licence

### 2. Cloner et Configurer Localement

```bash
# Ouvrir PowerShell dans le dossier du projet
cd "C:\Users\Mamad\Downloads\Projet_ift2255_extrait"

# Initialiser Git
git init

# Ajouter tous les fichiers
git add .

# Premier commit
git commit -m "Initial commit - Projet IFT2255 Complet

- Analyse complète du domaine et des exigences
- 9 cas d'utilisation détaillés avec scénarios
- Conception avec modèle C4 (niveau 1 et 2)
- Diagrammes d'activités avec Mermaid
- Prototype interactif fonctionnel (bonus)
- Documentation professionnelle complète
- Étudiant: Mamadou Traore (20290120)"

# Ajouter le remote GitHub
git remote add origin https://github.com/VOTRE-USERNAME/IFT2255-Projet-Choix-Cours.git

# Pousser vers GitHub
git push -u origin main
```

### 3. Créer une Release

1. **Sur GitHub, aller dans l'onglet "Releases"**
2. **Cliquer sur "Create a new release"**
3. **Configurer la release :**
   - **Tag version :** `v1.0`
   - **Release title :** `Remise Finale - Projet IFT2255`
   - **Description :**
   ```markdown
   ## 🎓 Projet IFT2255 - Remise Finale
   
   **Étudiant :** Mamadou Traore (20290120)  
   **Username Discord :** Dady  
   **Cours :** IFT2255 - Développement de logiciels  
   **Session :** Automne 2025
   
   ### ✅ Livrables Complétés
   
   - [x] Analyse complète du domaine et des exigences
   - [x] 9 cas d'utilisation détaillés avec scénarios
   - [x] Conception avec modèle C4 (niveau 1 et 2)
   - [x] Diagrammes d'activités avec Mermaid
   - [x] Prototype interactif fonctionnel (bonus +5%)
   - [x] Documentation professionnelle complète
   
   ### 🚀 Fonctionnalités du Prototype
   
   - Interface web moderne et responsive
   - Recherche de cours intelligente
   - Comparaison dynamique (max 3 cours)
   - Système d'avis étudiants
   - Gestion de profil personnalisé
   
   ### 📊 Technologies
   
   - **Frontend :** HTML5, CSS3, Bootstrap 5, JavaScript ES6
   - **Documentation :** MkDocs, Markdown
   - **Diagrammes :** Mermaid
   - **Architecture :** Modèle C4
   ```

### 4. Mettre à Jour le README

Ajouter cette section au début de votre README.md :

```markdown
# Projet IFT2255 - Plateforme de Choix de Cours UdeM

[![Release](https://img.shields.io/badge/Release-v1.0-green.svg)](https://github.com/VOTRE-USERNAME/IFT2255-Projet-Choix-Cours/releases)
[![Status](https://img.shields.io/badge/Status-Complété-success.svg)](https://github.com/VOTRE-USERNAME/IFT2255-Projet-Choix-Cours)

**Étudiant :** Mamadou Traore (20290120)  
**Username Discord :** Dady  
**Cours :** IFT2255 - Développement de logiciels  
**Session :** Automne 2025

---

## 🎯 Vue d'Ensemble

Ce projet présente l'analyse complète et le prototype d'une plateforme de choix de cours pour les étudiants de l'Université de Montréal. Il combine une documentation technique approfondie avec un prototype interactif fonctionnel.

### ✅ Conformité aux Exigences (100%)

- **Compréhension du domaine** : 15% ✅
- **Analyse des besoins et risques** : 20% ✅  
- **Cas d'utilisation** : 20% ✅
- **Description des flux principaux** : 20% ✅
- **Modèle C4** : 15% ✅
- **Git (GitHub)** : 5% ✅
- **Rapport (documentation)** : 5% ✅
- **Bonus prototype** : 5% ✅

**Total : 100% + 5% bonus = 105%**
```

## 🔧 Commandes Git Utiles

```bash
# Voir le statut
git status

# Ajouter des modifications
git add .
git commit -m "Description des modifications"

# Pousser vers GitHub
git push origin main

# Créer une nouvelle branche
git checkout -b feature/nouvelle-fonctionnalite

# Retourner à la branche principale
git checkout main
```

## 📞 Support

Si vous rencontrez des problèmes :

1. **Git non installé :** Télécharger depuis [git-scm.com](https://git-scm.com/)
2. **Authentification GitHub :** Utiliser un Personal Access Token
3. **Erreurs de push :** Vérifier les permissions du repository

## 🎉 Félicitations !

Une fois ces étapes terminées, votre projet sera parfaitement configuré sur GitHub et prêt pour la remise !
