# Conception

## Diagrammes d'Activités

### Flux Principal - Recherche et Consultation de Cours

```mermaid
flowchart TD
    A[Étudiant accède à la plateforme] --> B[Authentification]
    B --> C{Authentifié?}
    C -->|Non| D[Page de connexion]
    C -->|Oui| E[Dashboard principal]
    D --> B
    
    E --> F[Recherche de cours]
    F --> G[Saisie des critères]
    G --> H[Validation des critères]
    H --> I{Critères valides?}
    I -->|Non| J[Affichage erreur]
    I -->|Oui| K[Recherche en base]
    J --> G
    
    K --> L{Résultats trouvés?}
    L -->|Non| M[Message aucun résultat]
    L -->|Oui| N[Affichage liste cours]
    M --> G
    
    N --> O[Sélection d'un cours]
    O --> P[Chargement détails cours]
    P --> Q[Affichage informations]
    Q --> R[Consultation avis]
    Q --> S[Vérification éligibilité]
    Q --> T[Ajout à comparaison]
    
    R --> U{Avis disponibles?}
    U -->|Oui| V[Affichage avis agrégés]
    U -->|Non| W[Message aucun avis]
    
    S --> X{Éligible?}
    X -->|Oui| Y[Affichage éligible]
    X -->|Non| Z[Affichage prérequis manquants]
    
    T --> AA[Comparaison de cours]
    AA --> BB[Génération tableau comparatif]
    BB --> CC[Affichage comparaison]
```

### Flux de Collecte d'Avis

```mermaid
flowchart TD
    A[Étudiant partage avis sur Discord] --> B[Bot détecte message]
    B --> C[Extraction informations]
    C --> D[Validation structure avis]
    D --> E{Structure valide?}
    E -->|Non| F[Message d'erreur]
    E -->|Oui| G[Stockage en base]
    F --> A
    
    G --> H[Confirmation collecte]
    H --> I[Agrégation des avis]
    I --> J{Seuil atteint?}
    J -->|Non| K[Attente autres avis]
    J -->|Oui| L[Activation affichage]
    K --> A
    L --> M[Avis disponibles pour consultation]
```

### Flux de Synchronisation des Données

```mermaid
flowchart TD
    A[Déclenchement synchronisation] --> B[Connexion API Planifium]
    B --> C{API accessible?}
    C -->|Non| D[Log erreur]
    C -->|Oui| E[Récupération données]
    D --> F[Retry programmé]
    
    E --> G[Comparaison avec base locale]
    G --> H[Identification modifications]
    H --> I{Mises à jour nécessaires?}
    I -->|Non| J[Synchronisation terminée]
    I -->|Oui| K[Mise à jour base de données]
    
    K --> L[Validation intégrité]
    L --> M{Données cohérentes?}
    M -->|Non| N[Rollback]
    M -->|Oui| O[Log modifications]
    N --> P[Notification erreur]
    O --> J
```

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

### Détail des Conteneurs

#### Application Web (Frontend)
- **Technologie** : React.js ou Vue.js
- **Responsabilité** : Interface utilisateur, interaction client
- **Communication** : HTTP/HTTPS avec l'API REST

#### API REST (Backend)
- **Technologie** : FastAPI (Python) ou Express.js (Node.js)
- **Responsabilité** : Logique métier, orchestration des services
- **Communication** : HTTP/HTTPS avec le frontend, base de données

#### Service d'Authentification
- **Technologie** : JWT, OAuth 2.0
- **Responsabilité** : Gestion des sessions, sécurité
- **Communication** : Cache Redis pour les sessions

#### Service de Recherche
- **Technologie** : Elasticsearch ou recherche SQL
- **Responsabilité** : Indexation et recherche de cours
- **Communication** : Base de données PostgreSQL

#### Service de Comparaison
- **Technologie** : Logique métier personnalisée
- **Responsabilité** : Génération de tableaux comparatifs
- **Communication** : Base de données pour récupérer les données

#### Service de Profil
- **Technologie** : Logique métier personnalisée
- **Responsabilité** : Gestion des préférences utilisateur
- **Communication** : Base de données pour persister les profils

#### Base de Données
- **Technologie** : PostgreSQL
- **Responsabilité** : Persistance des données principales
- **Contenu** : Cours, utilisateurs, avis, profils

#### Cache Redis
- **Technologie** : Redis
- **Responsabilité** : Cache des sessions et données fréquentes
- **Contenu** : Sessions utilisateurs, résultats de recherche

## Architecture Technique

### Stack Technologique

#### Frontend
- **Framework** : React.js avec TypeScript
- **UI Library** : Material-UI ou Ant Design
- **State Management** : Redux Toolkit
- **Build Tool** : Vite ou Create React App

#### Backend
- **Framework** : FastAPI (Python) ou Express.js (Node.js)
- **ORM** : SQLAlchemy (Python) ou Prisma (Node.js)
- **Validation** : Pydantic (Python) ou Joi (Node.js)
- **Documentation** : OpenAPI/Swagger

#### Base de Données
- **Principal** : PostgreSQL
- **Cache** : Redis
- **Recherche** : Elasticsearch (optionnel)

#### Infrastructure
- **Conteneurisation** : Docker
- **Orchestration** : Docker Compose
- **Monitoring** : Prometheus + Grafana
- **Logs** : ELK Stack

### Patterns Architecturaux

#### API REST
- **Style** : RESTful avec OpenAPI
- **Authentification** : JWT Bearer tokens
- **Versioning** : URL versioning (/api/v1/)
- **Rate Limiting** : 1000 req/hour par utilisateur

#### Microservices (Optionnel)
- **Service de recherche** : Recherche et indexation
- **Service d'avis** : Gestion des avis étudiants
- **Service de comparaison** : Logique comparative
- **Service de profil** : Gestion des utilisateurs

#### CQRS (Command Query Responsibility Segregation)
- **Commands** : Modifications des données (avis, profils)
- **Queries** : Lectures des données (recherche, consultation)
- **Event Sourcing** : Historique des modifications

### Sécurité

#### Authentification et Autorisation
- **JWT Tokens** : Authentification stateless
- **OAuth 2.0** : Intégration avec systèmes UdeM
- **RBAC** : Rôles basés sur les permissions
- **Rate Limiting** : Protection contre les abus

#### Protection des Données
- **Chiffrement** : HTTPS, chiffrement au repos
- **Validation** : Input validation et sanitization
- **CORS** : Configuration restrictive
- **Headers de sécurité** : CSP, HSTS, etc.

#### Conformité
- **Loi 25** : Protection des données personnelles
- **RGPD** : Conformité européenne
- **Audit Trail** : Traçabilité des accès
- **Consentement** : Gestion explicite du consentement

## Décisions Architecturales

### Décision 1 : API REST vs GraphQL
**Choix** : API REST
**Justification** : Simplicité, écosystème mature, documentation OpenAPI
**Alternatives considérées** : GraphQL pour la flexibilité des requêtes

### Décision 2 : Base de données relationnelle vs NoSQL
**Choix** : PostgreSQL (relationnel)
**Justification** : Cohérence des données, ACID, requêtes complexes
**Alternatives considérées** : MongoDB pour la flexibilité du schéma

### Décision 3 : Monolithe vs Microservices
**Choix** : Monolithe modulaire
**Justification** : Simplicité de déploiement, équipe réduite
**Alternatives considérées** : Microservices pour la scalabilité

### Décision 4 : Cache en mémoire vs base de données
**Choix** : Redis pour le cache
**Justification** : Performance, persistance optionnelle
**Alternatives considérées** : Cache applicatif, base de données

### Décision 5 : Authentification JWT vs sessions
**Choix** : JWT tokens
**Justification** : Stateless, scalabilité, intégration mobile
**Alternatives considérées** : Sessions serveur pour la sécurité
