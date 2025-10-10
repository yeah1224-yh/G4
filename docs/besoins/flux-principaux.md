---
title: Description des flux principaux
---

# Flux Principaux du Système

## Flux Principal - Recherche et Consultation de Cours

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

### Description du flux

1. **Authentification** : L'étudiant s'authentifie avec ses identifiants UdeM
2. **Recherche** : L'étudiant saisit ses critères de recherche (code, titre, programme)
3. **Validation** : Le système valide les critères et effectue la recherche
4. **Résultats** : Le système affiche les cours correspondants sous forme de cartes
5. **Consultation** : L'étudiant sélectionne un cours pour voir les détails
6. **Informations** : Le système affiche toutes les informations du cours
7. **Avis** : Si disponibles, les avis étudiants agrégés sont affichés
8. **Éligibilité** : Le système vérifie si l'étudiant peut s'inscrire
9. **Comparaison** : L'étudiant peut ajouter le cours à la comparaison

## Flux de Collecte d'Avis

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

### Description du flux

1. **Partage** : Un étudiant partage son avis sur un cours via Discord
2. **Détection** : Le bot Discord détecte le message contenant un avis
3. **Extraction** : Le bot extrait les informations structurées (code cours, note, commentaire)
4. **Validation** : Le système valide que l'avis respecte le format requis
5. **Stockage** : L'avis valide est stocké dans la base de données
6. **Agrégation** : Le système calcule les statistiques agrégées
7. **Seuil** : Si le seuil minimal (n≥5) est atteint, les avis deviennent visibles
8. **Affichage** : Les avis sont désormais consultables par les étudiants

## Flux de Synchronisation des Données

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

### Description du flux

1. **Déclenchement** : Synchronisation programmée ou manuelle
2. **Connexion** : Le système se connecte à l'API Planifium
3. **Récupération** : Téléchargement des données de cours mises à jour
4. **Comparaison** : Le système compare avec les données locales
5. **Identification** : Détection des cours modifiés, ajoutés ou supprimés
6. **Mise à jour** : Application des changements dans la base locale
7. **Validation** : Vérification de l'intégrité des données
8. **Log** : Enregistrement des modifications pour traçabilité

## Flux de Comparaison de Cours

```mermaid
flowchart TD
    A[Étudiant consulte un cours] --> B{Ajouter à comparaison?}
    B -->|Non| C[Retour à la recherche]
    B -->|Oui| D{Nombre de cours < 3?}
    D -->|Non| E[Message: Maximum atteint]
    D -->|Oui| F[Ajout du cours]
    E --> G[Retirer un cours]
    G --> F
    F --> H{Ajouter un autre cours?}
    H -->|Oui| A
    H -->|Non| I[Accéder au tableau comparatif]
    I --> J[Génération du tableau]
    J --> K[Affichage des critères]
    K --> L{Action?}
    L -->|Exporter| M[Export PDF/CSV]
    L -->|Modifier| N[Retirer un cours]
    L -->|Terminer| C
    N --> F
```

### Description du flux

1. **Sélection** : L'étudiant ajoute un cours à la comparaison
2. **Vérification** : Le système vérifie la limite (max 3 cours)
3. **Ajout** : Le cours est ajouté à la liste de comparaison
4. **Tableau** : L'étudiant accède au tableau comparatif
5. **Génération** : Le système génère le tableau avec tous les critères
6. **Actions** : L'étudiant peut exporter, modifier ou terminer

