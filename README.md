# 🎓 Plateforme de Choix de Cours - UdeM

## 📋 Description du Projet

Cette plateforme web vise à aider les étudiants de l'Université de Montréal (particulièrement au DIRO) à faire des choix de cours éclairés en combinant :

- 📊 **Données officielles** : API Planifium, résultats académiques agrégés
- 💬 **Avis étudiants** : Retours d'expérience collectés via Discord
- 🎯 **Personnalisation** : Recommandations selon le profil étudiant

Le projet répond à un besoin clair : centraliser des informations dispersées pour faciliter la prise de décision académique.

## 👥 Équipe

| # | Nom Complet | Matricule | Discord | Rôle |
|---|-------------|-----------|---------|------|
| 1 | Thomas Racine | [MATRICULE] | Bab0uchka | Exigences & Risques |
| 2 | Boubacar Cederic Diallo | 20290623 | bouba_023 | Coordination & Analyse |
| 3 | Mahamadou Maiga | [MATRICULE] | YeaH | Cas d'Utilisation |
| 4 | Mamadou Traore | [MATRICULE] | Daddy007 | Architecture & Prototype |

**Responsable d'équipe** : Boubacar Cederic Diallo

## ✨ Fonctionnalités Principales

### Phase 1 (Analyse)

- 🔍 **Recherche intelligente** : Par code, titre, mots-clés avec filtres
- ⚖️ **Comparaison de cours** : Estimation de charge de travail combinée
- 💬 **Avis étudiants agrégés** : Seuil minimal (n≥5) pour fiabilité
- 📊 **Résultats académiques** : Moyennes, inscrits, taux d'échec
- 👤 **Personnalisation** : Profil étudiant adaptatif (théorie/pratique)
- 🔒 **Confidentialité** : Respect de la Loi 25 (Québec)

### Vision Future

- 🤖 Recommandations intelligentes par IA
- 📱 Application mobile native
- 🔔 Notifications de disponibilité de cours
- 📈 Analyse prédictive de réussite

## 🗂️ Structure du Projet

```
devoir-ift2255/
├── docs/                      # Documentation MkDocs
│   ├── index.md              # Page d'accueil
│   ├── cadre-projet.md       # Cadre et équipe
│   ├── analyse-exigences.md  # Analyse complète
│   ├── cas-utilisation.md    # CU détaillés
│   └── conception.md         # Architecture C4
├── prototype/                 # Code prototype (bonus)
│   ├── src/                  # Code source
│   ├── assets/               # Ressources (CSS, images)
│   └── data/                 # Données de test
├── diagrams/                  # Diagrammes UML et C4
│   ├── use-cases/            # Diagrammes de cas d'utilisation
│   ├── activities/           # Diagrammes d'activités
│   └── c4/                   # Modèles C4 (niveaux 1-2)
├── mkdocs.yml                # Configuration MkDocs
├── requirements.txt          # Dépendances Python
├── README.md                 # Ce fichier
└── .gitignore               # Fichiers ignorés par Git
```

## 🚀 Installation et Utilisation

### Prérequis

- Python 3.8+
- pip (gestionnaire de paquets Python)
- Git

### Installation

#### 1. Cloner le dépôt
```bash
git clone https://github.com/diallo23-cyber/devoir-ift2255.git
cd devoir-ift2255
```

#### 2. Installer les dépendances
```bash
pip install -r requirements.txt
```

#### 3. Lancer la documentation
```bash
mkdocs serve
```

#### 4. Accéder à la documentation
Ouvrir dans un navigateur : http://localhost:8000

#### 5. Générer le site statique
```bash
mkdocs build
```
Le site sera généré dans le dossier `site/`.

## 📚 Documentation

La documentation complète est disponible dans le dossier `docs/` et inclut :

- **Cadre du Projet** : Description, équipe, échéancier
- **Analyse des Exigences** : Domaine, risques, besoins
- **Cas d'Utilisation** : 5 CU détaillés avec scénarios
- **Conception** : Architecture C4 (niveaux 1-2)

## 🎯 Livrables Phase 1

- ✅ Rapport MkDocs complet (HTML)
- ✅ Analyse des exigences (fonctionnelles et non fonctionnelles)
- ✅ 5 cas d'utilisation détaillés
- ✅ Diagrammes UML (CU et activités)
- ✅ Modèle C4 (niveaux 1 et 2)
- ✅ Minimum 3 commits par membre
- ✅ Release v1.0 sur GitHub
- 🎁 **Bonus** : Prototype interactif démonstratif

## 🛠️ Technologies Utilisées

### Documentation
- **MkDocs** : Générateur de documentation statique
- **Material for MkDocs** : Thème moderne et responsive
- **Markdown** : Langage de balisage léger

### Prototype (Bonus)
- **HTML/CSS/JavaScript** : Frontend interactif
- **JSON** : Format de données pour les avis
- **CSV** : Résultats académiques

### Outils
- **Git/GitHub** : Versioning et collaboration
- **PlantUML** : Diagrammes UML
- **Draw.io** : Modèles C4

## 📊 Sources de Données

| Source | Type | Description |
|--------|------|-------------|
| API Planifium | REST API | Catalogue cours, programmes, horaires |
| Résultats académiques | CSV | Moyennes, inscrits, échecs par session |
| Avis étudiants | JSON | Retours Discord (difficulté, charge) |

## 🔗 Liens Utiles

- 📖 [Documentation Planifium](https://github.com/udem-diro/planifium)
- 📘 Énoncé du projet
- 💬 Discord de l'équipe
- 🎓 Cours IFT 2255

## 📅 Jalons du Projet

| Date | Jalon | Statut |
|------|-------|--------|
| 26 sept | Ébauche (domaine + CU) | ✅ |
| 2 oct | Analyse des exigences | ⏳ |
| 5 oct | Cas d'utilisation détaillés | ⏳ |
| 8 oct | Architecture C4 | ⏳ |
| 10 oct | Remise finale | ⏳ |

## 🤝 Contribution

### Workflow Git

1. **Créer une branche** : `git checkout -b feature/nom-feature`
2. **Faire des commits clairs** : `git commit -m "feat: description"`
3. **Pousser** : `git push origin feature/nom-feature`
4. **Créer une Pull Request**

### Conventions

- **Commits** : Format conventionnel (`feat:`, `fix:`, `docs:`)
- **Branches** : `feature/`, `fix/`, `docs/`
- **Code** : Commentaires en français, variables en anglais

## 📄 Licence

Ce projet est réalisé dans le cadre du cours IFT 2255 - Génie Logiciel à l'Université de Montréal.

## 📞 Contact

Pour toute question sur le projet :

- **Discord** : Serveur IFT 2255
- **Email** : boubacar.cederic.diallo@umontreal.ca