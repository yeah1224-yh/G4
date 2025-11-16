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

### Risque 2 - Fonctionnel Faible adoption étudiante
**Description** : Faible taux d'utilisation par les étudiants en raison d'une valeur perçue insuffisante  
**Impact** : Élevé - Atteinte partielle des objectifs du projet  
**Probabilité** : Moyenne  
**Solution** :  
- Interface utilisateur intuitive et conviviale  
- Campagne de promotion ciblée auprès des associations étudiantes  
- Intégration avec les portails existants de l'université  
- Fonctionnalités incitatives et retours rapides sur l'utilisation  

### Risque 3 - Légal Non-conformité Loi 25
**Description** : Traitement des données personnelles non conforme aux exigences réglementaires  
**Impact** : Critique - Sanctions légales et atteinte à la réputation  
**Probabilité** : Faible  
**Solution** :  
- Architecture respectant la protection des données par conception  
- Chiffrement systématique des données personnelles  
- Mécanismes de consentement granularisés et révocables  
- Révision légale préalable au déploiement  
- Journalisation des accès et traitements  

### Risque 4 - Qualité Avis étudiants non pertinents
**Description** : Prolifération d'avis peu détaillés, non constructifs ou non objectifs  
**Impact** : Moyen - Dégradation de la qualité perçue de la plateforme  
**Probabilité** : Élevée  
**Solution** :  
- Gabarits structurés pour guider la rédaction des avis  
- Système de notation de la pertinence des avis  
- Modération basée sur des critères de longueur et de spécificité  
- Mise en avant des avis les plus utiles  
- Mécanismes de signalement des contenus non pertinents  

### Risque 5 - Performance Surcharge du système
**Description** : La plateforme ne peut pas gérer le trafic  
**Impact** : Élevé - Indisponibilité du service  
**Probabilité** : Moyenne  
**Solution** :  
- Architecture scalable  
- Mise en cache agressive  
- Monitoring des performances  

## Modification du processus opérationnel

> Si la mise en place du système modifie des processus internes ou des pratiques actuelles, il est essentiel de les identifier ici.
