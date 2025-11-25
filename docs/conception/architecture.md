---
title: Conception - Architecture
---

# Architecture du système

## Vue d’ensemble

- Description du type d’architecture retenue (ex. : monolithique, microservices, REST...)
- Raisons du choix

## Composants principaux

- Liste des modules ou services :
  - Module d’authentification
  - Gestion des utilisateurs
  - Interface (frontend)
  - API backend

## Communication entre composants

- Mécanismes d’échange : appels HTTP, WebSocket, messages, etc.
- Format des données : JSON, XML, etc.

## Diagramme d’architecture (Modèle C4)
graph TB
    subgraph Frontend
        MANHARGS[manhargs<br/>Application Client]
    end
    
    subgraph Backend
        APP[App<br/>Contrôleur Principal]
        
        subgraph Module Utilisateurs
            AUTH[Authentification]
            USER[Utilisateur]
            ETUD[Etudiant]
            TECH[Technicien]
        end
        
        subgraph Module Cours
            COURS[Cours]
            COMP[Comparaison]
        end
        
        subgraph Module Évaluations
            AVIS[Avis]
        end
        
        subgraph Module Intégration
            DISC[BedDiscord]
        end
        
        subgraph Persistance
            DB[(Base de données)]
        end
    end
    
    %% Connexions
    MANHARGS --> APP
    APP --> AUTH
    APP --> USER
    APP --> ETUD
    APP --> TECH
    APP --> COURS
    APP --> COMP
    APP --> AVIS
    APP --> DISC
    
    %% Relations internes
    USER --> DB
    COURS --> DB
    AVIS --> DB
    ETUD --> AVIS
    COURS --> AVIS
    COMP --> COURS
    
    %% Styles
    classDef frontend fill:#e1f5fe
    classDef backend fill:#f3e5f5
    classDef module fill:#e8f5e8
    classDef data fill:#fff3e0
    
    class MANHARGS frontend
    class APP,USER,COURS,AVIS,COMP,DISC backend
    class AUTH,ETUD,TECH module
    class DB data
