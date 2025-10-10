# Analyse des Exigences

## Description du Domaine

### Fonctionnement Général

La plateforme de choix de cours fonctionne comme un système d'information centralisé qui agrège et présente des données hétérogènes pour aider les étudiants dans leurs décisions académiques.

### Acteurs Principaux

#### Acteurs Primaires
- **Étudiant** : Utilisateur principal qui consulte et utilise la plateforme
- **Système Discord** : Collecte les avis étudiants via bot
- **API Planifium** : Fournit les données officielles des cours

#### Acteurs Secondaires
- **Administrateur** : Gère la plateforme et les données
- **Modérateur** : Valide et modère les avis étudiants
- **Développeur** : Maintient et améliore la plateforme

### Dépendances Externes

1. **API Planifium** : Disponibilité et format des données
2. **Réseau Discord** : Collecte des avis étudiants
3. **Infrastructure UdeM** : Accès aux résultats académiques
4. **Législation québécoise** : Conformité Loi 25

## Hypothèses

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

### Hypothèses Métier
1. **Besoin réel** : Les étudiants ont effectivement besoin de cet outil
2. **Valeur ajoutée** : La plateforme améliore réellement les choix de cours
3. **Soutenabilité** : Le projet peut être maintenu à long terme
4. **Évolutivité** : La solution peut s'adapter aux changements futurs

## Glossaire

| Terme | Définition |
|-------|------------|
| **API Planifium** | Interface officielle de l'UdeM pour accéder aux données des cours et programmes |
| **Bot Discord** | Programme automatisé qui collecte les avis étudiants sur Discord |
| **Cas d'utilisation (CU)** | Description d'une interaction entre un acteur et le système |
| **Charge de travail** | Estimation du temps et effort requis pour un cours |
| **Critère d'acceptation** | Condition mesurable pour valider une exigence |
| **DIRO** | Département d'informatique et de recherche opérationnelle de l'UdeM |
| **Éligibilité** | Vérification des prérequis et contraintes pour s'inscrire à un cours |
| **Loi 25** | Loi sur la protection des renseignements personnels au Québec |
| **Personnalisation** | Adaptation de l'affichage selon le profil de l'étudiant |
| **Planifium** | Système officiel de planification des cours de l'UdeM |
| **Prérequis** | Cours ou conditions obligatoires avant de s'inscrire |
| **Profil étudiant** | Caractéristiques personnelles (préférences, centres d'intérêt) |
| **Résultats académiques** | Données agrégées sur les performances d'un cours |
| **Seuil minimal** | Nombre minimum d'avis requis pour afficher des statistiques |

## Risques

### 1. Risque Technique - Indisponibilité de l'API Planifium
**Description** : L'API Planifium devient indisponible ou change de format
**Impact** : Critique - Perte des données officielles principales
**Probabilité** : Moyenne
**Solution** : 
- Mise en cache des données
- Accord de service avec l'UdeM
- Système de fallback avec données statiques

### 2. Risque Fonctionnel - Faible adoption étudiante
**Description** : Les étudiants n'utilisent pas la plateforme
**Impact** : Élevé - Échec du projet
**Probabilité** : Moyenne
**Solution** :
- Interface utilisateur intuitive
- Promotion active auprès des étudiants
- Intégration avec les systèmes existants

### 3. Risque Légal - Non-conformité Loi 25
**Description** : Violation des réglementations sur la protection des données
**Impact** : Critique - Sanctions légales
**Probabilité** : Faible
**Solution** :
- Audit de conformité régulier
- Chiffrement des données personnelles
- Consentement explicite des utilisateurs

### 4. Risque Qualité - Avis étudiants non pertinents
**Description** : Les retours d'expérience sont de mauvaise qualité
**Impact** : Moyen - Perte de valeur de la plateforme
**Probabilité** : Élevée
**Solution** :
- Système de modération
- Validation des avis
- Incitation à la qualité

### 5. Risque Performance - Surcharge du système
**Description** : La plateforme ne peut pas gérer le trafic
**Impact** : Élevé - Indisponibilité du service
**Probabilité** : Moyenne
**Solution** :
- Architecture scalable
- Mise en cache agressive
- Monitoring des performances

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
