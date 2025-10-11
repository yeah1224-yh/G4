# Cadre du Projet

## Description du Projet

### Contexte

Le choix de cours est une étape déterminante dans le parcours académique d'un étudiant. À l'Université de Montréal et plus particulièrement au DIRO, ce choix représente un défi important pour de nombreux étudiants.

### Problématique

Les étudiants font face à plusieurs défis :

- **Complexité structurelle** : La structure des programmes est parfois complexe à comprendre
- **Anticipation difficile** : Il est difficile d'anticiper la charge réelle de travail, le niveau de difficulté perçu, le rythme du cours
- **Compatibilité** : Difficulté à évaluer la compatibilité avec le profil et les intérêts de l'étudiant
- **Sources fragmentées** : Données officielles partielles et sources informelles dispersées

### Solution

Une plateforme web accessible via API REST qui combine :

- Données officielles (API Planifium, résultats académiques)
- Avis étudiants collectés via Discord
- Fonctionnalités de recherche, comparaison et personnalisation

## Équipe

| # | Nom Complet | Matricule | Username Discord | Rôle Principal |
|---|-------------|-----------|------------------|----------------|
| 1 | Thomas Racine | [MATRICULE] | Bab0uchka | Exigences & Risques |
| 2 | Boubacar Cederic Diallo | 20290623 | bouba_023 | Analyse & Coordination |
| 3 | Mahamadou Maiga | [MATRICULE] | YeaH | Cas d'Utilisation |
| 4 | Mamadou Traore | [MATRICULE] | Daddy007 | Architecture & Prototype |

**Responsable d'équipe** : Boubacar Cederic Diallo

## Portée du Projet

### Dans la Portée (Phase 1)

- ✅ Analyse des exigences complète
- ✅ Modélisation UML (cas d'utilisation, activités)
- ✅ Architecture C4 (niveaux 1 et 2)
- ✅ Rapport MkDocs (HTML)
- ✅ Prototype démonstratif (bonus)
- ✅ Documentation GitHub

### Hors Portée (Phase 1)

- ❌ Implémentation complète de l'API
- ❌ Interface utilisateur finale
- ❌ Optimisation des performances
- ❌ Tests d'intégration automatisés
- ❌ Déploiement en production
- ❌ Intégration réelle avec l'API Planifium

## Échéancier

### Phase 1 - Analyse et Conception (26 septembre - 10 octobre)

| Tâche | Responsable | Heures | Échéance | Statut |
|-------|-------------|--------|----------|--------|
| **Analyse Initiale** |
| Analyse du domaine | Bouba | 6h | 26 sept | ⏳ |
| Glossaire | Bouba | 2h | 26 sept | ⏳ |
| Ébauche cas d'utilisation | Mahamadou | 4h | 26 sept | ⏳ |
| **Exigences** |
| Besoins fonctionnels | Thomas | 6h | 2 oct | ⏳ |
| Besoins non fonctionnels | Thomas | 4h | 2 oct | ⏳ |
| Analyse des risques (5+) | Thomas | 4h | 2 oct | ⏳ |
| Solutions matérielles | Thomas | 2h | 2 oct | ⏳ |
| **Cas d'Utilisation** |
| Diagramme de CU | Mahamadou | 4h | 5 oct | ⏳ |
| 5 CU détaillés avec scénarios | Mahamadou | 10h | 5 oct | ⏳ |
| Diagrammes d'activités | Mahamadou | 6h | 7 oct | ⏳ |
| **Architecture** |
| Modèle C4 - Niveau 1 | Mamadou | 3h | 8 oct | ⏳ |
| Modèle C4 - Niveau 2 | Mamadou | 4h | 8 oct | ⏳ |
| Documentation technique | Mamadou | 3h | 8 oct | ⏳ |
| **Prototype (Bonus)** |
| Prototype interactif | Mamadou | 8h | 9 oct | ⏳ |
| Tests prototype | Mamadou | 2h | 9 oct | ⏳ |
| **Finalisation** |
| Intégration rapport MkDocs | Bouba | 4h | 9 oct | ⏳ |
| Revue finale équipe | Tous | 3h | 9 oct | ⏳ |
| Release GitHub | Bouba | 1h | 10 oct | ⏳ |
| Remise finale | Bouba | - | 10 oct | ⏳ |

**Total estimé** : ~80 heures (~20h par membre)

## Répartition des Responsabilités

### Thomas Racine - Exigences & Risques

- Analyse des besoins fonctionnels et non fonctionnels
- Identification et mitigation des risques (minimum 5)
- Définition des solutions matérielles et de stockage
- Critères d'acceptation pour chaque exigence

### Boubacar Cederic Diallo - Analyse & Coordination

- Analyse du domaine (acteurs, processus, dépendances)
- Création et maintenance du glossaire
- Coordination générale de l'équipe
- Intégration et finalisation du rapport MkDocs
- Gestion du dépôt GitHub et release

### Mahamadou Maiga - Cas d'Utilisation

- Diagramme de cas d'utilisation UML
- Description détaillée de 5 cas d'utilisation
- Scénarios nominaux et alternatifs
- Diagrammes d'activités (flux principaux)

### Mamadou Traore - Architecture & Prototype

- Modèle C4 niveau 1 (contexte système)
- Modèle C4 niveau 2 (conteneurs)
- Documentation technique de l'architecture
- Prototype interactif démonstratif (bonus)

## Livrables

### Rapport MkDocs (HTML)

- 📄 **Cadre du projet** : Description, équipe, échéancier
- 📄 **Analyse des exigences** : Domaine, risques, besoins
- 📄 **Cas d'utilisation** : 5 CU détaillés avec scénarios
- 📄 **Conception** : Modèle C4 (niveaux 1 et 2)

### Dépôt GitHub

- 📁 Code source organisé (structure claire)
- 📝 README.md descriptif
- 🏷️ Release v1.0 (10 octobre 2025)
- 📊 Minimum 3 commits par membre
- 🔄 Historique Git propre et documenté

### Bonus (5%)

- 💻 Prototype interactif fonctionnel
- 🎯 Simulation des cas d'utilisation principaux
- 📱 Interface utilisateur démonstrative

## Objectifs du Projet

### Objectifs Principaux

1. **Centraliser** les informations dispersées sur les cours
2. **Faciliter** la prise de décision éclairée
3. **Personnaliser** l'expérience selon le profil étudiant
4. **Respecter** la confidentialité et la législation

### Objectifs Mesurables

| Objectif | Métrique | Cible |
|----------|----------|-------|
| Centralisation | Sources intégrées | 3 (Planifium, CSV, Discord) |
| Couverture | Cours documentés | 100+ cours DIRO |
| Performance | Temps de recherche | < 2 secondes |
| Fiabilité | Disponibilité | > 99% |
| Satisfaction | Score utilisateur | > 4/5 |

### Objectifs Secondaires

- **Réduire** l'incertitude dans la planification académique
- **Améliorer** la satisfaction et réussite étudiante
- **Optimiser** la perception de la charge de travail
- **Favoriser** les choix alignés avec les profils

## Hypothèses

### Données et Sources

#### API Planifium

- L'API reste stable et accessible durant le projet
- Les données sont à jour pour la session courante
- Le temps de réponse est acceptable (< 1s)

#### Résultats académiques

- Les fichiers CSV sont fournis dans un format cohérent
- Les données historiques couvrent au moins 3 sessions
- Les statistiques sont représentatives

#### Avis étudiants

- Les étudiants DIRO utilisent Discord activement
- Le seuil minimal de 5 avis garantit la fiabilité
- Les avis sont honnêtes et représentatifs

### Utilisateurs et Comportement

#### Profils étudiants

- Les étudiants sont prêts à renseigner leur profil
- Les préférences déclarées sont sincères
- La personnalisation apporte une valeur ajoutée

#### Adoption

- Les étudiants font confiance aux données agrégées
- L'outil sera utilisé avant le choix de cours
- Le bouche-à-oreille favorisera l'adoption

### Infrastructure et Légal

#### Technique

- Hébergement cloud disponible (gratuit ou budget limité)
- Aucune limitation majeure de l'infrastructure UdeM
- Les technologies choisies sont stables

#### Légal et confidentialité

- Consentement explicite des étudiants obtenu
- Conformité Loi 25 vérifiée par un expert
- Anonymisation suffisante pour protéger la vie privée

## Contraintes

### Techniques

- **Architecture** : API REST obligatoire
- **Sources de données** : Planifium (API), résultats (CSV), avis (JSON)
- **Documentation** : MkDocs générant du HTML
- **Versioning** : Git/GitHub avec minimum 3 commits par membre

### Légales et Éthiques

- **Loi 25** : Respect de la confidentialité au Québec
- **RGPD** : Protection des données personnelles
- **Propriété intellectuelle** : Respect des droits d'auteur
- **Anonymisation** : Aucune donnée personnelle identifiable

### Temporelles

- **26 septembre** : Ébauche obligatoire (domaine + CU)
- **10 octobre** : Remise finale (rapport complet + release)
- **Pénalité** : 5% si ébauche non partagée dans les délais

### Opérationnelles

- **Équipe** : 4 membres avec disponibilités variables
- **Budget** : Aucun budget alloué (solutions gratuites uniquement)
- **Maintenance** : Pas de support technique 24/7
- **Infrastructure** : Ressources limitées pour l'hébergement

### Fonctionnelles

- **Seuil d'avis** : Minimum 5 avis avant publication
- **Langues** : Français uniquement pour Phase 1
- **Anonymisation** : Protection obligatoire de l'identité
- **Performance** : Temps de réponse < 2s pour recherches

## Critères de Succès

### Phase 1 (Analyse)

- **Complétude** : Tous les livrables requis présents
- **Qualité** : Documentation claire et professionnelle
- **Conformité** : Respect du barème et des exigences
- **Collaboration** : Participation active de tous (3+ commits)
- **Release** : Version v1.0 publiée sur GitHub

### Système Final (Vision)

- **Fonctionnalité** : Tous les cas d'utilisation implémentés
- **Performance** : Temps de réponse < 2 secondes
- **Utilisabilité** : Interface intuitive et accessible
- **Fiabilité** : Disponibilité > 99%
- **Sécurité** : Conformité légale et protection des données

## Risques Identifiés

> **Note** : Les risques détaillés sont documentés dans la section Analyse des Exigences

### Principaux risques identifiés :

- Indisponibilité de l'API Planifium
- Qualité insuffisante des avis Discord
- Non-conformité Loi 25
- Dépassement des délais
- Divergence entre données officielles et avis