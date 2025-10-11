# Plateforme de Choix de Cours - UdeM

## Vue d'ensemble

Cette plateforme web vise à aider les étudiants de l'Université de Montréal à faire des choix de cours éclairés en combinant des données officielles et des retours d'expérience étudiants.

## Problématique

Le choix de cours représente un défi important pour les étudiants du DIRO et de l'UdeM. Les difficultés incluent :

- **Complexité structurelle** : Programmes parfois difficiles à comprendre
- **Anticipation limitée** : Charge de travail, difficulté, rythme imprévisibles
- **Profil varié** : Besoins différents selon le type d'étudiant
- **Sources fragmentées** : Données officielles partielles, sources informelles dispersées

## Profils Étudiants Visés

- 🌍 **Étudiant international** : Besoin d'adaptation au système académique
- 💼 **Étudiant travailleur** : Doit éviter les combinaisons trop exigeantes
- 🎓 **Étudiant débutant** : Manque de repères sur les cours
- 🏆 **Étudiant finissant** : Conciliation diplomation/moyenne/intérêts

## Solution Proposée

Une plateforme web accessible via API REST qui combine données officielles et expérience étudiante.

## Fonctionnalités Principales

- 🔍 **Recherche intelligente** : Par code, titre, mots-clés avec filtres avancés
- 📊 **Tableaux de bord** : Visualisation des résultats académiques agrégés
- 💬 **Avis étudiants** : Retours d'expérience validés (seuil n≥5)
- ⚖️ **Comparaison** : Évaluation de charge de travail pour plusieurs cours
- 👤 **Personnalisation** : Recommandations selon profil étudiant
- 🔒 **Confidentialité** : Respect de la Loi 25 et protection des données

## Sources de Données

| Source | Type | Contenu |
|--------|------|---------|
| 🔌 API Planifium | Officiel | Catalogue, programmes, horaires, préalables |
| 📈 Résultats agrégés | CSV | Moyennes, inscrits, échecs par session |
| 💬 Bot Discord | JSON | Avis étudiants (difficulté, charge, commentaires) |

## Objectifs

### Améliorer la qualité des choix de cours
- Réduction des abandons de cours
- Meilleure adéquation profil/cours

### Réduire l'incertitude
- Estimation fiable de la charge de travail
- Prédiction du niveau de difficulté

### Centraliser les informations
- Une seule plateforme vs sources multiples
- Mise à jour continue des données

### Personnaliser l'expérience
- Recommandations adaptées au profil
- Filtres contextuels intelligents

## Livrables Phase 1

Ce rapport documente l'analyse des exigences et inclut :

- ✅ Cadre du projet et échéancier
- ✅ Analyse du domaine et glossaire
- ✅ Identification de 5+ risques et mitigations
- ✅ Besoins fonctionnels (diagramme CU)
- ✅ Besoins non fonctionnels (5+ caractéristiques)
- ✅ 5 cas d'utilisation détaillés avec scénarios
- ✅ Diagramme d'activités
- ✅ Architecture C4 (niveaux 1 et 2)
- 🎁 **Bonus** : Prototype interactif démonstratif

## Structure du Rapport

Ce rapport présente l'analyse complète du projet :

- **[Cadre du Projet](cadre-projet.md)** : Description, équipe, échéancier
- **[Analyse des Exigences](analyse-exigences.md)** : Domaine, risques, besoins
- **[Cas d'Utilisation](cas-utilisation.md)** : CU détaillés et scénarios
- **[Conception](conception.md)** : Architecture C4 et modélisation

## Navigation Rapide

- 📋 **Cadre du Projet** - Équipe, échéancier
- 🔍 **Analyse des Exigences** - Domaine, risques, besoins
- 🎯 **Cas d'Utilisation** - Scénarios détaillés
- 🏗️ **Conception** - Architecture et modélisation
