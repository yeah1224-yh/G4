---
title: Exigences fonctionnelles et non-fonctionnelles
---

# Exigences

## Besoins Fonctionnels

### 1. Recherche de cours
- L'étudiant doit pouvoir rechercher des cours par code, titre, mots-clés ou programme
- Le système doit afficher les résultats sous forme de cartes
- Le système doit permettre de filtrer et trier les résultats
- Le temps de réponse doit être inférieur à 2 secondes

### 2. Consultation des détails d'un cours
- L'étudiant doit pouvoir consulter toutes les informations d'un cours
- Le système doit afficher : code, titre, crédits, description, prérequis
- Le système doit afficher les statistiques académiques (moyenne, taux d'échec)
- Le système doit afficher les avis étudiants agrégés

### 3. Comparaison de cours
- L'étudiant doit pouvoir comparer jusqu'à 3 cours simultanément
- Le système doit générer un tableau comparatif avec critères pertinents
- L'étudiant doit pouvoir exporter la comparaison
- Le système doit sauvegarder temporairement les cours en comparaison

### 4. Consultation des avis étudiants
- Le système doit afficher les avis uniquement si le seuil minimal (n≥5) est atteint
- Les avis doivent être anonymisés
- Le système doit calculer et afficher les statistiques agrégées
- L'étudiant doit pouvoir filtrer les avis par période ou note

### 5. Gestion du profil
- L'étudiant doit pouvoir configurer ses préférences (théorie/pratique)
- L'étudiant doit pouvoir sélectionner ses centres d'intérêt
- Le système doit sauvegarder les préférences
- Le système doit personnaliser les recommandations selon le profil

### 6. Authentification
- Le système doit intégrer l'authentification UdeM
- Le système doit gérer les sessions utilisateurs de manière sécurisée
- Le système doit implémenter un timeout de session
- Le système doit respecter les permissions selon les rôles

### 7. Synchronisation des données
- Le système doit synchroniser automatiquement avec l'API Planifium
- Le système doit collecter les avis Discord en temps réel
- Le système doit gérer les erreurs de synchronisation
- Le système doit enregistrer les logs de synchronisation

### 8. Modération des avis
- Le système doit appliquer des filtres automatiques aux avis
- L'administrateur doit pouvoir approuver ou rejeter manuellement les avis
- Le système doit enregistrer les statistiques de modération
- Le système doit notifier l'auteur en cas de rejet (si identifiable)

### 9. Administration
- L'administrateur doit pouvoir consulter les métriques de la plateforme
- L'administrateur doit pouvoir gérer les utilisateurs
- L'administrateur doit pouvoir configurer les paramètres système
- L'administrateur doit pouvoir consulter les logs système

## Besoins Non Fonctionnels

### 1. Performance
**Description** : Temps de réponse < 2 secondes pour toutes les requêtes

**Justification** : Expérience utilisateur fluide et professionnelle

**Critères d'acceptation** :

- Page d'accueil se charge en < 1 seconde
- Recherche de cours en < 2 secondes
- Comparaison de cours en < 3 secondes

### 2. Disponibilité
**Description** : Service disponible 99% du temps

**Justification** : Accessibilité critique pendant les périodes d'inscription

**Critères d'acceptation** :

- Uptime > 99%
- Temps de récupération < 1 heure
- Monitoring 24/7

### 3. Sécurité
**Description** : Protection des données personnelles et conformité légale

**Justification** : Respect de la Loi 25 et protection de la vie privée

**Critères d'acceptation** :

- Chiffrement des données sensibles
- Authentification sécurisée
- Audit trail complet

### 4. Évolutivité
**Description** : Capacité à gérer l'augmentation du nombre d'utilisateurs

**Justification** : Croissance potentielle de l'adoption

**Critères d'acceptation** :

- Support de 10 000 utilisateurs simultanés
- Architecture modulaire
- Déploiement automatisé

### 5. Maintenabilité
**Description** : Code facile à maintenir et à faire évoluer

**Justification** : Longévité du projet et facilité de développement

**Critères d'acceptation** :

- Documentation technique complète
- Tests automatisés > 80%
- Code review obligatoire

## Besoins Matériels

### Infrastructure Serveur
- **CPU** : 4 cœurs minimum
- **RAM** : 8 GB minimum
- **Stockage** : 100 GB SSD
- **Réseau** : 1 Gbps

### Base de Données
- **Type** : PostgreSQL ou MongoDB
- **Capacité** : 50 GB initial
- **Backup** : Quotidien avec rétention 30 jours

### CDN et Cache
- **Redis** : Cache en mémoire
- **CDN** : Distribution des assets statiques

## Solution de Stockage

### Architecture de Données
```
├── Base de données principale (PostgreSQL)
│   ├── Utilisateurs et profils
│   ├── Cours et programmes
│   └── Avis et évaluations
├── Cache Redis
│   ├── Sessions utilisateurs
│   ├── Résultats de recherche
│   └── Données fréquemment accédées
└── Stockage fichiers
    ├── Images et documents
    ├── Exports CSV/JSON
    └── Logs système
```

### Stratégie de Sauvegarde
- **Backup quotidien** : Base de données complète
- **Backup incrémental** : Toutes les 6 heures
- **Rétention** : 30 jours pour les backups quotidiens
- **Test de restauration** : Mensuel

## Solution d'Intégration

### API REST
- **Framework** : FastAPI (Python) ou Express.js (Node.js)
- **Documentation** : OpenAPI/Swagger
- **Authentification** : JWT tokens
- **Rate limiting** : 1000 requêtes/heure par utilisateur

### Intégrations Externes
- **API Planifium** : Synchronisation quotidienne
- **Discord Bot** : Collecte en temps réel
- **Système UdeM** : Import des résultats académiques

### Monitoring
- **Logs** : ELK Stack (Elasticsearch, Logstash, Kibana)
- **Métriques** : Prometheus + Grafana
- **Alertes** : Slack/Email pour les incidents critiques

