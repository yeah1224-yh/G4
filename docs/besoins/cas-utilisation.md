---
title: Analyse des besoins - Cas d'utilisation
---

# Cas d'utilisation

## Vue d’ensemble


## Liste des cas d’utilisation

| ID | Nom | Acteurs principaux | Description |
|----|-----|---------------------|-------------|
| CU01 | Consulter Cours | Etudiant | l'étudiant peut consulter un cours |
| CU02 | Consulter Avis | Etudiant | l'étudiant peut consulter les avis sur un cours |
| CU03 | Comparer Cours | Etudiant | l'étudiant peut comparer deux cours |
| CU04 | Personnaliser Profil | Etudiant | l'étudiant peut personnaliser son profil en fonction de son centre d'interêts |
| CU05 | Rechercher Cours | Etudiant | l'étudiant peut chercher un cours dans la barre de recherche |
| CU06 | Mettre Commentaire | Etudiant | l'étudiant peut mettre des commentaires sur le cours |
| CU07 | Envoyer Report | Etudiant | l'étudiant peut envoyer un report lorsque le système ne marche pas comme prevue |
| CU08 | Cours information | API Planifium | l'API répond au requête demander ( envoie des données demander |
| CU09 | Avis Etudiant | Discord | le discord envoie les données demander |
| CU10 | Feedback | Technicien | recupère le report envoyer par étudiant |
| CU11 | Autre Cours | Etudiant | Choisir le deuxième cours |

## Détail

### CU01 - Consulter Cours

**Acteurs** : Etudiant (principal)  
**Préconditions** : Cours Information   
**PostConditions** : Comparer Cours, Consulter Avis  
**Déclencheur** : l'étudiant clique sur le cours   
**Dépendances** : API Planifium  
**But** : Voir toutes les informations du cours   

### CU02 - Consulter Avis

**Acteurs** : Etudiant (principal)   
**Préconditions** : Consulter Cours  
**PostConditions** : Pas de Post-Condition  
**Déclencheur** : l'étudiant clique sur consulter avis  
**Dépendances** : Avis Etudiant   
**But** : Voir toutes les avis à propos du cours selectionner  

### CU03 - Comparer Cours

**Acteurs** : Etudiant (principal)  
**Préconditions** : Consulter Cours  
**PostConditions** : Autre Cours  
**Déclencheur** : lorsque l'étudian clique sur Comparer  
**Dépendances** : Cours information  
**But** : Comparer deux cours   

### CU04 - Personnaliser Profil

**Acteurs** : Etudiant (principal)  
**Préconditions** : rien  
**PostConditions** : rien  
**Déclencheur** : lorsque l'étudiant clique sur Personnaliser Profil  
**Dépendances** : rien  
**But** : Choisir ces centres d'interêts  

### CU05 - Rechercher Cours

**Acteurs** : Etudiant (principal)
**Préconditions** : rien  
**PostConditions** : rien  
**Déclencheur** : Clique sur rechercher  
**Dépendances** : Planifium  
**But** : Permettre de faire la rechercher d'un cours  

### CU06 - Mettre Commentaire

**Acteurs** : Etudiant (principal)
**Préconditions** : Consulter Cours  
**PostConditions** : Message de confirmation  
**Déclencheur** : Lorsque l'étudiant clique sur Commentaire  
**Dépendances** : Planifium  
**But** : Permettre au étudiants qui n'utilise presque pas discord de mettre directement des commentaires via la platforme

### CU07 - Envoyer Report

**Acteurs** : Etudiant (principal)  
**Préconditions** : Panne du système  
**PostConditions** : Message de confirmation  
**Déclencheur** : Lorsque l'étudiant clique sur Envoyer Report  
**Dépendances** : rien  
**But** : Prevenir le technicien pour une panne critique  

### CU08 - Cours Informations

**Acteurs** : API Planifium (secondaire)
**Préconditions** : Requête envoyer  
**PostConditions** : Repondre au requête  
**Déclencheur** : Lorsqu'une requête est faite  
**Dépendances** : API Back-end  
**But** : Envoyer les données disponibles 

### CU09 - Avis Etudiant

**Acteurs** : Discord (secondaire)
**Préconditions** : Requête envoyer  
**PostConditions** : Repondre au requête  
**Déclencheur** : Lorsqu'une requête est faite  
**Dépendances** : API Back-end  
**But** : Envoyer les avis disponibles

### CU10 - Feedback

**Acteurs** : Technicien (secondaire)
**Préconditions** : Envoyer Report  
**PostConditions** : Envoyer message au Technicien
**Déclencheur** : Lorsqu'une panne critique est déclencher  
**Dépendances** : Étudiant  
**But** : Permettre au technicien de recevoir le message    

### CU11 - Autre Cours

**Acteurs** : Etudiant (principal)  
**Préconditions** : Comparer Cours  
**PostConditions** : rien  
**Déclencheur** : lorsque l'étudiant clique sur Autre cours   
**Dépendances** : Comparer Cours  
**But** : selectionner le deuxième cours   

