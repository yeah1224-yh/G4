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

La platforme vise à aider les étudiants de l'Université de Montréal à choisir leurs
cours en combinant des données o icielles (Planiﬁum, résultats académiques) avec
des avis d'étudiants récupérés via Discord.

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
4. **Législation québécoise** : Conformité Loi 25

## Hypothèses et contraintes

### Contraintes organisationnelles      
- Travail qu'en ligne sur github  
- Emploi du temps de chaque membre different  
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
- L'API utilisée sera Planifium  
- Discord servira à la collecte des données   
- Les formats des données pris en charge seront CSV et JSON  

##Hypothèses de travail
- On suppose que le platforme sera compatible avec tous les naigateurs populaire
- On suppose que les utilisateurs auront une connexion stable superieur ou égale à 10 Mbps  
- On suppose que le système sera accessible depuis Windows, Linux, macOs, Android et iOS   
 

