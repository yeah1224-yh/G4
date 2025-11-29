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
| CU05 | Rechercher Cours | Etudiant | l'étudiant peut chercher un cours dans la barre de recherche selon le cours souhaité |
| CU06 | Details d'un cours | API Planifium | l'API fourni les details des cours disponible |
| CU07 | Avis Etudiants | Bot Discord | le Bot discord fourni les avis donner par les étudiants via discord |
| CU08 | Filtrer les avis | Etudiant | l'étudiant peut filtrer les avis selon la caractéristique chercher à propos de cours selectionner soit par la session ou l'année, le volume de travail, le niveau de difficulté perçu |

## Détail

### CU01 - Consulter Cours

**Acteurs** : Etudiant (principal)  
**Préconditions** : Le système fait la recherche des cours disponibles     
**PostConditions** : Le système fourni la liste des cours trouver      
**Déclencheur** : l'étudiant clique sur Consulter Cours  
**Dépendances** : API Planifium ( fourni la liste des cours disponibles )    
**But** : Voir la liste des cours disponible  

### CU02 - Consulter Avis  

**Acteurs** : Etudiant (principal)   
**Préconditions** : Le système fait la recherche des avis disponibles du cours selectionner    
**PostConditions** : Le système fourni la liste des avis trouver  
**Déclencheur** : l'étudiant clique sur Consulter Avis  
**Dépendances** : Bot Discord ( fourni la liste des avis disponible )   
**But** : Voir toutes les avis à propos du cours selectionner  

### CU03 - Comparer Cours

**Acteurs** : Etudiant (principal)  
**Préconditions** : Condition réquies pour comparer les cours est au moins 2 cours  
**PostConditions** : Le système compare les 2 cours avec des informations (la charge totale de travail d’une combinaison, Les résultats académiques agrégés, les avis étudiants    
**Déclencheur** : lorsque l'étudiant clique sur Comparer  
**Dépendances** : Bot discord et API Planifium  
**But** : Comparer la charge réelle de travail, le niveau de difficulté perçu, le rythme du cours de 2 cours.  

### CU04 - Personnaliser Profil

**Acteurs** : Etudiant (principal)  
**Préconditions** : Le système fourni les differentes interêts disponible  
**PostConditions** : Le système enregistre la personnalisation pour un laps de temps (après la fermeture de la platforme )     
**Déclencheur** : lorsque l'étudiant clique sur Profil      
**Dépendances** : Base de donnée ( Contient les differentes types d'interêts  
**But** : Choisir ces centres d'interêts  pour obtenir des résultats de recherche et présentations   

### CU05 - Rechercher Cours

**Acteurs** : Etudiant (principal)
**Préconditions** : Le système filtre la liste des cours avec des specifications données par l'étudiant comme (mot-clés, code cours)
**PostConditions** : Le système renvoie les résultuts obtenus  
**Déclencheur** : Clique sur Rechercher    
**Dépendances** : API Planifium ( fourni la liste des cours souhaités )  
**But** : Permettre de faire la rechercher d'un cours en fonctions des genres de cours souhaités par l'étudiant  

### CU06 - Details du cours

**Acteurs** : API Planifium (secondaire)
**Préconditions** : Le système demande l'accès au cours   
**PostConditions** : Le système récupère les cours demander   
**Déclencheur** : Lorsque l'étudiant fait la recherche d'un cours ou consulter un cours   
**Dépendances** : API Back-end  
**But** : Récuperer la liste des cours demander par l'étudiant puis l'afficher    

### CU07 - Avis Etudiant

**Acteurs** : Bot Discord (secondaire)
**Préconditions** : Le système demande l'accès au Avis    
**PostConditions** : Le système récupère les Avis demander    
**Déclencheur** : Lorsque l'étudiant veut voir les avis sur un cours donné     
**Dépendances** : API Back-end, Bot Discord  
**But** : Permet aux étudiants de voir des avis sur un cours donné  

### CU08 - Filtrer les avis

**Acteurs** : Etudiant (principal)
**Préconditions** : Le système demande l'accès au Avis    
**PostConditions** : Le système récupère les Avis demander puis les filtrer en fonction de l'entrer    
**Déclencheur** : Lorsque l'étudiant veut voir les avis filtrer sur un cours donné  
**Dépendances** : API Back-end, Bot Discord  
**But** : Permet aux étudiants de voir la liste des avis filtrer sur un cours donné   
