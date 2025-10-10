---
title: Analyse des besoins - Présentation générale
---

# Présentation du projet

## Méthodologie pour la cueillette des données

Les besoins ont été collectés à travers :

- **Analyse documentaire** : Étude de l'API Planifium, des systèmes existants à l'UdeM
- **Observation** : Analyse des difficultés rencontrées par les étudiants lors des choix de cours
- **Brainstorming** : Identification des fonctionnalités clés et des besoins utilisateurs
- **Recherche** : Étude des plateformes similaires dans d'autres universités

## Description du domaine

### Fonctionnement

La plateforme de choix de cours fonctionne comme un système d'information centralisé qui agrège et présente des données hétérogènes pour aider les étudiants dans leurs décisions académiques.

Le système combine :

1. **Données officielles** de l'API Planifium (cours, programmes, prérequis)
2. **Résultats académiques** agrégés (moyennes, taux d'échec)
3. **Avis étudiants** collectés via Discord (expériences, recommandations)
4. **Profils utilisateurs** pour personnaliser l'expérience

### Acteurs

#### Acteurs Primaires

- **Étudiant** : Utilisateur principal qui consulte et utilise la plateforme
- **Système Discord** : Collecte les avis étudiants via bot
- **API Planifium** : Fournit les données officielles des cours

#### Acteurs Secondaires

- **Administrateur** : Gère la plateforme et les données
- **Modérateur** : Valide et modère les avis étudiants
- **Développeur** : Maintient et améliore la plateforme

### Dépendances

1. **API Planifium** : Disponibilité et format des données
2. **Réseau Discord** : Collecte des avis étudiants
3. **Infrastructure UdeM** : Accès aux résultats académiques
4. **Législation québécoise** : Conformité Loi 25

## Hypothèses et contraintes

### Hypothèses Techniques

1. **API Planifium stable** : L'API reste disponible et son format ne change pas
2. **Données CSV cohérentes** : Les résultats académiques suivent un format standard
3. **Bot Discord fonctionnel** : Le système de collecte d'avis est opérationnel
4. **Infrastructure fiable** : Serveurs et base de données disponibles

### Hypothèses Fonctionnelles

1. **Adoption étudiante** : Les étudiants utilisent activement la plateforme
2. **Qualité des avis** : Les retours d'expérience sont constructifs et pertinents
3. **Données à jour** : Les informations sont régulièrement mises à jour
4. **Conformité légale** : Respect automatique des réglementations

### Contraintes Techniques

- **API REST** : Interface obligatoire
- **Sources de données** : Planifium, CSV, JSON
- **Documentation** : MkDocs + HTML

### Contraintes Légales

- **Loi 25** : Respect de la confidentialité au Québec
- **RGPD** : Protection des données personnelles
- **Propriété intellectuelle** : Respect des droits d'auteur

### Contraintes Temporelles

- **26 septembre** : Ébauche obligatoire
- **10 octobre** : Remise finale
- **Participation active** : 3 commits minimum par membre

