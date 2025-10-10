# Instructions de Remise - Devoir 1 IFT2255

## 📋 Résumé du Projet

Ce projet présente l'analyse complète d'une **plateforme web de choix de cours** pour les étudiants de l'Université de Montréal. Tous les livrables requis ont été créés et sont prêts pour la remise.

## 📁 Structure du Projet

```
devoir-1-ift2255/
├── README.md                    # Description générale du projet
├── requirements.txt             # Dépendances Python pour MkDocs
├── mkdocs.yml                  # Configuration MkDocs
├── INSTRUCTIONS.md             # Ce fichier - instructions de remise
├── docs/                       # Documentation source
│   ├── index.md               # Page d'accueil
│   ├── cadre-projet.md        # Cadre du projet
│   ├── analyse-exigences.md   # Analyse des exigences
│   ├── cas-utilisation.md     # Cas d'utilisation
│   └── conception.md          # Conception et architecture
├── prototype/                  # Prototype interactif (BONUS)
│   ├── index.html             # Interface web
│   ├── script.js              # Logique JavaScript
│   └── README.md              # Documentation du prototype
└── site/                      # Rapport HTML généré (auto-généré)
    └── index.html             # Rapport final
```

## 🎯 Livrables Complétés

### ✅ Cadre du Projet
- **Description** : Problématique et solution clairement définies
- **Équipe** : Structure prête (à compléter avec vos informations)
- **Échéancier** : Planification détaillée des tâches
- **Objectifs** : Principaux et secondaires identifiés
- **Contraintes** : Techniques, légales et temporelles

### ✅ Analyse des Exigences
- **Description du domaine** : Acteurs, fonctionnement, dépendances
- **Hypothèses** : Techniques, fonctionnelles et métier
- **Glossaire** : 15+ termes clés définis
- **Risques** : 5 risques identifiés avec solutions de mitigation
- **Besoins non fonctionnels** : 5 caractéristiques avec justifications
- **Besoins matériels** : Infrastructure et solutions de stockage
- **Solution d'intégration** : API REST et monitoring

### ✅ Cas d'Utilisation
- **Diagramme de CU** : Vue d'ensemble avec Mermaid
- **9 cas d'utilisation** détaillés avec :
  - Acteurs, préconditions, postconditions
  - Déclencheurs, dépendances et buts
  - Scénarios principaux et alternatifs
- **Matrice de traçabilité** : Lien besoins ↔ cas d'utilisation

### ✅ Conception
- **Diagrammes d'activités** : 3 flux principaux (Mermaid)
- **Modèle C4** :
  - Niveau 1 : Diagramme de contexte
  - Niveau 2 : Diagramme de conteneurs
- **Architecture technique** : Stack technologique détaillé
- **Décisions architecturales** : 5 décisions justifiées

### ✅ Prototype Interactif (BONUS +5%)
- **Interface web complète** : HTML/CSS/JavaScript
- **5 cas d'utilisation** implémentés et fonctionnels
- **Données simulées** : 4 cours avec avis et statistiques
- **Fonctionnalités** : Recherche, comparaison, profil, détails

## 🚀 Comment Utiliser le Projet

### 1. Consulter le Rapport HTML
```bash
cd "/Users/diallobouba/Documents/devoir 1 ift2255"
python3 -m mkdocs serve
# Ouvrir http://127.0.0.1:8000
```

### 2. Tester le Prototype
```bash
cd "/Users/diallobouba/Documents/devoir 1 ift2255/prototype"
# Ouvrir index.html dans un navigateur
# Ou utiliser un serveur local :
python3 -m http.server 8001
```

### 3. Générer le Rapport Final
```bash
cd "/Users/diallobouba/Documents/devoir 1 ift2255"
python3 -m mkdocs build
# Le rapport est dans le dossier site/
```

## 📝 Informations à Compléter

### Équipe (dans docs/cadre-projet.md)
```markdown
| Membre | Nom Complet | Matricule | Username Discord |
|--------|-------------|-----------|------------------|
| 1 | Mamadou Traore | 20290120 | Dady |
```

### Repository GitHub
1. Créer un repository GitHub
2. Ajouter tous les fichiers
3. Créer une release pour la remise
4. Mettre à jour le README.md avec l'URL du repository

## 🎯 Points Forts du Projet

### ✅ Conformité aux Exigences
- **Tous les livrables** requis sont présents
- **Qualité professionnelle** : Documentation structurée et complète
- **Diagrammes Mermaid** : Intégrés et fonctionnels
- **Prototype fonctionnel** : Démonstration interactive

### ✅ Analyse Approfondie
- **Risques identifiés** : 5 risques avec solutions concrètes
- **Architecture détaillée** : Modèle C4 complet
- **Cas d'utilisation** : 9 CU avec scénarios détaillés
- **Besoins non fonctionnels** : 5 caractéristiques justifiées

### ✅ Innovation et Bonus
- **Prototype interactif** : Interface web moderne et fonctionnelle
- **Données réalistes** : Simulation fidèle du domaine
- **UX soignée** : Interface intuitive et responsive
- **Documentation complète** : README détaillé pour le prototype

## 📊 Évaluation Attendue

### Barème (100% + 5% bonus)
- **Compréhension du domaine** : 15% ✅
- **Analyse des besoins et risques** : 20% ✅
- **Cas d'utilisation** : 20% ✅
- **Description des flux principaux** : 20% ✅
- **Modèle C4** : 15% ✅
- **Git (GitHub)** : 5% ⏳ (à compléter)
- **Rapport (documentation)** : 5% ✅
- **Bonus prototype** : 5% ✅

## 🔧 Commandes Utiles

### Développement
```bash
# Installer les dépendances
python3 -m pip install -r requirements.txt

# Servir le rapport en mode développement
python3 -m mkdocs serve

# Construire le rapport final
python3 -m mkdocs build

# Nettoyer le site généré
rm -rf site/
```

### Git
```bash
# Initialiser le repository
git init
git add .
git commit -m "Initial commit - Devoir 1 IFT2255"

# Créer une release
git tag -a v1.0 -m "Remise finale - Devoir 1"
git push origin v1.0
```

## 📞 Support

Si vous avez des questions sur le projet :

1. **Documentation** : Consultez les README dans chaque dossier
2. **Prototype** : Testez l'interface pour comprendre les fonctionnalités
3. **Rapport** : Utilisez `mkdocs serve` pour la navigation interactive

## 🎉 Félicitations !

Vous avez maintenant un projet complet et professionnel qui répond à toutes les exigences du devoir, avec un bonus de prototype interactif qui démontre concrètement les fonctionnalités proposées.

**Bonne chance pour la remise !** 🚀
