---
title: Diagrammes UML
---

# Diagrammes UML

## Diagramme de Classes

```mermaid
classDiagram
    class User {
        +UUID id
        +String email
        +String nom
        +String prenom
        +String matricule
        +Role role
        +DateTime dateCreation
        +authenticate()
        +updateProfile()
        +createReview()
    }
    
    class UserProfile {
        +UUID id
        +PreferenceType preference
        +List~String~ centresInteret
        +Boolean notificationsActives
        +update()
        +getRecommendations()
    }
    
    class Course {
        +UUID id
        +String code
        +String titre
        +String description
        +Integer credits
        +Float moyenneGenerale
        +Float tauxEchec
        +getDetails()
        +getReviews()
        +getPrerequisites()
    }
    
    class Review {
        +UUID id
        +Integer note
        +Integer difficulte
        +Integer chargeTravail
        +String commentaire
        +ReviewStatus statut
        +create()
        +moderate()
        +approve()
        +reject()
    }
    
    class Comparison {
        +UUID id
        +List~UUID~ courseIds
        +DateTime dateCreation
        +addCourse()
        +removeCourse()
        +export()
    }
    
    class SearchService {
        +search(criteria)
        +filter(results)
        +sort(results)
    }
    
    class AuthService {
        +login(credentials)
        +logout()
        +validateToken()
        +refreshToken()
    }
    
    User "1" --> "1" UserProfile
    User "1" --> "*" Review
    User "1" --> "*" Comparison
    Course "1" --> "*" Review
    Course "*" --> "*" Course : prerequisite
    Comparison "*" --> "*" Course
    SearchService ..> Course
    AuthService ..> User
```

## Diagramme de Séquence - Recherche de Cours

```mermaid
sequenceDiagram
    participant U as Utilisateur
    participant F as Frontend
    participant A as API
    participant S as SearchService
    participant C as Cache
    participant D as Database
    
    U->>F: Saisit critères de recherche
    F->>A: POST /api/v1/courses/search
    A->>A: Valide les critères
    A->>S: search(criteria)
    S->>C: Cherche dans le cache
    alt Cache hit
        C-->>S: Résultats cachés
    else Cache miss
        S->>D: SELECT courses WHERE ...
        D-->>S: Résultats
        S->>C: Sauvegarde résultats
    end
    S-->>A: Liste de cours
    A-->>F: JSON response
    F-->>U: Affiche les résultats
```

## Diagramme de Séquence - Consultation d'un Cours

```mermaid
sequenceDiagram
    participant U as Utilisateur
    participant F as Frontend
    participant A as API
    participant D as Database
    participant R as ReviewService
    
    U->>F: Clique sur un cours
    F->>A: GET /api/v1/courses/{id}
    A->>D: SELECT * FROM courses WHERE id=?
    D-->>A: Course data
    A->>R: getAggregatedReviews(courseId)
    R->>D: SELECT * FROM reviews WHERE course_id=?
    D-->>R: Reviews
    R->>R: Calcule statistiques
    alt Seuil minimal atteint (n≥5)
        R-->>A: Avis agrégés
    else Seuil non atteint
        R-->>A: null (avis non affichés)
    end
    A-->>F: Course + Reviews
    F-->>U: Affiche détails complets
```

## Diagramme d'État - Modération d'Avis

```mermaid
stateDiagram-v2
    [*] --> EnAttente : Avis soumis
    EnAttente --> EnCoursModeration : Administrateur consulte
    EnCoursModeration --> Approuve : Avis validé
    EnCoursModeration --> Rejete : Avis non conforme
    Approuve --> Visible : Publication
    Rejete --> Archive : Suppression
    Visible --> [*]
    Archive --> [*]
    
    note right of EnAttente
        Filtrage automatique
        appliqué
    end note
    
    note right of Visible
        Visible pour tous
        les étudiants
    end note
```

## Diagramme de Composants

```mermaid
graph TB
    subgraph "Frontend Layer"
        UI[UI Components]
        State[State Management]
        Router[Router]
    end
    
    subgraph "API Layer"
        Controller[Controllers]
        Middleware[Middleware]
        Validator[Validators]
    end
    
    subgraph "Service Layer"
        AuthService[Auth Service]
        CourseService[Course Service]
        ReviewService[Review Service]
        SearchService[Search Service]
        SyncService[Sync Service]
    end
    
    subgraph "Data Layer"
        Repository[Repositories]
        Cache[Redis Cache]
        Database[PostgreSQL]
    end
    
    subgraph "External Systems"
        Planifium[API Planifium]
        Discord[Discord Bot]
    end
    
    UI --> Router
    Router --> State
    State --> Controller
    Controller --> Middleware
    Middleware --> Validator
    Validator --> AuthService
    Validator --> CourseService
    Validator --> ReviewService
    Validator --> SearchService
    
    AuthService --> Repository
    CourseService --> Repository
    ReviewService --> Repository
    SearchService --> Repository
    
    Repository --> Cache
    Repository --> Database
    
    SyncService --> Planifium
    SyncService --> Discord
    SyncService --> Repository
```

## Diagramme de Déploiement

```mermaid
graph TB
    subgraph "Client"
        Browser[Web Browser]
    end
    
    subgraph "DMZ"
        LoadBalancer[Load Balancer]
        CDN[CDN]
    end
    
    subgraph "Application Tier"
        WebServer1[Web Server 1]
        WebServer2[Web Server 2]
        APIServer1[API Server 1]
        APIServer2[API Server 2]
    end
    
    subgraph "Data Tier"
        PostgreSQL[(PostgreSQL Primary)]
        PostgreSQLReplica[(PostgreSQL Replica)]
        Redis[(Redis Cluster)]
    end
    
    subgraph "External"
        PlanifiumAPI[API Planifium]
        DiscordAPI[Discord API]
    end
    
    Browser -->|HTTPS| LoadBalancer
    Browser -->|Static Assets| CDN
    LoadBalancer --> WebServer1
    LoadBalancer --> WebServer2
    WebServer1 --> APIServer1
    WebServer2 --> APIServer2
    
    APIServer1 --> PostgreSQL
    APIServer2 --> PostgreSQL
    APIServer1 --> Redis
    APIServer2 --> Redis
    PostgreSQL --> PostgreSQLReplica
    
    APIServer1 --> PlanifiumAPI
    APIServer1 --> DiscordAPI
```

