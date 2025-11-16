---
title: Analyse des besoins - Exigences
---

# Exigences

## Exigences fonctionnelles

- [ ] Rechercher des cours  
- [ ] Consulter les détails d'un cours  
- [ ] Comparer plusieurs cours  
- [ ] Personnaliser son profil étudiant  
- [ ] Consulter les avis agrégés  
- [ ] Mettre une commentaire  
- [ ] Envoyer report pour le non fonctionnement correct du système

## Exigences non fonctionnelles

- [ ] Performance : L'API doit répondre en moins de 500ms pour les requêtes de recherche et consultation de cours  
- [ ] Disponibilité : Le système doit être disponible à 99.9% pendant les périodes d'inscription académique  
- [ ] Temps de réponse : délai de réponse inférieur ou égal à 2 secondes pour les requêtes de comparaison de cours et génération de statistiques  
- [ ] Maintenabilité : Code documenté avec tests unitaires couvrant 80% des fonctionnalités critiques  
- [ ] Évolutivité : Le système doit supporter une croissance jusqu'à 50 000 utilisateurs actifs mensuels  
- [ ] Compatibilité : La plateforme doit être compatible avec Chrome (v90+), Brave (v1.30+), Firefox (v88+), Safari (v14+) et les navigateurs mobiles Android/iOS  

## Priorisation

- Chiffrement des données sensibles  

## Types d'utilisateurs

> Identifier les différents profils qui interagiront avec le système.

| Type d'utilisateur | Description | Exemples de fonctionnalités accessibles |
|--------------------|-------------|------------------------------------------|
| Étudiant | Utilisateur principal qui consulte et utilise la plateforme | Consulter la liste des cours, comparer la charge de travail, voir les statistiques de réussite |
| API  | Fournit les données officielles des cours | Renvoie des données en fonction des requêtes demander  |
| Discord | Collecte les avis étudiants via bot | Renvoie des données collecter |
| Technicien | Maintient et améliore la plateforme | En cas de panne résoudre en moins de 24h, faire le suivie des infrastructures|  

## Infrastructures

> Informations sur l'environnement d'exécution cible, les outils ou plateformes nécessaires.

- Le système sera hébergé sur un serveur Ubuntu 22.04.  
- Base de données : PostgreSQL version 15.  
- Serveur Web : Nginx + Gunicorn (pour une app Python, par exemple).  
- Langage principal : Python, JavaScript  
- Framework principal : React et Flash  
- Outils de développement: Git, Docker, VSCode, nano  
- Outils de tests : Pytest, Postman, Selenium
