# Images et Diagrammes

Ce dossier contient les images, diagrammes et assets visuels du projet.

## Contenu Suggéré

### Diagrammes UML
- `c4-niveau1-contexte.png` - Diagramme de contexte système
- `c4-niveau2-conteneurs.png` - Architecture des conteneurs
- `diagramme-cas-utilisation.png` - Diagramme des cas d'utilisation
- `diagramme-activites.png` - Flux d'activités principal

### Mockups / Wireframes
- `mockup-recherche.png` - Interface de recherche
- `mockup-details-cours.png` - Page détails d'un cours
- `mockup-comparaison.png` - Vue comparaison de cours
- `mockup-avis.png` - Section avis étudiants

### Logos / Branding
- `logo-projet.png` - Logo de la plateforme
- `logo-udem.png` - Logo Université de Montréal
- `icon-app.png` - Icône de l'application

### Captures d'écran
- `screenshot-dashboard.png` - Tableau de bord
- `screenshot-mobile.png` - Version mobile

## Export des Diagrammes

Les diagrammes PlantUML et Mermaid peuvent être exportés depuis la documentation :

### PlantUML
```bash
# Installer PlantUML
brew install plantuml

# Générer les images
plantuml docs/**/*.puml
```

### Mermaid
Utiliser : https://mermaid.live/ pour export manuel

## Format Recommandé

- **Format** : PNG (avec transparence si logo)
- **Résolution** : 1920x1080 pour captures, 300 DPI pour diagrammes
- **Taille** : < 500KB par image (optimiser avec TinyPNG)
- **Nommage** : kebab-case (ex: `diagramme-cas-utilisation.png`)

---

**Note** : Pour la Phase 1 (Analyse), les diagrammes sont déjà intégrés dans les fichiers Markdown. Ce dossier peut contenir des exports PNG pour présentation ou rapport PDF.






