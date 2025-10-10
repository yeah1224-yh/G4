---
title: Analyse des besoins - Risques
---

# Analyse des risques

## Identification des risques

### Risque 1 - Technique Indisponibilité de l'API Planifium
**Description** : L'API Planifium devient indisponible ou change de format  
**Impact** : Critique - Perte des données officielles principales  
**Probabilité** : Moyenne  
**Solution** :  
- Mise en cache des données  
- Accord de service avec l'UdeM  
- Système de fallback avec données statiques  

### Risque 2 -  Fonctionnel  Faible adoption étudiante
**Description** : Les étudiants n'utilisent pas la plateforme  
**Impact** : Élevé - Échec du projet  
**Probabilité** : Moyenne  
**Solution** :  
- Interface utilisateur intuitive  
- Promotion active auprès des étudiants  
- Intégration avec les systèmes existants  

### Risque 3 -  Légal Non-conformité Loi 25
**Description** : Violation des réglementations sur la protection des données  
**Impact** : Critique - Sanctions légales  
**Probabilité** : Faible  
**Solution** :  
- Audit de conformité régulier  
- Chiffrement des données personnelles  
- Consentement explicite des utilisateurs  

### Risque 4 -  Qualité Avis étudiants non pertinents
**Description** : Les retours d'expérience sont de mauvaise qualité  
**Impact** : Moyen - Perte de valeur de la plateforme  
**Probabilité** : Élevée  
**Solution** :  
- Système de modération  
- Validation des avis  
- Incitation à la qualité  

### Risque 5 -  Performance Surcharge du système
**Description** : La plateforme ne peut pas gérer le trafic  
**Impact** : Élevé - Indisponibilité du service  
**Probabilité** : Moyenne  
**Solution** :  
- Architecture scalable  
- Mise en cache agressive  
- Monitoring des performances  

## Modification du processus opérationnel

> Si la mise en place du système modifie des processus internes ou des pratiques actuelles, il est essentiel de les identifier ici.
