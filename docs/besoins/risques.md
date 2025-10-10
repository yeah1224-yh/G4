---
title: Évaluation des risques
---

# Risques

## 1. Risque Technique - Indisponibilité de l'API Planifium

**Description** : L'API Planifium devient indisponible ou change de format

**Impact** : Critique - Perte des données officielles principales

**Probabilité** : Moyenne

**Solution** :

- Mise en cache des données
- Accord de service avec l'UdeM
- Système de fallback avec données statiques

## 2. Risque Fonctionnel - Faible adoption étudiante

**Description** : Les étudiants n'utilisent pas la plateforme

**Impact** : Élevé - Échec du projet

**Probabilité** : Moyenne

**Solution** :

- Interface utilisateur intuitive
- Promotion active auprès des étudiants
- Intégration avec les systèmes existants

## 3. Risque Légal - Non-conformité Loi 25

**Description** : Violation des réglementations sur la protection des données

**Impact** : Critique - Sanctions légales

**Probabilité** : Faible

**Solution** :

- Audit de conformité régulier
- Chiffrement des données personnelles
- Consentement explicite des utilisateurs

## 4. Risque Qualité - Avis étudiants non pertinents

**Description** : Les retours d'expérience sont de mauvaise qualité

**Impact** : Moyen - Perte de valeur de la plateforme

**Probabilité** : Élevée

**Solution** :

- Système de modération
- Validation des avis
- Incitation à la qualité

## 5. Risque Performance - Surcharge du système

**Description** : La plateforme ne peut pas gérer le trafic

**Impact** : Élevé - Indisponibilité du service

**Probabilité** : Moyenne

**Solution** :

- Architecture scalable
- Mise en cache agressive
- Monitoring des performances

## Matrice des risques

| Risque | Impact | Probabilité | Priorité | Statut |
|--------|--------|-------------|----------|--------|
| Indisponibilité API Planifium | Critique | Moyenne | 🔴 Haute | Mitigé |
| Faible adoption étudiante | Élevé | Moyenne | 🟠 Moyenne | En cours |
| Non-conformité Loi 25 | Critique | Faible | 🟠 Moyenne | Surveillé |
| Avis non pertinents | Moyen | Élevée | 🟠 Moyenne | En cours |
| Surcharge système | Élevé | Moyenne | 🟠 Moyenne | Planifié |

## Plan de mitigation

### Court terme (Phase 1)
1. Implémenter le système de cache pour l'API Planifium
2. Définir les critères de qualité pour les avis
3. Planifier l'architecture scalable

### Moyen terme (Phase 2)
1. Audit de conformité Loi 25
2. Campagne de promotion auprès des étudiants
3. Mise en place du monitoring

### Long terme (Phase 3)
1. Optimisation continue des performances
2. Amélioration du système de modération
3. Expansion des fonctionnalités selon l'adoption

