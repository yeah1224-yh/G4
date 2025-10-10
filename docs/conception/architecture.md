---
title: Architecture du système
---

# Architecture du Système

## Modèle C4

### Niveau 1 - Diagramme de Contexte

```mermaid
graph TB
    subgraph "Université de Montréal"
        Student[Étudiant]
        Admin[Administrateur]
    end
    
    subgraph "Plateforme de Choix de Cours"
        System[Plateforme Web<br/>de Choix de Cours]
    end
    
    subgraph "Systèmes Externes"
        Planifium[API Planifium<br/>Catalogue officiel]
        Discord[Discord<br/>Collecte avis]
        Results[Base de données<br/>Résultats académiques]
    end
    
    Student -->|Recherche et consulte<br/>les cours| System
    Admin -->|Gère la plateforme<br/>et les données| System
    
    System -->|Récupère données<br/>officielles| Planifium
    System -->|Collecte avis<br/>étudiants| Discord
    System -->|Importe résultats<br/>académiques| Results
    
    Planifium -->|Fournit catalogue<br/>cours et programmes| System
    Discord -->|Transmet avis<br/>collectés| System
    Results -->|Fournit statistiques<br/>agrégées| System
```

### Niveau 2 - Diagramme de Conteneurs

```mermaid
graph TB
    subgraph "Client Web"
        Browser[Navigateur Web<br/>React/Vue.js]
    end
    
    subgraph "Plateforme de Choix de Cours"
        subgraph "Frontend"
            WebApp[Application Web<br/>Interface utilisateur]
        end
        
        subgraph "Backend"
            API[API REST<br/>FastAPI/Express.js]
            Auth[Service d'authentification<br/>JWT]
        end
        
        subgraph "Services"
            Search[Service de recherche<br/>Moteur de recherche]
            Compare[Service de comparaison<br/>Analyse comparative]
            Profile[Service de profil<br/>Personnalisation]
        end
        
        subgraph "Données"
            Database[(Base de données<br/>PostgreSQL)]
            Cache[(Cache Redis<br/>Sessions et données)]
            Files[Stockage fichiers<br/>Images et exports]
        end
    end
    
    subgraph "Systèmes Externes"
        PlanifiumAPI[API Planifium]
        DiscordBot[Bot Discord]
        ResultsDB[Base résultats<br/>académiques]
    end
    
    Browser --> WebApp
    WebApp --> API
    API --> Auth
    API --> Search
    API --> Compare
    API --> Profile
    
    Search --> Database
    Compare --> Database
    Profile --> Database
    Auth --> Cache
    
    API --> PlanifiumAPI
    API --> DiscordBot
    API --> ResultsDB
    
    Database --> Files
```

## Détail des Conteneurs

### Application Web (Frontend)
- **Technologie** : React.js ou Vue.js
- **Responsabilité** : Interface utilisateur, interaction client
- **Communication** : HTTP/HTTPS avec l'API REST

### API REST (Backend)
- **Technologie** : FastAPI (Python) ou Express.js (Node.js)
- **Responsabilité** : Logique métier, orchestration des services
- **Communication** : HTTP/HTTPS avec le frontend, base de données

### Service d'Authentification
- **Technologie** : JWT, OAuth 2.0
- **Responsabilité** : Gestion des sessions, sécurité
- **Communication** : Cache Redis pour les sessions

### Service de Recherche
- **Technologie** : Elasticsearch ou recherche SQL
- **Responsabilité** : Indexation et recherche de cours
- **Communication** : Base de données PostgreSQL

### Service de Comparaison
- **Technologie** : Logique métier personnalisée
- **Responsabilité** : Génération de tableaux comparatifs
- **Communication** : Base de données pour récupérer les données

### Service de Profil
- **Technologie** : Logique métier personnalisée
- **Responsabilité** : Gestion des préférences utilisateur
- **Communication** : Base de données pour persister les profils

### Base de Données
- **Technologie** : PostgreSQL
- **Responsabilité** : Persistance des données principales
- **Contenu** : Cours, utilisateurs, avis, profils

### Cache Redis
- **Technologie** : Redis
- **Responsabilité** : Cache des sessions et données fréquentes
- **Contenu** : Sessions utilisateurs, résultats de recherche

## Patterns Architecturaux

### API REST
- **Style** : RESTful avec OpenAPI
- **Authentification** : JWT Bearer tokens
- **Versioning** : URL versioning (/api/v1/)
- **Rate Limiting** : 1000 req/hour par utilisateur

### Microservices (Optionnel)
- **Service de recherche** : Recherche et indexation
- **Service d'avis** : Gestion des avis étudiants
- **Service de comparaison** : Logique comparative
- **Service de profil** : Gestion des utilisateurs

### CQRS (Command Query Responsibility Segregation)
- **Commands** : Modifications des données (avis, profils)
- **Queries** : Lectures des données (recherche, consultation)
- **Event Sourcing** : Historique des modifications

## Sécurité

### Authentification et Autorisation
- **JWT Tokens** : Authentification stateless
- **OAuth 2.0** : Intégration avec systèmes UdeM
- **RBAC** : Rôles basés sur les permissions
- **Rate Limiting** : Protection contre les abus

### Protection des Données
- **Chiffrement** : HTTPS, chiffrement au repos
- **Validation** : Input validation et sanitization
- **CORS** : Configuration restrictive
- **Headers de sécurité** : CSP, HSTS, etc.

### Conformité
- **Loi 25** : Protection des données personnelles
- **RGPD** : Conformité européenne
- **Audit Trail** : Traçabilité des accès
- **Consentement** : Gestion explicite du consentement

