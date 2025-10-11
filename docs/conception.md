# Conception et Architecture

## Vue d'Ensemble

Cette section présente l'architecture complète de la plateforme de choix de cours, en utilisant le modèle C4 (Context, Containers, Components, Code) pour décrire le système à différents niveaux d'abstraction.

## Objectifs d'Architecture

### Principes Directeurs

1. **Modularité** : Séparation claire des responsabilités
2. **Évolutivité** : Support de croissance du nombre d'utilisateurs
3. **Performance** : Temps de réponse < 2 secondes
4. **Fiabilité** : Disponibilité > 99%
5. **Sécurité** : Protection des données et conformité Loi 25
6. **Maintenabilité** : Code propre et documentation complète

### Contraintes Architecturales

- **API REST** : Architecture obligatoire pour l'intégration
- **Stateless** : Pas de session côté serveur (JWT pour auth)
- **Cloud-ready** : Déployable sur infrastructure cloud
- **Multi-sources** : Intégration de 3 sources de données distinctes

---

## Modèle C4 - Niveau 1 : Contexte Système

### Diagramme de Contexte (PlantUML)

```plantuml
@startuml C4_Context
!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Context.puml

LAYOUT_WITH_LEGEND()

title Diagramme de Contexte - Plateforme de Choix de Cours (Niveau 1)

Person(etudiant, "Étudiant", "Utilisateur principal recherchant à faire des choix de cours éclairés")
Person(admin, "Administrateur", "Gère le système, modère les avis, surveille les données")

System(plateforme, "Plateforme de Choix de Cours", "Centralise informations sur les cours, fournit recommandations, comparaisons et vérification d'éligibilité")

System_Ext(planifium, "API Planifium", "Source officielle des données de cours (catalogue, horaires, prérequis, programmes)")
System_Ext(discord, "Bot Discord DIRO", "Collecte automatisée des avis étudiants via interface conversationnelle")
System_Ext(resultats, "Système de Résultats", "Fournit statistiques académiques agrégées (moyennes, inscrits, échecs) au format CSV")

Rel(etudiant, plateforme, "Recherche, consulte, compare des cours", "HTTPS/JSON")
Rel(admin, plateforme, "Gère données, modère avis, surveille", "HTTPS/Dashboard")

Rel(plateforme, planifium, "Synchronise données cours (quotidien)", "REST API/HTTPS")
Rel(discord, plateforme, "Envoie avis collectés (temps réel)", "Webhook/POST/JSON")
Rel(plateforme, resultats, "Importe statistiques (périodique)", "CSV Upload/Parse")

@enduml
```

### Description du Contexte

#### Acteurs Humains

**Étudiant**
- **Rôle** : Utilisateur principal de la plateforme
- **Objectifs** :
  - Rechercher des cours par différents critères
  - Consulter informations détaillées et avis
  - Comparer plusieurs cours simultanément
  - Vérifier son éligibilité aux cours
- **Volume** : 500-1000 utilisateurs actifs par session
- **Accès** : Navigateur web (desktop/mobile)

**Administrateur**
- **Rôle** : Gestion et maintenance du système
- **Objectifs** :
  - Surveiller la santé du système
  - Gérer les synchronisations de données
  - Modérer les avis problématiques
  - Consulter les logs et métriques
- **Volume** : 2-3 administrateurs
- **Accès** : Dashboard d'administration

#### Systèmes Externes

**API Planifium**
- **Type** : Système externe (UdeM)
- **Protocole** : REST API (HTTPS)
- **Données** : Cours, programmes, horaires, prérequis
- **Fréquence** : Synchronisation quotidienne (3h00)
- **Criticité** : 🔴 Haute - Source primaire de données

**Bot Discord**
- **Type** : Service automatisé
- **Protocole** : Webhook POST vers API plateforme
- **Données** : Avis étudiants (difficulté, charge, commentaires)
- **Fréquence** : En temps réel (événements)
- **Criticité** : 🟡 Moyenne - Source secondaire valorisée

**Système de Résultats**
- **Type** : Export périodique (DIRO)
- **Format** : Fichiers CSV
- **Données** : Moyennes, inscrits, taux d'échec par session
- **Fréquence** : Import manuel ou automatique (début de session)
- **Criticité** : 🟢 Faible - Données complémentaires

---

## Modèle C4 - Niveau 2 : Conteneurs

### Diagramme de Conteneurs (PlantUML)

```plantuml
@startuml C4_Container
!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Container.puml

LAYOUT_WITH_LEGEND()

title Diagramme de Conteneurs - Architecture Plateforme (Niveau 2)

Person(etudiant, "Étudiant", "Utilisateur de la plateforme")
Person(admin, "Administrateur", "Gère le système")

System_Boundary(plateforme, "Plateforme de Choix de Cours") {
    Container(webapp, "Application Web", "React 18 + TypeScript", "SPA responsive fournissant interface utilisateur pour recherche, consultation, comparaison")
    Container(api, "API REST", "Node.js + Express/Fastify", "Expose endpoints REST pour toutes fonctionnalités (CRUD cours, avis, recherche, éligibilité)")
    Container(worker, "Worker Service", "Python + Celery", "Exécute tâches asynchrones : synchronisation Planifium, imports CSV, agrégation avis")
    ContainerDb(db, "Base de Données", "PostgreSQL 15", "Stocke cours, prérequis, avis, résultats académiques, horaires")
    Container(cache, "Cache Redis", "Redis 7", "Cache données fréquentes : sessions, résultats recherche, détails cours (TTL 1-24h)")
    Container(storage, "Stockage Fichiers", "S3 / Filesystem", "Stocke exports, backups DB, logs, imports CSV temporaires")
}

System_Ext(planifium, "API Planifium", "Données officielles UdeM")
System_Ext(discord, "Bot Discord", "Collecte avis")
System_Ext(resultats_csv, "Résultats CSV", "Statistiques DIRO")

Rel(etudiant, webapp, "Utilise (navigateur)", "HTTPS")
Rel(admin, webapp, "Dashboard admin", "HTTPS")

Rel(webapp, api, "Appelle endpoints", "JSON/HTTPS")
Rel(api, cache, "Lit/Écrit (get/set)", "Redis Protocol")
Rel(api, db, "Requêtes CRUD", "SQL/TCP")
Rel(api, storage, "Lit/Écrit fichiers", "File I/O")

Rel(worker, planifium, "Fetch courses (quotidien)", "REST API/HTTPS")
Rel(discord, api, "POST avis collectés", "Webhook/JSON")
Rel(worker, resultats_csv, "Parse et importe", "CSV Read")
Rel(worker, db, "Insert/Update données", "SQL/TCP")
Rel(worker, cache, "Invalide après maj", "Redis FLUSHDB")

Rel_Back(api, worker, "Déclenche tâches", "Celery/Bull Queue")

@enduml
```

### Description des Conteneurs

#### 1. Application Web (Frontend)

**Technologies**
- **Framework** : React 18+ ou Vue.js 3+
- **Build** : Vite ou Webpack
- **Styling** : Tailwind CSS ou Material-UI
- **État** : Redux/Pinia pour gestion d'état
- **Routing** : React Router ou Vue Router

**Responsabilités**
- Interface utilisateur responsive (mobile-first)
- Recherche et filtrage de cours
- Affichage des détails et comparaisons
- Visualisations (graphiques, tableaux)
- Gestion des formulaires (éligibilité)

**Caractéristiques**
- **SPA** (Single Page Application)
- **PWA** compatible (Progressive Web App)
- **SSR** optionnel pour SEO (Server-Side Rendering)
- **Code splitting** pour performance

**Déploiement**
- CDN : Cloudflare ou équivalent
- Build statique : Peut être servi par Nginx/Apache
- Hot reload en développement

---

#### 2. API REST (Backend)

**Technologies (Option A - Node.js)**
- **Runtime** : Node.js 18+ LTS
- **Framework** : Express.js ou Fastify
- **ORM** : Prisma ou Sequelize
- **Validation** : Joi ou Zod
- **Auth** : JWT (jsonwebtoken)

**Technologies (Option B - Python)**
- **Runtime** : Python 3.10+
- **Framework** : FastAPI ou Flask
- **ORM** : SQLAlchemy
- **Validation** : Pydantic
- **Auth** : python-jose (JWT)

**Endpoints Principaux**

```
/api/v1/
├── cours/
│   ├── GET    /                    # Liste des cours
│   ├── GET    /:code               # Détails d'un cours
│   ├── GET    /:code/prerequis     # Prérequis
│   ├── GET    /:code/avis          # Avis pour un cours
│   └── GET    /:code/stats         # Statistiques
├── recherche/
│   ├── GET    ?q={query}           # Recherche simple
│   └── POST   /avancee             # Recherche avec filtres
├── comparaison/
│   ├── POST   /                    # Créer comparaison
│   └── GET    /:id                 # Récupérer comparaison
├── avis/
│   ├── POST   /                    # Soumettre un avis
│   └── GET    /stats               # Statistiques globales
├── eligibilite/
│   └── POST   /verifier            # Vérifier éligibilité
└── admin/
    ├── POST   /synchro             # Déclencher synchro
    └── GET    /stats               # Métriques système
```

**Caractéristiques**
- **Authentification** : JWT avec refresh tokens
- **Rate Limiting** : 1000 req/h par utilisateur
- **Validation** : Stricte sur toutes les entrées
- **CORS** : Configuré pour origines autorisées
- **Logging** : Structured logging (JSON)
- **Monitoring** : Health checks (Prometheus metrics)

**Middleware Stack**
1. Helmet (sécurité headers)
2. CORS
3. Rate limiter
4. Body parser (JSON)
5. Authentication (JWT)
6. Request logging
7. Error handler

---

#### 3. Worker Service (Tâches Asynchrones)

**Technologies**
- **Langage** : Python 3.10+
- **Queue** : Celery + Redis ou Bull (Node.js)
- **Scheduler** : Celery Beat ou node-cron

**Tâches Gérées**

**1. Synchronisation Planifium (Quotidienne)**
```python
@task(name="sync_planifium", schedule=crontab(hour=3, minute=0))
def sync_planifium_data():
    """Synchronise données depuis API Planifium"""
    # 1. Fetch courses from Planifium API
    # 2. Compare with local database
    # 3. Apply updates (insert/update/mark inactive)
    # 4. Generate sync report
    # 5. Notify admins if errors
```

**2. Import Résultats CSV**
```python
@task(name="import_results")
def import_academic_results(file_path):
    """Importe résultats académiques depuis CSV"""
    # 1. Validate CSV format
    # 2. Parse and clean data
    # 3. Insert/update results in database
    # 4. Generate import report
```

**3. Agrégation Avis (Horaire)**
```python
@task(name="aggregate_reviews", schedule=crontab(hour="*/6"))
def aggregate_reviews():
    """Recalcule les statistiques agrégées des avis"""
    # 1. For each course with reviews
    # 2. Calculate average difficulty, workload
    # 3. Update aggregated stats table
    # 4. Invalidate cache
```

**4. Nettoyage Cache (Quotidien)**
```python
@task(name="cleanup_cache", schedule=crontab(hour=2, minute=0))
def cleanup_old_cache():
    """Nettoie les entrées de cache expirées"""
    # Purge old cache entries
```

**Monitoring**
- Logs de chaque tâche
- Alertes si échec > 3 fois
- Métriques : Durée d'exécution, succès/échecs

---

#### 4. Cache (Redis)

**Configuration**
- **Version** : Redis 7+
- **Mode** : Standalone (Phase 1) → Cluster (Phase 2+)
- **Persistence** : RDB + AOF
- **Mémoire** : 2-4 GB allouée

**Données Cachées**

**1. Sessions Utilisateurs**
```
Key: session:{token}
TTL: 24h
Value: { user_id, preferences, ... }
```

**2. Résultats de Recherche**
```
Key: search:{hash(query)}
TTL: 1h
Value: [list of course codes]
```

**3. Détails de Cours**
```
Key: course:{code}
TTL: 24h
Value: { code, title, credits, ... }
```

**4. Statistiques Agrégées**
```
Key: stats:reviews:{code}
TTL: 6h
Value: { avg_difficulty, avg_workload, count }
```

**5. Rate Limiting**
```
Key: ratelimit:{ip}:{endpoint}
TTL: 1h
Value: request_count
```

**Stratégie d'Invalidation**
- **Cache-aside** : Lecture → Cache miss → DB → Write to cache
- **Write-through** : Écriture → DB + Cache invalidation
- **TTL-based** : Expiration automatique
- **Event-based** : Invalidation après synchronisation

---

#### 5. Base de Données (PostgreSQL)

**Configuration**
- **Version** : PostgreSQL 14+
- **Extensions** : pg_trgm (recherche), uuid-ossp
- **Encoding** : UTF-8
- **Timezone** : UTC

**Schéma de Données (Simplifié)**

```sql
-- Table: Cours
CREATE TABLE cours (
    code VARCHAR(10) PRIMARY KEY,
    titre VARCHAR(200) NOT NULL,
    credits INTEGER NOT NULL,
    description TEXT,
    departement VARCHAR(50),
    cycle INTEGER,
    sessions_offert TEXT[], -- ['A', 'H', 'E']
    actif BOOLEAN DEFAULT TRUE,
    date_creation TIMESTAMP DEFAULT NOW(),
    date_modification TIMESTAMP DEFAULT NOW()
);

-- Table: Prerequis
CREATE TABLE prerequis (
    id SERIAL PRIMARY KEY,
    cours_code VARCHAR(10) REFERENCES cours(code),
    prerequis_code VARCHAR(10) REFERENCES cours(code),
    type VARCHAR(20), -- 'obligatoire', 'alternatif', 'corequisit'
    groupe INTEGER DEFAULT 0, -- Pour regrouper alternatives (OR)
    UNIQUE(cours_code, prerequis_code, type)
);

-- Table: Resultats Academiques
CREATE TABLE resultats_academiques (
    id SERIAL PRIMARY KEY,
    cours_code VARCHAR(10) REFERENCES cours(code),
    session VARCHAR(6) NOT NULL, -- 'A2024', 'H2025'
    moyenne DECIMAL(3,2), -- 3.2/4.3
    inscrits INTEGER,
    echecs INTEGER,
    taux_echec DECIMAL(5,2), -- Calculé: echecs/inscrits * 100
    date_import TIMESTAMP DEFAULT NOW(),
    UNIQUE(cours_code, session)
);

-- Table: Avis Etudiants
CREATE TABLE avis_etudiants (
    id SERIAL PRIMARY KEY,
    cours_code VARCHAR(10) REFERENCES cours(code),
    session VARCHAR(6) NOT NULL,
    difficulte INTEGER CHECK (difficulte BETWEEN 1 AND 5),
    charge_travail INTEGER CHECK (charge_travail BETWEEN 0 AND 40),
    commentaire TEXT,
    hash_utilisateur VARCHAR(64) NOT NULL, -- SHA-256 anonymisé
    date_creation TIMESTAMP DEFAULT NOW(),
    valide BOOLEAN DEFAULT TRUE,
    INDEX idx_cours_valide (cours_code, valide),
    INDEX idx_session (session)
);

-- Table: Statistiques Avis (Précalculées)
CREATE TABLE stats_avis (
    cours_code VARCHAR(10) PRIMARY KEY REFERENCES cours(code),
    nombre_avis INTEGER DEFAULT 0,
    difficulte_moyenne DECIMAL(3,2),
    charge_moyenne DECIMAL(5,2),
    derniere_mise_a_jour TIMESTAMP DEFAULT NOW()
);

-- Table: Horaires (Optionnel Phase 1)
CREATE TABLE horaires (
    id SERIAL PRIMARY KEY,
    cours_code VARCHAR(10) REFERENCES cours(code),
    session VARCHAR(6) NOT NULL,
    groupe VARCHAR(10), -- '01', '02', 'A1'
    type VARCHAR(20), -- 'magistral', 'laboratoire', 'travaux_pratiques'
    jour VARCHAR(10), -- 'lundi', 'mardi', etc.
    heure_debut TIME,
    heure_fin TIME,
    local VARCHAR(50),
    professeur VARCHAR(100),
    places_disponibles INTEGER,
    UNIQUE(cours_code, session, groupe)
);

-- Table: Logs de Synchronisation
CREATE TABLE logs_synchro (
    id SERIAL PRIMARY KEY,
    type VARCHAR(50), -- 'planifium', 'resultats_csv'
    statut VARCHAR(20), -- 'success', 'partial', 'failure'
    cours_ajoutes INTEGER DEFAULT 0,
    cours_modifies INTEGER DEFAULT 0,
    cours_desactives INTEGER DEFAULT 0,
    erreurs TEXT,
    duree_secondes INTEGER,
    date_execution TIMESTAMP DEFAULT NOW()
);
```

**Index Optimisés**
```sql
-- Recherche full-text
CREATE INDEX idx_cours_titre_trgm ON cours USING gin (titre gin_trgm_ops);
CREATE INDEX idx_cours_code_trgm ON cours USING gin (code gin_trgm_ops);

-- Recherche par département et cycle
CREATE INDEX idx_cours_dept_cycle ON cours(departement, cycle) WHERE actif = TRUE;

-- Avis par cours (requête fréquente)
CREATE INDEX idx_avis_cours_date ON avis_etudiants(cours_code, date_creation DESC) WHERE valide = TRUE;

-- Prérequis lookup
CREATE INDEX idx_prerequis_cours ON prerequis(cours_code);
CREATE INDEX idx_prerequis_pre ON prerequis(prerequis_code);
```

**Vues Matérialisées**
```sql
-- Vue: Cours avec statistiques complètes
CREATE MATERIALIZED VIEW v_cours_complet AS
SELECT 
    c.code,
    c.titre,
    c.credits,
    c.description,
    sa.difficulte_moyenne,
    sa.charge_moyenne,
    sa.nombre_avis,
    ra.moyenne AS moyenne_classe,
    ra.taux_echec
FROM cours c
LEFT JOIN stats_avis sa ON c.code = sa.cours_code
LEFT JOIN LATERAL (
    SELECT moyenne, taux_echec
    FROM resultats_academiques
    WHERE cours_code = c.code
    ORDER BY session DESC
    LIMIT 1
) ra ON TRUE
WHERE c.actif = TRUE;

-- Refresh quotidien
CREATE INDEX ON v_cours_complet(code);
REFRESH MATERIALIZED VIEW CONCURRENTLY v_cours_complet;
```

**Sauvegardes**
- **Full backup** : Quotidien à 2h00 (pg_dump)
- **Incremental** : WAL archiving continu
- **Rétention** : 30 jours
- **Test restore** : Mensuel

---

#### 6. Stockage Fichiers

**Structure**
```
/storage/
├── backups/
│   ├── database/
│   │   └── pg_dump_2025-10-10.sql.gz
│   └── files/
├── exports/
│   ├── comparisons/
│   └── reports/
├── imports/
│   └── resultats_csv/
│       └── A2024_resultats.csv
└── logs/
    ├── api/
    ├── worker/
    └── synchro/
```

**Politique de Rétention**
- **Backups DB** : 30 jours
- **Logs** : 90 jours
- **Exports** : 7 jours
- **Imports** : Archivage après traitement

---

## Traçabilité Exigences → Architecture

Cette section établit la correspondance entre les exigences fonctionnelles identifiées et les composants architecturaux qui les implémentent.

### Mapping Exigences Fonctionnelles

| Exigence Fonctionnelle | Composant Architecture | Justification |
|------------------------|------------------------|---------------|
| **Recherche de cours** | Frontend + API + Cache + DB | Interface utilisateur, endpoint REST, cache pour performance, PostgreSQL avec index full-text |
| **Avis étudiants (n≥5)** | Bot Discord + API + DB | Bot collecte via webhook, validation API, stockage DB avec seuil vérifié |
| **Comparaison cours** | Frontend (React) + API | État local React pour sélection, endpoint API pour données agrégées |
| **Vérification éligibilité** | API + DB (Prérequis) | Logique métier dans service, requêtes récursives sur table prerequis |
| **Résultats académiques** | Worker + CSV Import + DB | Import périodique par worker, parsing pandas/papaparse, stockage PostgreSQL |
| **Confidentialité (Loi 25)** | API (Anonymisation) | Hash SHA-256 des Discord IDs, aucune donnée identifiante stockée |

### Mapping Exigences Non Fonctionnelles

| Exigence Non Fonctionnelle | Composant Architecture | Justification |
|----------------------------|------------------------|---------------|
| **Performance (<2s)** | Redis Cache + Index DB | Cache multi-niveaux, indexes optimisés, query optimization |
| **Disponibilité (>99%)** | Load Balancer + Replicas | Déploiement multi-instances, health checks, auto-scaling |
| **Sécurité (Loi 25, HTTPS)** | API + Middleware | JWT auth, validation entrées, HTTPS obligatoire, headers sécurité |
| **Évolutivité (1000+ users)** | Architecture Stateless | JWT stateless, cache Redis, horizontal scaling possible |
| **Fiabilité (données à jour)** | Worker + Synchro quotidienne | Synchronisation automatique Planifium, validation cohérence |
| **Maintenabilité** | Architecture Modulaire | Séparation concerns, tests >80%, documentation complète |

### Diagramme de Traçabilité

```mermaid
graph LR
    subgraph "Exigences Fonctionnelles"
    EF1[Recherche cours]
    EF2[Avis étudiants]
    EF3[Comparaison]
    EF4[Éligibilité]
    EF5[Résultats académiques]
    end
    
    subgraph "Composants Architecture"
    C1[Frontend React]
    C2[API REST]
    C3[Worker Service]
    C4[PostgreSQL]
    C5[Redis Cache]
    C6[Bot Discord]
    end
    
    EF1 --> C1
    EF1 --> C2
    EF1 --> C4
    EF1 --> C5
    
    EF2 --> C6
    EF2 --> C2
    EF2 --> C4
    
    EF3 --> C1
    EF3 --> C2
    
    EF4 --> C2
    EF4 --> C4
    
    EF5 --> C3
    EF5 --> C4
```

### Validation de Complétude

| Exigence | Implémenté | Composant | Testable | Phase |
|----------|------------|-----------|----------|-------|
| Recherche par code/titre | ✅ | API + DB | ✅ | Phase 1 |
| Filtres avancés | ✅ | API + Frontend | ✅ | Phase 1 |
| Avis agrégés (n≥5) | ✅ | API + DB | ✅ | Phase 1 |
| Comparaison 2-5 cours | ✅ | Frontend + API | ✅ | Phase 1 |
| Vérification prérequis | ✅ | API + DB | ✅ | Phase 1 |
| Détection conflits horaire | ⏳ | API (logique) | ⏳ | Phase 2 |
| Personnalisation profil | ⏳ | Non implémenté | ❌ | Phase 2+ |
| Recommandations IA | ⏳ | Non implémenté | ❌ | Phase 3+ |

**Légende** : ✅ Complet | ⏳ Partiel/Futur | ❌ Non prévu Phase 1

---

## Architecture de Déploiement

### Environnements

#### Développement (Local)

```
┌─────────────────────────────────────────────┐
│  Machine Développeur                        │
│  ┌─────────────┐  ┌─────────────┐          │
│  │  Frontend   │  │   Backend   │          │
│  │  (npm run   │  │ (npm/python │          │
│  │    dev)     │  │    dev)     │          │
│  └──────┬──────┘  └──────┬──────┘          │
│         │                │                  │
│  ┌──────┴────────────────┴──────┐          │
│  │  Docker Compose               │          │
│  │  - PostgreSQL                 │          │
│  │  - Redis                      │          │
│  │  - (Mock API Planifium)       │          │
│  └───────────────────────────────┘          │
└─────────────────────────────────────────────┘
```

#### Staging (Test)

```
┌─────────────────────────────────────────────┐
│  Serveur de Staging                         │
│  ┌─────────────────────────────────┐        │
│  │  Nginx (Reverse Proxy)          │        │
│  └──────┬─────────────────┬────────┘        │
│         │                 │                  │
│  ┌──────▼──────┐   ┌─────▼──────┐          │
│  │  Frontend   │   │  Backend   │          │
│  │  (Static)   │   │  (API)     │          │
│  └─────────────┘   └─────┬──────┘          │
│                           │                  │
│  ┌────────────────────────┴──────┐          │
│  │  PostgreSQL + Redis           │          │
│  └───────────────────────────────┘          │
└─────────────────────────────────────────────┘
```

#### Production

```
┌─────────────────────────────────────────────┐
│  Infrastructure Cloud (AWS/GCP/Azure)       │
│                                             │
│  ┌─────────────────┐                       │
│  │  CDN/Load       │                       │
│  │  Balancer       │                       │
│  └────────┬────────┘                       │
│           │                                 │
│  ┌────────┴────────────────────┐           │
│  │                              │           │
│  │  ┌──────────┐  ┌──────────┐ │           │
│  │  │ Frontend │  │ Frontend │ │ (2+ pods) │
│  │  └──────────┘  └──────────┘ │           │
│  │                              │           │
│  │  ┌──────────┐  ┌──────────┐ │           │
│  │  │ API      │  │ API      │ │ (2+ pods) │
│  │  └────┬─────┘  └────┬─────┘ │           │
│  │       │             │        │           │
│  │  ┌────┴─────────────┴─────┐ │           │
│  │  │  Worker Service         │ │           │
│  │  └────┬────────────────────┘ │           │
│  │       │                       │           │
│  │  ┌────┴──────┐  ┌──────────┐ │           │
│  │  │PostgreSQL │  │  Redis   │ │           │
│  │  │(Primary + │  │ (Cluster)│ │           │
│  │  │ Replica)  │  │          │ │           │
│  │  └───────────┘  └──────────┘ │           │
│  └──────────────────────────────┘           │
└─────────────────────────────────────────────┘
```

---

## Flux de Données Détaillés

### Flux 1 : Recherche de Cours

```mermaid
sequenceDiagram
    actor Étudiant
    participant Frontend
    participant API
    participant Cache
    participant Database
    
    Étudiant->>Frontend: Saisit "IFT2255"
    Frontend->>Frontend: Validation (≥3 chars)
    Frontend->>API: GET /api/v1/recherche?q=IFT2255
    
    API->>API: Authentification (optionnel)
    API->>API: Rate limiting check
    API->>Cache: GET search:hash(IFT2255)
    
    alt Cache Hit
        Cache-->>API: Résultats en cache
    else Cache Miss
        API->>Database: SELECT * FROM cours WHERE...
        Database-->>API: Résultats
        API->>Cache: SET search:hash(IFT2255), TTL=1h
    end
    
    API-->>Frontend: JSON: [cours]
    Frontend->>Frontend: Affiche résultats
    Frontend-->>Étudiant: Liste de cours
```

### Flux 2 : Consultation Détails + Avis

```mermaid
sequenceDiagram
    actor Étudiant
    participant Frontend
    participant API
    participant Cache
    participant Database
    
    Étudiant->>Frontend: Clique sur cours IFT2255
    
    par Chargement Parallèle
        Frontend->>API: GET /api/v1/cours/IFT2255
        API->>Cache: GET course:IFT2255
        alt Cache Miss
            API->>Database: SELECT * FROM cours WHERE code='IFT2255'
            Database-->>API: Données cours
            API->>Cache: SET course:IFT2255, TTL=24h
        end
        API-->>Frontend: Détails cours
    and
        Frontend->>API: GET /api/v1/cours/IFT2255/avis
        API->>Database: SELECT COUNT(*) FROM avis_etudiants...
        Database-->>API: count = 23
        
        alt Avis suffisants (≥5)
            API->>Database: SELECT * FROM stats_avis...
            Database-->>API: Stats agrégées
            API->>Database: SELECT * FROM avis_etudiants... LIMIT 10
            Database-->>API: Avis individuels
            API-->>Frontend: Stats + Avis
        else Avis insuffisants (<5)
            API-->>Frontend: Message "Avis insuffisants"
        end
    end
    
    Frontend->>Frontend: Compose la page
    Frontend-->>Étudiant: Affichage complet
```

### Flux 3 : Soumission Avis (Discord Bot)

```mermaid
sequenceDiagram
    actor Étudiant
    participant Discord
    participant Bot
    participant API
    participant Database
    participant Cache
    
    Étudiant->>Discord: !avis IFT2255 difficulte:4 charge:15 "Super cours"
    Discord->>Bot: Message event
    
    Bot->>Bot: Parse commande
    Bot->>Bot: Valide format
    Bot->>Bot: Hash(user_id) → SHA-256
    
    Bot->>API: POST /api/v1/avis
    Note over Bot,API: {cours_code, difficulte, charge, commentaire, hash}
    
    API->>API: Validation données
    API->>Database: INSERT INTO avis_etudiants...
    Database-->>API: Success (id=12345)
    
    API->>Database: UPDATE stats_avis SET...
    API->>Cache: DELETE stats:reviews:IFT2255
    
    API-->>Bot: 201 Created
    Bot->>Discord: ✅ Merci pour votre avis!
    Discord-->>Étudiant: Confirmation
```

### Flux 4 : Synchronisation Planifium (Quotidienne)

```mermaid
sequenceDiagram
    participant Cron
    participant Worker
    participant Planifium
    participant Database
    participant Cache
    participant Admin
    
    Cron->>Worker: Trigger (3h00)
    Worker->>Worker: Log début synchro
    
    Worker->>Planifium: GET /api/v1/courses
    Planifium-->>Worker: Liste cours (JSON)
    
    Worker->>Database: BEGIN TRANSACTION
    
    loop Pour chaque cours
        Worker->>Database: SELECT * FROM cours WHERE code=?
        alt Cours nouveau
            Worker->>Database: INSERT INTO cours...
        else Cours modifié
            Worker->>Database: UPDATE cours SET...
        else Cours inchangé
            Worker->>Worker: Skip
        end
    end
    
    Worker->>Database: UPDATE cours SET actif=false WHERE...
    Worker->>Database: COMMIT
    
    Worker->>Cache: FLUSHDB (invalide tout)
    
    Worker->>Database: INSERT INTO logs_synchro...
    Worker->>Admin: 📧 Email rapport
    
    alt Succès
        Admin->>Admin: ✅ Synchro OK
    else Échec
        Worker->>Admin: 🚨 Alerte critique
    end
```

---

## Choix Technologiques

### Stack Recommandé (Option Full JavaScript)

#### Frontend
- **Framework** : React 18+ avec TypeScript
- **Build** : Vite (rapide, moderne)
- **UI Library** : Material-UI ou Tailwind CSS
- **State** : React Query (server state) + Zustand (client state)
- **Forms** : React Hook Form + Zod validation
- **Charts** : Recharts ou Chart.js
- **Testing** : Vitest + React Testing Library

#### Backend
- **Runtime** : Node.js 20 LTS
- **Framework** : Express.js ou Fastify
- **ORM** : Prisma (excellent DX, migrations)
- **Validation** : Zod (partagé avec frontend)
- **Auth** : jsonwebtoken (JWT)
- **Docs API** : Swagger/OpenAPI

#### Base de Données
- **Primary** : PostgreSQL 15
- **Cache** : Redis 7
- **Migration** : Prisma Migrate
- **Seeding** : Prisma seed scripts

#### DevOps
- **Containerisation** : Docker + Docker Compose
- **CI/CD** : GitHub Actions
- **Monitoring** : Prometheus + Grafana
- **Logs** : Winston (Node) → Loki/ELK
- **Deployment** : 
  - Simple : Render.com, Railway.app (gratuit)
  - Avancé : AWS ECS, Google Cloud Run

### Alternative (Option Python Backend)

#### Backend
- **Framework** : FastAPI 0.104+
- **ORM** : SQLAlchemy 2.0
- **Validation** : Pydantic V2
- **Auth** : python-jose
- **Tasks** : Celery + Redis
- **Docs** : Automatique avec FastAPI

**Avantages Python**
- Écosystème data science (analyse avis)
- Performance comparable (asyncio)
- Type hints natifs
- Grande communauté

**Avantages Node.js**
- Stack unifié (JS partout)
- Écosystème npm riche
- Performance I/O excellente
- Facilité déploiement

---

### Tableau Comparatif des Options Technologiques

| Critère | Option A (Full JS) | Option B (Python Backend) | Choix Recommandé |
|---------|-------------------|--------------------------|------------------|
| **Stack unifié** | ✅ JavaScript partout | ❌ JS + Python | Option A |
| **Courbe d'apprentissage** | ✅ Plus simple | ⚠️ Deux langages | Option A |
| **Performance I/O** | ✅ Excellent (async) | ✅ Comparable (asyncio) | Égal |
| **Écosystème** | ✅ npm très riche | ✅ pip/PyPI riche | Égal |
| **Type safety** | ✅ TypeScript natif | ✅ Type hints Python | Égal |
| **Data processing** | ⚠️ Limité | ✅ Pandas, NumPy | Option B |
| **Déploiement** | ✅ Plus simple | ⚠️ Plus complexe | Option A |
| **Community support** | ✅ Très large | ✅ Large | Égal |
| **Future ML/AI** | ⚠️ TensorFlow.js | ✅ Scikit-learn, TensorFlow | Option B |
| **Équipe familiarité** | ⚠️ Dépend équipe | ⚠️ Dépend équipe | Contextuel |

#### Recommandation Finale : Option A (Full JavaScript) pour Phase 1

**Raisons**
1. ✅ **Stack unifié** facilite développement et maintenance
2. ✅ **Déploiement simplifié** (un seul runtime)
3. ✅ **Partage de code** (validation Zod entre client/serveur)
4. ✅ **Écosystème mature** pour web APIs

**Note Future**
- Si besoin ML/AI : Créer microservice Python dédié
- Architecture permet ajout de services spécialisés

---

## Décisions d'Architecture

### DR-001 : Architecture REST API vs GraphQL

**Décision** : REST API ✅

**Contexte**
- Contrainte projet : API REST obligatoire
- Cas d'usage bien définis (CRUD standard)
- Équipe familière avec REST

**Alternatives Considérées**
- GraphQL : Flexible mais over-engineering pour ce projet
- gRPC : Performance mais complexité inutile

**Conséquences**
- ✅ Simplicité d'implémentation
- ✅ Standards bien établis
- ❌ Potentiel over-fetching

---

### DR-002 : Base de Données PostgreSQL vs MongoDB

**Décision** : PostgreSQL ✅

**Contexte**
- Données structurées (cours, prérequis, résultats)
- Relations complexes (prérequis, horaires)
- Besoin de transactions ACID

**Raisons**
1. **Relations** : Prérequis = graphe relationnel
2. **Intégrité** : Contraintes FK essentielles
3. **Recherche** : Full-text search (pg_trgm)
4. **Agrégations** : SQL puissant pour stats

**Alternatives Considérées**
- MongoDB : Flexible mais relations difficiles
- MySQL : Viable mais PostgreSQL plus riche (JSONB, arrays)

**Conséquences**
- ✅ Intégrité garantie
- ✅ Performance requêtes complexes
- ❌ Schema rigide (migrations nécessaires)

---

### DR-003 : Authentification JWT vs Sessions

**Décision** : JWT (Stateless) ✅

**Contexte**
- Architecture cloud-ready
- Scalabilité horizontale requise
- Pas de sessions côté serveur

**Raisons**
1. **Stateless** : Aucun stockage session côté serveur
2. **Scalable** : Pas de sticky sessions
3. **Mobile-ready** : Stockage local/sécurisé
4. **Standard** : Largement adopté

**Implémentation**
- Access token : 1h expiration
- Refresh token : 7 jours, stocké HttpOnly cookie
- Rotation des refresh tokens

**Conséquences**
- ✅ Scalabilité excellente
- ✅ Pas de base de sessions
- ❌ Révocation complexe (blacklist requise)

---

### DR-004 : Cache Redis vs Memcached

**Décision** : Redis ✅

**Raisons**
1. **Structures riches** : Lists, sets, sorted sets
2. **Persistence** : RDB + AOF (pas volatile)
3. **Pub/Sub** : Potentiel real-time futur
4. **TTL granulaire** : Par clé
5. **Transactions** : MULTI/EXEC

**Usage**
- Sessions utilisateurs
- Rate limiting
- Cache de recherche
- Queues (Celery/Bull)

**Conséquences**
- ✅ Polyvalent (cache + queue + pubsub)
- ✅ Écosystème riche
- ❌ Plus complexe que Memcached

---

### DR-005 : Monolithe vs Microservices

**Décision** : Monolithe modulaire (Phase 1) ✅

**Contexte**
- Équipe de 4 étudiants
- Délai court (3 semaines)
- Complexité limitée

**Raisons**
1. **Simplicité** : Un seul déploiement
2. **Vitesse** : Développement plus rapide
3. **Débogage** : Plus facile
4. **Ressources** : Moins d'infrastructure

**Architecture**
```
monolith/
├── api/          # Endpoints REST
├── services/     # Logique métier
├── repositories/ # Accès données
├── workers/      # Tâches async (séparé)
└── shared/       # Utils partagés
```

**Migration Future**
- Extraction possible : Worker service déjà séparé
- Si croissance : Microservices (API Gateway + services)

**Conséquences**
- ✅ Time-to-market rapide
- ✅ Moins de complexité opérationnelle
- ❌ Scaling moins granulaire

---

### DR-006 : Validation Côté Client vs Serveur

**Décision** : Les deux (Client + Serveur) ✅

**Raisons**
1. **Client** : UX immédiate, pas de round-trip
2. **Serveur** : Sécurité, source de vérité

**Implémentation**
- **Zod schema partagé** (si TS full-stack)
- Validation identique client/serveur
- Messages d'erreur cohérents

**Exemple**
```typescript
// shared/schemas/avis.schema.ts
const AvisSchema = z.object({
  code_cours: z.string().regex(/^[A-Z]{3}\d{4}$/),
  difficulte: z.number().int().min(1).max(5),
  charge_travail: z.number().int().min(0).max(40),
  commentaire: z.string().max(500).optional()
});
```

**Conséquences**
- ✅ UX optimale
- ✅ Sécurité garantie
- ❌ Code dupliqué (si stacks différentes)

---

## Modèle de Données Étendu

### Diagramme Entité-Relation

```mermaid
erDiagram
    COURS ||--o{ PREREQUIS : "a"
    COURS ||--o{ AVIS_ETUDIANTS : "reçoit"
    COURS ||--o{ RESULTATS_ACADEMIQUES : "a"
    COURS ||--o{ HORAIRES : "offre"
    COURS ||--|| STATS_AVIS : "agrège"
    
    COURS {
        varchar code PK
        varchar titre
        int credits
        text description
        varchar departement
        int cycle
        array sessions_offert
        boolean actif
        timestamp date_creation
    }
    
    PREREQUIS {
        int id PK
        varchar cours_code FK
        varchar prerequis_code FK
        varchar type
        int groupe
    }
    
    AVIS_ETUDIANTS {
        int id PK
        varchar cours_code FK
        varchar session
        int difficulte
        int charge_travail
        text commentaire
        varchar hash_utilisateur
        timestamp date_creation
        boolean valide
    }
    
    STATS_AVIS {
        varchar cours_code PK
        int nombre_avis
        decimal difficulte_moyenne
        decimal charge_moyenne
        timestamp derniere_maj
    }
    
    RESULTATS_ACADEMIQUES {
        int id PK
        varchar cours_code FK
        varchar session
        decimal moyenne
        int inscrits
        int echecs
        decimal taux_echec
    }
    
    HORAIRES {
        int id PK
        varchar cours_code FK
        varchar session
        varchar groupe
        varchar type
        varchar jour
        time heure_debut
        time heure_fin
        varchar local
        varchar professeur
    }
```

---

## Sécurité

### Mesures Implémentées

#### 1. Authentification et Autorisation

**JWT Structure**
```json
{
  "header": {
    "alg": "RS256",
    "typ": "JWT"
  },
  "payload": {
    "sub": "user_uuid",
    "role": "student",
    "iat": 1696934400,
    "exp": 1696938000
  }
}
```

**Niveaux d'Accès**
- **Public** : Recherche, consultation (read-only)
- **Étudiant Auth** : Soumission avis, comparaisons sauvegardées
- **Admin** : Gestion données, synchronisation, modération

#### 2. Protection des Données (Loi 25)

**Données Personnelles Collectées**
- ❌ **JAMAIS** : Nom, prénom, matricule, email
- ✅ **Uniquement** : Hash anonymisé (Discord ID → SHA-256)

**Anonymisation Avis**
```javascript
const crypto = require('crypto');

function anonymizeUser(discordUserId) {
  const salt = process.env.HASH_SALT; // Secret
  return crypto
    .createHash('sha256')
    .update(discordUserId + salt)
    .digest('hex');
}
```

**Consentement Explicite**
- Message bot Discord : "En soumettant, vous acceptez..."
- Lien vers politique de confidentialité
- Possibilité de suppression (droit à l'oubli)

#### 3. Sécurité API

**Headers Sécurité**
```javascript
// Helmet.js configuration
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));
```

**Rate Limiting**
```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1h
  max: 1000, // 1000 requêtes
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests'
});

app.use('/api/', limiter);
```

**Validation Entrées**
- Sanitisation XSS (DOMPurify côté client)
- Parameterized queries (prévention SQL injection)
- Validation stricte des types (Zod/Joi)

#### 4. HTTPS Obligatoire

- TLS 1.3 minimum
- Certificat Let's Encrypt (gratuit, auto-renew)
- HSTS activé (force HTTPS)
- Redirection HTTP → HTTPS

#### 5. Secrets Management

**Variables d'Environnement**
```bash
# .env (JAMAIS commité dans Git)
DATABASE_URL=postgresql://user:pass@localhost:5432/db
REDIS_URL=redis://localhost:6379
JWT_SECRET=random_256bit_string
JWT_REFRESH_SECRET=another_random_string
PLANIFIUM_API_KEY=xyz123
HASH_SALT=random_salt_for_anonymization
```

**Production**
- Secrets injectés via CI/CD (GitHub Secrets)
- Ou via service cloud (AWS Secrets Manager, etc.)

---

## Performance et Optimisation

### Objectifs de Performance

| Métrique | Objectif | Mesure |
|----------|----------|--------|
| Temps de réponse API (p95) | < 2s | New Relic/Datadog |
| Temps de chargement page | < 3s | Lighthouse |
| Requêtes simultanées | 1000+ | Load testing (k6) |
| Disponibilité | > 99% | Uptime monitoring |
| TTFB (Time to First Byte) | < 500ms | WebPageTest |

### Stratégies d'Optimisation

#### 1. Caching Agressif

**Niveaux de Cache**
```
Browser Cache (1h)
    ↓
CDN Cache (24h) - Assets statiques
    ↓
Redis Cache (1-24h) - Données API
    ↓
Database
```

**Headers HTTP**
```http
Cache-Control: public, max-age=3600
ETag: "33a64df551425fcc55e4d42a148795d9f25f89d4"
Last-Modified: Wed, 10 Oct 2025 12:00:00 GMT
```

#### 2. Optimisation Requêtes SQL

**Indexes Stratégiques**
```sql
-- Recherche full-text
CREATE INDEX idx_cours_search ON cours 
USING gin(to_tsvector('french', titre || ' ' || description));

-- Jointures fréquentes
CREATE INDEX idx_avis_cours_date ON avis_etudiants(cours_code, date_creation DESC);

-- Filtres communs
CREATE INDEX idx_cours_actif_dept ON cours(actif, departement) 
WHERE actif = TRUE;
```

**Query Optimization**
```sql
-- Avant (N+1 queries)
SELECT * FROM cours;
-- Puis pour chaque cours:
SELECT * FROM avis WHERE cours_code = ?;

-- Après (1 query avec JOIN)
SELECT 
  c.*,
  json_agg(a.*) as avis
FROM cours c
LEFT JOIN avis_etudiants a ON c.code = a.cours_code
WHERE c.actif = TRUE
GROUP BY c.code;
```

#### 3. Pagination

**Cursor-based Pagination** (plus performant)
```javascript
GET /api/v1/cours?limit=10&cursor=IFT2255

// Réponse
{
  "data": [...],
  "pagination": {
    "next_cursor": "IFT3000",
    "has_more": true
  }
}
```

#### 4. Compression

- **Gzip/Brotli** : Compression HTTP automatique
- **Image optimization** : WebP, lazy loading
- **Code splitting** : Chunks Webpack/Vite

#### 5. Lazy Loading

```javascript
// React lazy loading
const ComparisonPage = lazy(() => import('./pages/Comparison'));

// Image lazy loading
<img src="course-image.jpg" loading="lazy" alt="..." />
```

---

## Gestion Centralisée des Erreurs

### Stratégie Globale

```
Error → Logger → Monitoring → Alert → Response
```

### Codes d'Erreur Standardisés

| Code HTTP | Type | Exemple | Action Client |
|-----------|------|---------|---------------|
| **400** | Bad Request | Format invalide | Afficher message utilisateur |
| **401** | Unauthorized | Token expiré | Redirect vers login |
| **403** | Forbidden | Accès refusé | Afficher message accès |
| **404** | Not Found | Cours inexistant | Suggérer alternatives |
| **429** | Too Many Requests | Rate limit dépassé | Retry après délai |
| **500** | Internal Error | Erreur serveur | Message générique + log |
| **503** | Service Unavailable | API Planifium down | Mode dégradé |

### Format de Réponse d'Erreur

```json
{
  "error": {
    "code": "COURSE_NOT_FOUND",
    "message": "Le cours 'IFT9999' n'existe pas",
    "details": {
      "requested_code": "IFT9999",
      "suggestions": ["IFT2255", "IFT3000"]
    },
    "timestamp": "2025-10-10T14:30:00Z",
    "request_id": "req_abc123"
  }
}
```

### Error Handling Middleware (Express)

```javascript
// middleware/errorHandler.js
function errorHandler(err, req, res, next) {
  // Log error
  logger.error({
    message: err.message,
    stack: err.stack,
    request_id: req.id,
    path: req.path,
    method: req.method
  });

  // Determine status code
  const statusCode = err.statusCode || 500;

  // Send response
  res.status(statusCode).json({
    error: {
      code: err.code || 'INTERNAL_ERROR',
      message: err.message || 'Une erreur est survenue',
      details: err.details || {},
      timestamp: new Date().toISOString(),
      request_id: req.id
    }
  });
}

// Usage
app.use(errorHandler);
```

### Erreurs Personnalisées

```javascript
// errors/CourseNotFoundError.js
class CourseNotFoundError extends Error {
  constructor(courseCode, suggestions = []) {
    super(`Le cours '${courseCode}' n'existe pas`);
    this.name = 'CourseNotFoundError';
    this.code = 'COURSE_NOT_FOUND';
    this.statusCode = 404;
    this.details = {
      requested_code: courseCode,
      suggestions
    };
  }
}

// Usage dans un controller
const course = await CourseService.findByCode(code);
if (!course) {
  const suggestions = await CourseService.findSimilar(code);
  throw new CourseNotFoundError(code, suggestions);
}
```

### Circuit Breaker (API Planifium)

```javascript
const CircuitBreaker = require('opossum');

const options = {
  timeout: 5000, // 5s timeout
  errorThresholdPercentage: 50, // Open if >50% fail
  resetTimeout: 30000 // Try again after 30s
};

const breaker = new CircuitBreaker(fetchPlanifiumData, options);

// Fallback strategy
breaker.fallback(() => {
  logger.warn('Circuit breaker opened, using cached data');
  return getCachedData();
});

// Monitoring
breaker.on('open', () => {
  alertAdmin('⚠️ API Planifium circuit breaker opened!');
});

breaker.on('halfOpen', () => {
  logger.info('Circuit breaker half-open, testing connection');
});

breaker.on('close', () => {
  logger.info('✅ Circuit breaker closed, API restored');
});
```

### Retry Logic

```javascript
const retry = require('async-retry');

async function fetchWithRetry(url, options = {}) {
  return retry(
    async (bail) => {
      try {
        const response = await fetch(url, options);
        
        if (response.status === 404) {
          // Don't retry 404
          bail(new Error('Resource not found'));
          return;
        }
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        
        return response.json();
      } catch (error) {
        logger.warn(`Retry attempt failed: ${error.message}`);
        throw error;
      }
    },
    {
      retries: 3,
      factor: 2, // Exponential backoff
      minTimeout: 1000,
      maxTimeout: 5000,
      onRetry: (error, attempt) => {
        logger.info(`Retry attempt ${attempt}: ${error.message}`);
      }
    }
  );
}
```

### Gestion Erreurs Frontend (React)

```typescript
// ErrorBoundary.tsx
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log to monitoring service
    logger.error('React Error Boundary:', {
      error: error.toString(),
      errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-page">
          <h1>Une erreur est survenue</h1>
          <p>Veuillez rafraîchir la page ou réessayer plus tard.</p>
          <button onClick={() => window.location.reload()}>
            Rafraîchir
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Usage
<ErrorBoundary>
  <App />
</ErrorBoundary>
```

### Validation Errors

```javascript
// Validation avec Zod
const CourseSchema = z.object({
  code: z.string().regex(/^[A-Z]{3}\d{4}$/, {
    message: "Format invalide. Attendu: IFT2255"
  }),
  credits: z.number().int().min(1).max(10, {
    message: "Crédits doivent être entre 1 et 10"
  })
});

// Controller
try {
  const validatedData = CourseSchema.parse(req.body);
  // Process...
} catch (error) {
  if (error instanceof z.ZodError) {
    return res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Données invalides',
        details: error.errors
      }
    });
  }
  throw error;
}
```

---

## Monitoring et Observabilité

### Métriques à Surveiller

#### Application Metrics (RED)

- **Rate** : Requêtes par seconde
- **Errors** : Taux d'erreur (%)
- **Duration** : Latence (p50, p95, p99)

#### Infrastructure Metrics (USE)

- **Utilization** : CPU, RAM, Disk
- **Saturation** : Queue depth, connection pool
- **Errors** : Erreurs système, timeouts

### Stack de Monitoring

```
Application
    ↓ (logs, metrics, traces)
Prometheus (métriques)
    ↓
Grafana (dashboards)
    ↓
Alertmanager (alertes)
    ↓
Email/Slack/Discord
```

### Dashboards Clés

**Dashboard API**
- Requêtes/s par endpoint
- Latence moyenne et percentiles
- Taux d'erreur 4xx/5xx
- Top endpoints lents

**Dashboard Database**
- Connexions actives
- Queries/s
- Slow queries (>1s)
- Cache hit ratio

**Dashboard Business**
- Utilisateurs actifs
- Cours les plus consultés
- Avis soumis (tendance)
- Taux de conversion recherche→détails

---

## Plan de Tests

### Stratégie de Test

```
                    Tests End-to-End (5%)
                           ↑
                  Tests d'Intégration (15%)
                           ↑
                    Tests Unitaires (80%)
```

### Types de Tests

#### 1. Tests Unitaires (80% couverture)

**Backend**
```javascript
// tests/services/course.service.test.js
describe('CourseService', () => {
  it('should find course by code', async () => {
    const course = await CourseService.findByCode('IFT2255');
    expect(course).toBeDefined();
    expect(course.code).toBe('IFT2255');
  });
  
  it('should throw error if course not found', async () => {
    await expect(
      CourseService.findByCode('INVALID')
    ).rejects.toThrow('Course not found');
  });
});
```

**Frontend**
```javascript
// tests/components/SearchBar.test.tsx
describe('SearchBar', () => {
  it('should render search input', () => {
    render(<SearchBar />);
    expect(screen.getByPlaceholderText(/rechercher/i)).toBeInTheDocument();
  });
  
  it('should call onSearch when submitted', () => {
    const mockSearch = jest.fn();
    render(<SearchBar onSearch={mockSearch} />);
    
    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'IFT2255' }
    });
    fireEvent.submit(screen.getByRole('form'));
    
    expect(mockSearch).toHaveBeenCalledWith('IFT2255');
  });
});
```

#### 2. Tests d'Intégration

```javascript
// tests/integration/api.test.js
describe('API Integration', () => {
  it('should search and retrieve course details', async () => {
    // Search
    const searchRes = await request(app)
      .get('/api/v1/recherche?q=IFT2255')
      .expect(200);
    
    expect(searchRes.body.data).toHaveLength(1);
    const courseCode = searchRes.body.data[0].code;
    
    // Get details
    const detailsRes = await request(app)
      .get(`/api/v1/cours/${courseCode}`)
      .expect(200);
    
    expect(detailsRes.body.code).toBe('IFT2255');
  });
});
```

#### 3. Tests E2E (Playwright/Cypress)

```javascript
// tests/e2e/search-flow.spec.js
test('complete search and compare flow', async ({ page }) => {
  await page.goto('/');
  
  // Search
  await page.fill('[data-testid="search-input"]', 'IFT');
  await page.click('[data-testid="search-button"]');
  
  // Wait for results
  await page.waitForSelector('[data-testid="course-card"]');
  
  // Add to comparison
  await page.click('[data-testid="add-to-compare-IFT2255"]');
  await page.click('[data-testid="add-to-compare-IFT3000"]');
  
  // Go to comparison
  await page.click('[data-testid="compare-button"]');
  
  // Verify comparison page
  await expect(page.locator('[data-testid="comparison-table"]')).toBeVisible();
  await expect(page.locator('td:has-text("IFT2255")')).toBeVisible();
});
```

#### 4. Tests de Charge (k6)

```javascript
// tests/load/api-load.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '2m', target: 100 }, // Ramp up
    { duration: '5m', target: 100 }, // Sustained load
    { duration: '2m', target: 0 },   // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'], // 95% < 2s
    http_req_failed: ['rate<0.01'],    // <1% errors
  },
};

export default function () {
  const res = http.get('https://api.example.com/api/v1/cours/IFT2255');
  
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 2s': (r) => r.timings.duration < 2000,
  });
  
  sleep(1);
}
```

---

## Livrables de Conception

### Phase 1 (Analyse)

- ✅ Architecture C4 Niveau 1 (Contexte)
- ✅ Architecture C4 Niveau 2 (Conteneurs)
- ✅ Diagrammes de flux de données
- ✅ Modèle de données relationnel
- ✅ Décisions d'architecture documentées
- ✅ Stack technologique définie

### Phase 2+ (Implémentation Future)

- 🔜 Architecture C4 Niveau 3 (Composants)
- 🔜 Diagrammes de séquence détaillés
- 🔜 Diagrammes de déploiement
- 🔜 API documentation complète (OpenAPI/Swagger)
- 🔜 Guide de contribution développeurs

---

## Estimation des Coûts et Infrastructure

### Phase 1 - Développement (Gratuit)

| Ressource | Service | Coût |
|-----------|---------|------|
| **Hébergement Backend** | Render.com Free Tier | 0$ |
| **Base de Données** | Supabase Free / Railway | 0$ |
| **Frontend** | Vercel/Netlify | 0$ |
| **Redis** | Upstash Free | 0$ |
| **Monitoring** | Grafana Cloud Free | 0$ |
| **Total Phase 1** | | **0$/mois** |

**Limitations Free Tier**
- 512MB RAM par instance
- 750h compute/mois (suffisant pour 1 instance)
- 500MB PostgreSQL
- 10K requests/jour Redis
- Pas de SLA garantie

---

### Phase 2 - Production (Estimé)

| Ressource | Service | Coût Mensuel |
|-----------|---------|--------------|
| **Compute (2 instances)** | AWS EC2 t3.small × 2 | 30$ |
| **Database** | AWS RDS PostgreSQL db.t3.micro | 15$ |
| **Redis Cache** | AWS ElastiCache t3.micro | 12$ |
| **Load Balancer** | AWS ALB | 20$ |
| **CDN** | Cloudflare Pro | 20$ |
| **Stockage** | AWS S3 (50GB) | 1$ |
| **Monitoring** | Datadog Basic | 15$ |
| **Total Phase 2** | | **~113$/mois** |

**Caractéristiques**
- Support 1000+ utilisateurs simultanés
- 99.9% uptime SLA
- Backup automatique
- Monitoring complet
- Scaling manuel

---

### Alternative Low-Cost (Phase 2)

| Ressource | Service | Coût Mensuel |
|-----------|---------|--------------|
| **All-in-One** | Hetzner Cloud CX21 | 10€ (~12$) |
| **Backups** | Hetzner Backup | 2€ (~2.5$) |
| **CDN** | Cloudflare Free | 0$ |
| **Monitoring** | Self-hosted (Grafana) | 0$ |
| **Total Alternative** | | **~15$/mois** |

**Configuration Hetzner CX21**
- 2 vCPU
- 4 GB RAM
- 40 GB SSD
- 20 TB traffic
- Docker + Docker Compose

**Déploiement sur serveur unique**
```yaml
# docker-compose.yml
version: '3.8'
services:
  frontend:
    image: nginx:alpine
    volumes:
      - ./dist:/usr/share/nginx/html
    ports:
      - "80:80"
      - "443:443"
  
  backend:
    image: node:18-alpine
    volumes:
      - ./api:/app
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/courses
      - REDIS_URL=redis://cache:6379
  
  db:
    image: postgres:15-alpine
    volumes:
      - pgdata:/var/lib/postgresql/data
  
  cache:
    image: redis:7-alpine
    volumes:
      - redisdata:/data
```

---

### Scaling Strategy

```mermaid
graph TB
    subgraph "Phase 1: Free (0-100 users)"
    F1[Render Free<br/>512MB RAM]
    end
    
    subgraph "Phase 2: Starter (100-500 users)"
    F2[Hetzner CX21<br/>4GB RAM<br/>15$/mois]
    end
    
    subgraph "Phase 3: Growth (500-2000 users)"
    F3A[AWS t3.small × 2<br/>+ RDS + ElastiCache<br/>100$/mois]
    end
    
    subgraph "Phase 4: Scale (2000+ users)"
    F4A[Auto-scaling<br/>Load Balancer]
    F4B[CDN Global]
    F4C[Multi-region DB]
    F4D[300-500$/mois]
    end
    
    F1 -->|Growth| F2
    F2 -->|Growth| F3A
    F3A -->|Growth| F4A
    F4A --> F4B
    F4A --> F4C
```

---

### Comparaison des Options

| Critère | Free Tier | Hetzner | AWS Managed |
|---------|-----------|---------|-------------|
| **Coût** | 0$ | 15$/mois | 113$/mois |
| **Setup** | ⚠️ Simple mais limité | ✅ Flexible | ✅ Automated |
| **Scaling** | ❌ Limité | ⚠️ Manuel | ✅ Auto |
| **Maintenance** | ⚠️ Self | ⚠️ Self | ✅ Managed |
| **SLA** | ❌ Aucun | ⚠️ 99% | ✅ 99.9% |
| **Support** | ❌ Community | ⚠️ Email | ✅ 24/7 |
| **Backup** | ❌ Manual | ✅ Automated | ✅ Automated |
| **Monitoring** | ⚠️ Basic | ⚠️ Self-hosted | ✅ Integrated |

### Recommandation par Phase

**Phase 1 (Développement/POC)** : Free Tier
- Coût: 0$
- Idéal pour : Validation concept, démo, tests
- Limitations acceptables

**Phase 2 (MVP Production)** : Hetzner
- Coût: 15$/mois
- Idéal pour : Lancement initial, budget étudiant
- Performance suffisante (<1000 users)

**Phase 3 (Croissance)** : AWS/GCP Managed
- Coût: 100-300$/mois
- Idéal pour : Scaling, SLA requis, multi-région
- Infrastructure professionnelle

---

## Évolutions Futures

### Roadmap Technique

#### Court Terme (3-6 mois)

1. **Personnalisation Avancée**
   - Système de recommandations par ML
   - Profils étudiants enrichis
   - Historique de cours

2. **Fonctionnalités Sociales**
   - Groupes d'étude
   - Forums de discussion par cours
   - Mentoring étudiant

3. **Notifications**
   - Alertes disponibilité de cours
   - Rappels dates importantes
   - Nouveaux avis publiés

#### Moyen Terme (6-12 mois)

1. **Application Mobile Native**
   - React Native ou Flutter
   - Notifications push
   - Mode offline

2. **Intégration Campus**
   - SSO UdeM (CAS)
   - Import dossier étudiant
   - Synchronisation horaire personnel

3. **Analytics Avancés**
   - Prédiction de réussite
   - Analyse de parcours optimal
   - Tendances de popularité

#### Long Terme (1-2 ans)

1. **IA et Machine Learning**
   - Chatbot assistant intelligent
   - Détection de plagiat dans avis
   - Génération de résumés automatiques

2. **Extension Multi-Départements**
   - Au-delà du DIRO
   - Toutes les facultés UdeM
   - Autres universités québécoises

3. **API Publique**
   - Plateforme pour développeurs tiers
   - Widgets intégrables
   - Marketplace d'extensions

---

## Checklist Pre-Production

### Sécurité ✅

- [ ] **HTTPS obligatoire** (certificat SSL/TLS configuré)
- [ ] **Variables d'environnement sécurisées** (pas de secrets dans code)
- [ ] **Headers de sécurité** (Helmet.js configuré : CSP, HSTS, X-Frame-Options)
- [ ] **Rate limiting activé** (1000 req/h par user)
- [ ] **Validation stricte des entrées** (Zod/Joi sur toutes entrées utilisateur)
- [ ] **Logs ne contiennent pas de données sensibles** (pas de passwords, tokens)
- [ ] **Conformité Loi 25 validée** (anonymisation, consentement, RGPD)
- [ ] **JWT secrets** robustes (256+ bits, rotation planifiée)
- [ ] **CORS configuré** (whitelist origins autorisées)
- [ ] **SQL injection prevention** (parameterized queries uniquement)

### Performance ✅

- [ ] **Cache Redis configuré et testé** (TTL appropriés, hit rate >70%)
- [ ] **Index de base de données optimisés** (EXPLAIN ANALYZE validé)
- [ ] **Compression Gzip/Brotli activée** (assets, API responses)
- [ ] **CDN configuré pour assets statiques** (images, JS, CSS)
- [ ] **Images optimisées** (WebP, compression, lazy loading)
- [ ] **Code splitting** (bundles <200KB par chunk)
- [ ] **Load testing effectué** (k6, >1000 users simultanés)
- [ ] **Database connection pooling** (max connections configuré)
- [ ] **Query optimization** (N+1 queries éliminés)
- [ ] **Pagination implémentée** (pas de queries illimitées)

### Monitoring ✅

- [ ] **Health checks configurés** (`/health`, `/ready` endpoints)
- [ ] **Logs centralisés** (ELK, Loki, ou CloudWatch)
- [ ] **Métriques Prometheus exposées** (`/metrics` endpoint)
- [ ] **Dashboards Grafana créés** (API, DB, Business metrics)
- [ ] **Alertes configurées** (email/Slack pour erreurs critiques)
- [ ] **Uptime monitoring actif** (UptimeRobot, Pingdom)
- [ ] **Error tracking** (Sentry, Rollbar configuré)
- [ ] **APM configuré** (New Relic, Datadog - optionnel)
- [ ] **Structured logging** (JSON format, correlation IDs)
- [ ] **Log retention policy** (90 jours minimum)

### Backup & Recovery ✅

- [ ] **Backup automatique DB** (quotidien, rétention 30 jours)
- [ ] **Test de restauration effectué** (validé dernière semaine)
- [ ] **Plan de disaster recovery documenté** (RTO, RPO définis)
- [ ] **RTO/RPO définis et validés** (RTO: 4h, RPO: 6h)
- [ ] **Backup storage séparé** (différent du serveur principal)
- [ ] **Backup encryption** (AES-256 pour données sensibles)
- [ ] **Backup monitoring** (alertes si échec)
- [ ] **Point-in-time recovery** (WAL archiving configuré)

### Documentation ✅

- [ ] **README.md complet** (installation, usage, troubleshooting)
- [ ] **API documentation** (Swagger/OpenAPI exposée)
- [ ] **Guide de déploiement** (step-by-step pour production)
- [ ] **Runbook pour incidents** (procédures d'urgence)
- [ ] **Changelog maintenu** (versions, breaking changes)
- [ ] **Architecture diagrams** (C4, diagrammes à jour)
- [ ] **Environment variables documentées** (fichier .env.example)
- [ ] **Contributing guide** (pour futurs développeurs)
- [ ] **Security policy** (SECURITY.md, responsible disclosure)

### Tests ✅

- [ ] **Tests unitaires >80% couverture** (vérifié par coverage report)
- [ ] **Tests d'intégration passent** (API endpoints testés)
- [ ] **Tests E2E (scénarios critiques)** (Playwright/Cypress)
- [ ] **Tests de charge validés** (k6 scenarios passent)
- [ ] **Tests de régression** (non-régression des features)
- [ ] **Tests de sécurité** (OWASP Top 10 vérifié)
- [ ] **Performance tests** (temps réponse < seuils définis)
- [ ] **CI/CD pipeline** (tests auto sur chaque PR)

### Déploiement ✅

- [ ] **CI/CD configuré** (GitHub Actions, GitLab CI)
- [ ] **Environnements séparés** (dev, staging, production)
- [ ] **Blue-green ou canary deployment** (zero-downtime)
- [ ] **Rollback procedure** (plan de retour arrière testé)
- [ ] **Database migrations** (Prisma Migrate, Flyway testées)
- [ ] **Secrets management** (AWS Secrets, Vault, ou équivalent)
- [ ] **Infrastructure as Code** (Terraform, CloudFormation - optionnel)
- [ ] **Container images scannés** (vulnérabilités vérifiées)
- [ ] **Deployment checklist** (étapes documentées)
- [ ] **Post-deployment verification** (smoke tests automatisés)

### Legal & Compliance ✅

- [ ] **Politique de confidentialité** (accessible sur site)
- [ ] **Conditions d'utilisation** (Terms of Service)
- [ ] **Consentement explicite** (pour collecte données)
- [ ] **Conformité Loi 25** (audit effectué)
- [ ] **RGPD compliance** (si users EU)
- [ ] **Droit à l'oubli** (procédure de suppression données)
- [ ] **Data retention policy** (durées définies et documentées)
- [ ] **Cookie policy** (si cookies utilisés)
- [ ] **Accessibility** (WCAG 2.1 AA minimum)

### Post-Launch ✅

- [ ] **Monitoring actif** (24/7 durant première semaine)
- [ ] **Incident response plan** (équipe on-call définie)
- [ ] **User feedback** (canal de communication établi)
- [ ] **Performance baseline** (métriques de référence enregistrées)
- [ ] **Capacity planning** (prévisions croissance)
- [ ] **Security audit** (scan vulnérabilités post-launch)
- [ ] **User onboarding** (tutoriels, documentation utilisateur)
- [ ] **Support channel** (email, Discord, ou forum)

---

### Timeline de Vérification

**1 semaine avant launch** : Sécurité + Performance  
**3 jours avant launch** : Monitoring + Backup  
**1 jour avant launch** : Tests + Documentation  
**Jour du launch** : Déploiement + Post-Launch  

---

## Conclusion

Cette architecture modulaire, scalable et sécurisée fournit une base solide pour la **Phase 1 (Analyse)** du projet. Les décisions prises privilégient :

- ✅ **Simplicité** : Monolithe modulaire facile à développer
- ✅ **Performance** : Cache multi-niveaux, indexes optimisés
- ✅ **Sécurité** : Conformité Loi 25, authentification robuste
- ✅ **Maintenabilité** : Code propre, documentation complète
- ✅ **Évolutivité** : Architecture cloud-ready, patterns scalables

L'architecture est conçue pour évoluer graduellement vers des microservices si nécessaire, tout en restant pragmatique pour les contraintes actuelles (équipe, délais, ressources).

---

[← Cas d'Utilisation](cas-utilisation.md) | [Retour à l'accueil](index.md)

