---
title: Analyse des besoins - Présentation générale
---

# Présentation du projet

## Méthodologie pour la cueillette des données

Les besoins ont été collectés par des étudiants qui ont déjà vécus l'expérience des cours.  
Soit par les sources officielles (plan de cours, résultats globaux) et des sources informelles  
comme ( des forums, Discord, bouche à oreille).
 
## Description du domaine

### Fonctionnement

La platforme vise à faciliter le choix des cours en fonction des programmes, la difficulté   
l'exigence et charge de travail pour les étudiants(es) de l'Université de Montréal  

### Acteurs

#### Acteur principal
- Étudiant : Utilisateur principal qui consulte et utilise la plateforme  

#### Acteurs Secondaires
- API Planifium : Fournit les données officielles des cours  
- Discord : Collecte les avis étudiants via bot  
- Technicien : Maintient et améliore la plateforme
### Dépendances
1. **API Planifium** : Disponibilité et format des données
2. **Réseau Discord** : Collecte des avis étudiants
3. **Infrastructure UdeM** : Accès aux résultats académiques

## Hypothèses et contraintes

### Contraintes organisationnelles      
- Travail qu'en ligne sur github  
- Emploi du temps de chaque membre différents  
- Méthode de travail agile  

###Contraintes Communications   
- Communique uniquement sur discord  
- Meet up presque chaque vendredi  

###Contraintes Techniques
- Le système sera hébergé sur un serveur ubuntu 22.04  
- Base de données sera PostgreSQL version 15  
- Serveur web sera Nginx + Gunicorn  
- Framework principal sera React pour le front-end  
- Le back-end sera développé en python  
- La loi 25 pour la protection des renseignements personnels
- Discord servira à la collecte des données   
- Les formats des données pris en charge seront CSV et JSON  

##Hypothèses de travail
- On suppose que la platforme sera compatible avec tous les naigateurs populaire  
- On suppose que les utilisateurs auront une connexion stable superieur ou égale à 10 Mbps  
- On suppose que le système sera accessible depuis Windows, Linux, macOs, Android et iOS   
- On suppose que les avis sur discord seront toujours disponibles
- On suppose que l'API planifium sera toujours disponible
- On suppose que le système sera toujours disponible pour les utilisateurs
- On suppose que le système fonctionnera de manière correct 
- On suppose que les feedback seront envoyer correctement. 

