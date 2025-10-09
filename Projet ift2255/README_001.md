# Plateforme de Choix de Cours - UdeM

## Description du Projet

Cette plateforme web aide les étudiants de l'Université de Montréal à faire des choix de cours éclairés en combinant des données officielles (API Planifium, résultats académiques) et des avis étudiants collectés via Discord.

## Équipe

- **Nom complet** : [À compléter]
- **Matricule** : [À compléter] 
- **Username Discord** : [À compléter]

## Organisation du Répertoire

```
devoir-1-ift2255/
├── docs/                    # Documentation MkDocs
│   ├── index.md            # Page d'accueil
│   ├── cadre-projet.md     # Cadre du projet
│   ├── analyse-exigences.md # Analyse des exigences
│   ├── cas-utilisation.md  # Cas d'utilisation
│   ├── conception.md       # Modèle C4 et architecture
│   └── images/             # Diagrammes et images
├── prototype/              # Code du prototype (bonus)
├── mkdocs.yml             # Configuration MkDocs
├── requirements.txt       # Dépendances Python
└── README.md              # Ce fichier
```

## Installation et Utilisation

### Prérequis
- Python 3.8+
- MkDocs
- Git

### Installation
```bash
pip install -r requirements.txt
```

### Génération du rapport
```bash
mkdocs serve
```

## Fonctionnalités Principales

- **Recherche de cours** : Par code, titre ou mots-clés
- **Comparaison de cours** : Estimation de la charge de travail
- **Avis étudiants** : Agrégation des retours d'expérience
- **Résultats académiques** : Moyennes et statistiques
- **Personnalisation** : Profil étudiant adaptatif

## Sources de Données

- **API Planifium** : Catalogue officiel des cours et programmes
- **Résultats académiques** : Données agrégées (CSV)
- **Avis Discord** : Retours d'expérience étudiants (JSON)

## Échéances

- **26 septembre** : Compréhension du domaine + ébauche CU
- **10 octobre** : Remise finale

## Licence

Projet académique - IFT2255
