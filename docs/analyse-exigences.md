# Analyse des Exigences

## Description du Domaine

### Contexte Académique

Le choix de cours à l'Université de Montréal s'inscrit dans un processus académique complexe où les étudiants doivent naviguer entre :
- Exigences de programme (cours obligatoires, à option, au choix)
- Contraintes de prérequis et co-requis
- Disponibilité des cours par session
- Objectifs personnels (diplomation, spécialisation, moyenne)

### Processus de Choix de Cours Actuel

#### Étapes Typiques

1. **Consultation du programme** : L'étudiant vérifie les exigences de son programme
2. **Recherche d'informations** : Consultation de multiples sources
   - Plans de cours officiels (partiels)
   - Forums étudiants (Reddit, Discord)
   - Bouche-à-oreille (amis, collègues)
   - Statistiques publiques (moyennes de classe)
3. **Évaluation** : Estimation subjective de la charge et difficulté
4. **Décision** : Sélection des cours sans garantie sur l'adéquation
5. **Ajustement** : Modifications après le début de session (abandon/ajout)

#### Problèmes Identifiés

- **Sources fragmentées** : Informations dispersées sur multiples plateformes
- **Fiabilité variable** : Qualité inégale des retours informels
- **Manque de personnalisation** : Conseils génériques non adaptés au profil
- **Incertitude élevée** : Difficulté d'anticiper charge réelle et difficulté

### Acteurs du Système

#### Acteurs Primaires

**Étudiant - Utilisateur Principal**
- **Rôle** : Consulte, recherche, compare des cours
- **Objectifs** : Faire des choix éclairés, optimiser charge de travail
- **Profils variés** :
  - 🌍 **Étudiant international** : Adaptation au système québécois
  - 💼 **Étudiant travailleur** : Contraintes de temps importantes
  - 🎓 **Étudiant débutant** : Manque de repères et d'expérience
  - 🏆 **Étudiant finissant** : Conciliation diplomation/moyenne/intérêts

#### Acteurs Systèmes

**API Planifium**
- **Rôle** : Fournit données officielles (catalogue, horaires, prérequis)
- **Type** : API REST externe
- **Criticité** : Élevée - Source primaire de données

**Bot Discord**
- **Rôle** : Collecte avis étudiants via interface conversationnelle
- **Type** : Service automatisé
- **Criticité** : Moyenne - Source secondaire mais valorisée

**Système de Résultats Académiques**
- **Rôle** : Fournit statistiques agrégées (moyennes, inscrits, échecs)
- **Type** : Export CSV périodique
- **Criticité** : Moyenne - Complète la vue des cours

#### Acteurs Secondaires

**Administrateur Système**
- **Rôle** : Gère infrastructure, synchronisation données, monitoring
- **Fréquence** : Quotidienne

**Modérateur de Contenu**
- **Rôle** : Valide et modère les avis étudiants
- **Fréquence** : Hebdomadaire

**Professeur/Chargé de Cours** (Indirect)
- **Rôle** : Influence la perception du cours via enseignement
- **Interaction** : Aucune interaction directe avec la plateforme

### Dépendances Externes

#### Dépendances Critiques

| Dépendance | Type | Impact si indisponible | Mitigation |
|------------|------|------------------------|------------|
| **API Planifium** | Technique | Perte des données officielles | Cache + fallback |
| **Infrastructure UdeM** | Technique | Inaccessibilité résultats | Export périodique |
| **Réseau Discord** | Technique | Pas de nouveaux avis | Données existantes |
| **Loi 25 (Québec)** | Légale | Non-conformité = sanctions | Audit conformité |

#### Dépendances Secondaires

- **Hébergement cloud** : Disponibilité du service
- **Système d'authentification UdeM** : Login unifié (optionnel)
- **Support technique** : Maintenance et évolutions

### Flux de Données

```
┌─────────────────┐
│  API Planifium  │ ──► Catalogue cours, prérequis, horaires
└─────────────────┘

┌─────────────────┐
│  Résultats CSV  │ ──► Moyennes, inscrits, échecs agrégés
└─────────────────┘
                          ↓
                  ┌───────────────┐
                  │   Plateforme  │ ──► Interface web + API REST
                  │  Centralisée  │
                  └───────────────┘
                          ↑
┌─────────────────┐       │
│   Bot Discord   │ ──► Avis étudiants (difficulté, charge)
└─────────────────┘

                          ↓
                  ┌───────────────┐
                  │   Étudiants   │ ──► Recherche, compare, décide
                  └───────────────┘
```

## Hypothèses

### Hypothèses Techniques

1. **Stabilité de l'API Planifium**
   - L'API reste disponible avec un SLA > 95%
   - Le format des données ne change pas durant le projet
   - Temps de réponse acceptable (< 1 seconde)

2. **Qualité des données CSV**
   - Les résultats académiques suivent un format cohérent
   - Mise à jour au moins une fois par session
   - Données couvrent minimum 3 sessions historiques

3. **Fonctionnement du bot Discord**
   - Le système de collecte d'avis reste opérationnel
   - Les étudiants ont accès au serveur Discord DIRO
   - Format JSON structuré et parsable

4. **Infrastructure fiable**
   - Hébergement disponible (cloud ou UdeM)
   - Base de données avec backup automatique
   - Réseau stable avec latence < 100ms

### Hypothèses Fonctionnelles

5. **Adoption par les étudiants**
   - Les étudiants DIRO utilisent activement la plateforme
   - Préférence pour une solution centralisée vs sources multiples
   - Bouche-à-oreille favorise l'adoption organique

6. **Qualité des avis collectés**
   - Les retours d'expérience sont honnêtes et constructifs
   - Le seuil minimal (n≥5) garantit une fiabilité acceptable
   - Les étudiants comprennent l'échelle d'évaluation

7. **Pertinence des données**
   - Les informations historiques restent pertinentes
   - Les résultats passés prédisent les sessions futures
   - Les avis reflètent l'expérience réelle du cours

### Hypothèses Métier

8. **Besoin réel identifié**
   - Les étudiants ont effectivement besoin de cet outil
   - La solution apporte une valeur mesurable
   - Le problème n'est pas déjà résolu ailleurs

9. **Soutenabilité du projet**
   - Le projet peut être maintenu après la phase initiale
   - Ressources disponibles pour évolutions futures
   - Modèle sans coût récurrent (gratuit)

10. **Conformité légale réaliste**
    - L'anonymisation des avis suffit pour Loi 25
    - Le consentement explicite des étudiants est obtenu
    - Pas de collecte de données sensibles non nécessaires

## Glossaire

| Terme | Définition | Exemple |
|-------|------------|---------|
| **API Planifium** | Interface officielle de l'UdeM pour accéder aux données des cours et programmes | `GET /api/courses/IFT2255` |
| **Avis étudiant** | Retour d'expérience d'un étudiant ayant suivi un cours | Difficulté: 4/5, Charge: 15h/semaine |
| **Bot Discord** | Programme automatisé collectant les avis étudiants sur Discord | `!avis IFT2255 difficulté:4 charge:15` |
| **Cas d'utilisation (CU)** | Description d'une interaction entre un acteur et le système | "Rechercher un cours par code" |
| **Charge de travail** | Estimation du temps hebdomadaire requis pour un cours | 10-15 heures/semaine |
| **Co-requis** | Cours devant être suivi en même temps ou avant | IFT1227 est co-requis pour IFT2255 |
| **Critère d'acceptation** | Condition mesurable pour valider une exigence | "Temps de réponse < 2s dans 95% des cas" |
| **DIRO** | Département d'informatique et de recherche opérationnelle de l'UdeM | - |
| **Éligibilité** | Vérification des prérequis et contraintes pour s'inscrire à un cours | Vérifier si IFT1015 complété |
| **Loi 25** | Loi modernisant des dispositions législatives en matière de protection des renseignements personnels (Québec) | Consentement explicite requis |
| **Personnalisation** | Adaptation de l'affichage selon le profil de l'étudiant | Filtrer cours théoriques si profil "pratique" |
| **Planifium** | Système officiel de planification des cours de l'UdeM | https://planifium.app |
| **Prérequis** | Cours ou conditions obligatoires avant de s'inscrire | IFT1015 est prérequis pour IFT2255 |
| **Profil étudiant** | Caractéristiques personnelles (préférences, centres d'intérêt, statut) | International, Travailleur, Théorie>Pratique |
| **Résultats académiques** | Données agrégées sur les performances d'un cours (moyennes, échecs) | Moyenne: 3.2/4.3, Échecs: 12% |
| **Seuil minimal** | Nombre minimum d'avis requis pour afficher des statistiques fiables | n ≥ 5 avis |
| **UdeM** | Université de Montréal | - |

## Risques

### Matrice de Priorisation

| # | Risque | Impact | Probabilité | Score | Priorité |
|---|--------|--------|-------------|-------|----------|
| 1 | Indisponibilité API Planifium | Critique (5) | Moyenne (3) | 15 | 🔴 Haute |
| 2 | Non-conformité Loi 25 | Critique (5) | Faible (2) | 10 | 🟡 Moyenne |
| 3 | Avis non pertinents | Moyen (3) | Élevée (4) | 12 | 🟡 Moyenne |
| 4 | Faible adoption | Élevé (4) | Moyenne (3) | 12 | 🟡 Moyenne |
| 5 | Surcharge système | Élevé (4) | Faible (2) | 8 | 🟢 Faible |
| 6 | Divergence données | Moyen (3) | Moyenne (3) | 9 | 🟡 Moyenne |

### 1. Risque Technique - Indisponibilité de l'API Planifium

**Description** : L'API Planifium devient temporairement ou définitivement indisponible, ou change radicalement de format sans préavis.

**Impact** : 🔴 **Critique**
- Perte de la source principale de données officielles
- Impossible de rechercher ou afficher des cours
- Service principal inutilisable

**Probabilité** : 🟡 **Moyenne** (30-50%)
- APIs externes peuvent avoir des pannes
- Changements de version non annoncés
- Maintenance imprévue

**Solutions de Mitigation** :
1. **Cache intelligent** :
   - Mise en cache des données pour 24-48h
   - Mode dégradé avec données en cache
   - Refresh incrémental plutôt que complet

2. **Monitoring proactif** :
   - Surveillance 24/7 de l'API
   - Alertes automatiques si indisponible
   - Fallback automatique vers cache

3. **Accord de service** :
   - Contact avec l'équipe Planifium
   - Notification préalable des changements
   - SLA défini si possible

4. **Données statiques de secours** :
   - Export périodique en JSON/CSV
   - Snapshot hebdomadaire du catalogue
   - Affichage avec avertissement "données non à jour"

**Indicateurs de surveillance** :
- Taux de disponibilité de l'API (objectif > 95%)
- Temps de réponse moyen (objectif < 1s)
- Taux d'erreur (objectif < 1%)

---

### 2. Risque Légal - Non-conformité Loi 25

**Description** : La plateforme collecte, stocke ou traite des données personnelles en violation de la Loi 25 sur la protection des renseignements personnels au Québec.

**Impact** : 🔴 **Critique**
- Sanctions financières importantes
- Fermeture forcée de la plateforme
- Atteinte à la réputation de l'équipe/UdeM

**Probabilité** : 🟢 **Faible** (10-20%)
- Complexité de la législation
- Évolution des interprétations légales
- Erreurs d'implémentation possibles

**Solutions de Mitigation** :
1. **Anonymisation stricte** :
   - Aucun nom ou matricule stocké
   - Pseudonymisation des avis Discord
   - Agrégation minimum n≥5 pour statistiques

2. **Consentement explicite** :
   - Formulaire clair avant soumission d'avis
   - Opt-in (pas opt-out) pour la collecte
   - Possibilité de retrait à tout moment

3. **Minimisation des données** :
   - Collecter uniquement le strict nécessaire
   - Pas de données sensibles (origine, santé, etc.)
   - Durée de rétention limitée (2 ans max)

4. **Audit de conformité** :
   - Revue par un expert en protection de données
   - Documentation des flux de données
   - Registre des traitements (exigé par Loi 25)

5. **Sécurité technique** :
   - Chiffrement des données en transit (HTTPS)
   - Chiffrement au repos pour données sensibles
   - Contrôle d'accès strict

**Documentation requise** :
- Politique de confidentialité accessible
- Formulaire de consentement explicite
- Procédure de suppression des données

---

### 3. Risque Qualité - Avis Étudiants Non Pertinents

**Description** : Les avis collectés via Discord sont de mauvaise qualité : trolling, spam, exagération, biais important, ou manque de contexte.

**Impact** : 🟡 **Moyen**
- Perte de crédibilité de la plateforme
- Décisions étudiantes basées sur informations fausses
- Abandon de la plateforme par les utilisateurs

**Probabilité** : 🔴 **Élevée** (50-70%)
- Nature ouverte de Discord
- Pas de vérification d'identité forte
- Motivations variées des contributeurs

**Solutions de Mitigation** :
1. **Système de modération** :
   - Validation manuelle des premiers avis
   - Signalement par la communauté
   - Suppression des avis problématiques

2. **Seuil de fiabilité** :
   - Affichage uniquement si n≥5 avis
   - Indicateur de confiance (ex: 5/10 avis)
   - Alerte si forte variance dans les données

3. **Validation structurée** :
   - Formulaire guidé (pas texte libre uniquement)
   - Échelles numériques standardisées (1-5)
   - Champs obligatoires minimum

4. **Gamification positive** :
   - Système de réputation pour contributeurs
   - Badge "avis vérifié" si étudiant confirmé
   - Incitation à la qualité (pas à la quantité)

5. **Détection automatique** :
   - Filtrage de mots-clés inappropriés
   - Détection d'avis dupliqués
   - Analyse de sentiment pour outliers

**Critères de qualité** :
- Complétude (tous les champs remplis)
- Cohérence (difficulté vs charge alignées)
- Diversité (pas tous 5/5 ou 1/5)

---

### 4. Risque Adoption - Faible Utilisation par les Étudiants

**Description** : Les étudiants n'adoptent pas la plateforme et continuent d'utiliser leurs méthodes actuelles (forums, bouche-à-oreille).

**Impact** : 🔴 **Élevé**
- Échec des objectifs du projet
- Manque de données (effet réseau)
- Investissement non rentabilisé

**Probabilité** : 🟡 **Moyenne** (30-40%)
- Habitudes bien ancrées
- Résistance au changement
- Compétition avec solutions existantes

**Solutions de Mitigation** :
1. **UX exceptionnelle** :
   - Interface intuitive et rapide
   - Mobile-first (utilisable sur téléphone)
   - Valeur immédiate dès la première visite

2. **Promotion ciblée** :
   - Présentation dans les cours (ex: IFT1025)
   - Affichage dans les salles DIRO
   - Partenariat avec associations étudiantes

3. **Valeur ajoutée claire** :
   - Fonctionnalités uniques vs forums
   - Données agrégées introuvables ailleurs
   - Gain de temps significatif

4. **Effet réseau** :
   - Encourager soumission d'avis (gamification)
   - Partage social (Discord, Reddit)
   - Croissance organique via bouche-à-oreille

5. **Intégration existante** :
   - Liens depuis Planifium si possible
   - Widget Discord bot
   - API ouverte pour réutilisation

**Métriques de succès** :
- 100+ utilisateurs actifs en 3 mois
- 50+ avis collectés
- Taux de retour > 30%

---

### 5. Risque Performance - Surcharge du Système

**Description** : La plateforme ne peut pas gérer le trafic durant les périodes de pointe (inscription aux cours), causant lenteurs ou indisponibilité.

**Impact** : 🔴 **Élevé**
- Indisponibilité durant période critique
- Frustration des utilisateurs
- Abandon définitif

**Probabilité** : 🟢 **Faible** (10-20%)
- Trafic prévisible (calendrier académique)
- Solutions d'optimisation disponibles
- Architecture moderne scalable

**Solutions de Mitigation** :
1. **Architecture scalable** :
   - Hébergement cloud auto-scalable
   - Microservices indépendants
   - Load balancing automatique

2. **Mise en cache agressive** :
   - Cache Redis pour données fréquentes
   - CDN pour assets statiques
   - Cache navigateur (HTTP headers)

3. **Optimisation requêtes** :
   - Index base de données optimaux
   - Pagination des résultats
   - Lazy loading des données

4. **Monitoring et alertes** :
   - Surveillance temps de réponse
   - Alertes si latence > seuil
   - Dashboard temps réel

5. **Tests de charge** :
   - Simulation de 1000+ utilisateurs
   - Identification goulots d'étranglement
   - Plan de capacité documenté

**Objectifs performance** :
- Temps de réponse < 2s (95e percentile)
- Support 1000 utilisateurs simultanés
- Disponibilité > 99%

---

### 6. Risque Données - Divergence entre Sources

**Description** : Les données officielles (Planifium, résultats CSV) et les avis étudiants divergent significativement, créant confusion.

**Impact** : 🟡 **Moyen**
- Confusion pour les étudiants
- Perte de confiance dans la plateforme
- Difficulté d'interprétation

**Probabilité** : 🟡 **Moyenne** (30-40%)
- Subjectivité des perceptions
- Variation entre sessions/professeurs
- Biais dans les retours volontaires

**Solutions de Mitigation** :
1. **Affichage transparent** :
   - Distinguer clairement données officielles vs avis
   - Contexte des statistiques (session, professeur)
   - Disclaimer sur la subjectivité

2. **Analyse de cohérence** :
   - Alerte si divergence majeure
   - Investigation des cas extrêmes
   - Explication des écarts possibles

3. **Multi-sources** :
   - Ne pas cacher les contradictions
   - Présenter toutes les perspectives
   - Laisser l'étudiant juger

4. **Traçabilité** :
   - Date de dernière mise à jour visible
   - Source de chaque donnée indiquée
   - Historique des changements

**Indicateurs** :
- Corrélation moyenne > charge perçue
- Écart-type acceptable
- Outliers < 5%

## Besoins Non Fonctionnels

### 1. Performance ⚡

**Description** : Le système doit répondre rapidement aux requêtes utilisateurs pour garantir une expérience fluide.

**Justification** :
- Les étudiants utilisent souvent la plateforme en situation de stress (choix de cours)
- La comparaison de multiples cours nécessite plusieurs requêtes
- Délais > 3s entraînent abandon (études UX)

**Critères d'Acceptation** :
- ✅ Page d'accueil se charge en < 1 seconde
- ✅ Recherche de cours retourne résultats en < 2 secondes
- ✅ Comparaison de 5 cours s'affiche en < 3 secondes
- ✅ 95e percentile des requêtes < 2 secondes

**Métriques** :
- Temps de réponse moyen (objectif: 1.5s)
- TTFB (Time To First Byte) < 500ms
- FCP (First Contentful Paint) < 1s

---

### 2. Disponibilité 🟢

**Description** : Le service doit être accessible en permanence, particulièrement durant les périodes critiques d'inscription.

**Justification** :
- Les périodes d'inscription sont courtes (quelques jours)
- Indisponibilité = échec pour certains étudiants
- Crédibilité de la plateforme dépend de la fiabilité

**Critères d'Acceptation** :
- ✅ Uptime global > 99% (8.76h downtime max/an)
- ✅ Uptime période d'inscription > 99.9%
- ✅ Temps de récupération après incident < 1 heure
- ✅ Monitoring 24/7 avec alertes automatiques

**Métriques** :
- Disponibilité mensuelle (objectif: 99.5%)
- MTBF (Mean Time Between Failures) > 720h
- MTTR (Mean Time To Repair) < 1h

---

### 3. Sécurité 🔒

**Description** : La plateforme doit protéger les données personnelles et respecter la législation en vigueur (Loi 25, RGPD).

**Justification** :
- Données sensibles collectées (profils, avis)
- Obligations légales strictes au Québec
- Confiance des utilisateurs essentielle

**Critères d'Acceptation** :
- ✅ Chiffrement HTTPS (TLS 1.3) pour toutes communications
- ✅ Anonymisation des avis (pas de données identifiantes)
- ✅ Authentification sécurisée (OAuth ou JWT)
- ✅ Audit trail complet des accès aux données
- ✅ Conformité Loi 25 validée par audit

**Métriques** :
- 0 faille de sécurité critique
- Temps de patch vulnérabilités < 48h
- Score audit conformité > 90%

---

### 4. Utilisabilité 🎨

**Description** : L'interface doit être intuitive, accessible et adaptée à tous les profils d'étudiants.

**Justification** :
- Diversité des profils (international, débutant, etc.)
- Utilisation mobile importante chez les étudiants
- Accessibilité = inclusion de tous

**Critères d'Acceptation** :
- ✅ Interface responsive (mobile, tablette, desktop)
- ✅ Conformité WCAG 2.1 niveau AA (accessibilité)
- ✅ Navigation intuitive (max 3 clics vers toute fonction)
- ✅ Temps d'apprentissage < 5 minutes
- ✅ Support multilingue (français minimum)

**Métriques** :
- Score SUS (System Usability Scale) > 75
- Taux de complétion des tâches > 90%
- Taux d'erreur utilisateur < 5%

---

### 5. Évolutivité 📈

**Description** : Le système doit supporter la croissance du nombre d'utilisateurs et l'ajout de nouvelles fonctionnalités.

**Justification** :
- Adoption progressive (effet réseau)
- Expansion possible à d'autres départements
- Évolution des besoins dans le temps

**Critères d'Acceptation** :
- ✅ Support de 10 000 utilisateurs actifs simultanés
- ✅ Architecture modulaire (microservices)
- ✅ API REST extensible (versioning)
- ✅ Déploiement continu automatisé (CI/CD)

**Métriques** :
- Capacité maximale testée
- Temps d'ajout d'une fonctionnalité
- Coût marginal par utilisateur supplémentaire

---

### 6. Maintenabilité 🛠️

**Description** : Le code doit être facile à maintenir, déboguer et faire évoluer par l'équipe actuelle et future.

**Justification** :
- Turnover étudiant (projet doit survivre)
- Complexité croissante dans le temps
- Coût de maintenance > coût développement initial

**Critères d'Acceptation** :
- ✅ Documentation technique complète (README, wiki)
- ✅ Tests automatisés > 80% couverture
- ✅ Code review obligatoire (2 approbations)
- ✅ Standards de code respectés (linters)
- ✅ Architecture documentée (diagrammes C4)

**Métriques** :
- Temps moyen de résolution bug < 2 jours
- Dette technique < 10% effort total
- Taux de réussite des tests > 95%

---

### 7. Fiabilité 🎯

**Description** : Les données présentées doivent être exactes, à jour et cohérentes entre les différentes sources.

**Justification** :
- Décisions académiques importantes
- Crédibilité = condition d'adoption
- Erreurs = conséquences sur parcours étudiant

**Critères d'Acceptation** :
- ✅ Synchronisation quotidienne avec API Planifium
- ✅ Validation automatique de cohérence des données
- ✅ Indicateur de fraîcheur des données (timestamp)
- ✅ Seuil minimal n≥5 pour statistiques d'avis
- ✅ Alerte si divergence > 20% entre sources

**Métriques** :
- Taux d'erreur données < 1%
- Fraîcheur moyenne < 24h
- Taux de cohérence > 95%

---

### Tableau Récapitulatif

| Besoin | Priorité | Métrique Clé | Objectif |
|--------|----------|--------------|----------|
| Performance | Haute | Temps réponse | < 2s (95e percentile) |
| Disponibilité | Haute | Uptime | > 99% |
| Sécurité | Critique | Conformité Loi 25 | 100% |
| Utilisabilité | Haute | Score SUS | > 75 |
| Évolutivité | Moyenne | Utilisateurs simultanés | 10 000+ |
| Maintenabilité | Moyenne | Couverture tests | > 80% |
| Fiabilité | Haute | Exactitude données | > 99% |

## Besoins Matériels

### Infrastructure Phase 1 (Développement)

**Environnement Local**
- **Postes développeurs** : 4 machines (existantes)
- **OS** : Windows/Linux/macOS (flexible)
- **RAM** : 8 GB minimum par poste
- **Stockage** : 20 GB disponibles

**Serveur de Développement**
- **Type** : Machine virtuelle ou conteneur Docker
- **Hébergement** : Local ou cloud gratuit (Heroku, Render)
- **Spécifications minimales** :
  - 2 vCPU
  - 4 GB RAM
  - 20 GB SSD

### Infrastructure Phase 2+ (Production - Vision Future)

**Serveur d'Application**
- **Type** : Cloud (AWS, GCP, Azure) ou serveur UdeM
- **Spécifications recommandées** :
  - CPU : 4 cœurs (scalable)
  - RAM : 8 GB (extensible à 16 GB)
  - Stockage : 100 GB SSD
  - Réseau : 1 Gbps

**Base de Données**
- **Type** : PostgreSQL 14+ ou MongoDB 6+
- **Spécifications** :
  - Capacité initiale : 50 GB
  - Backup quotidien : 150 GB (3 copies)
  - IOPS : 3000 minimum

**Services Auxiliaires**
- **Cache Redis** : 2 GB RAM
- **CDN** : Cloudflare (gratuit) ou équivalent
- **Monitoring** : Grafana Cloud (gratuit)

### Outils de Développement

**Obligatoires**
- Git/GitHub : Versioning
- MkDocs : Documentation
- Python 3.8+ : Backend (si choisi)
- Node.js 18+ : Frontend/Backend (si choisi)

**Recommandés**
- Docker : Conteneurisation
- Postman : Tests API
- PlantUML : Diagrammes UML
- Draw.io : Modèles C4

## Solution de Stockage

### Architecture de Données

```
┌─────────────────────────────────────────────────────────────┐
│                    COUCHE STOCKAGE                           │
└─────────────────────────────────────────────────────────────┘

┌──────────────────────┐  ┌──────────────────────┐  ┌──────────────────────┐
│  Base Principale     │  │     Cache Redis      │  │  Stockage Fichiers   │
│    (PostgreSQL)      │  │   (En mémoire)       │  │    (S3 / Local)      │
├──────────────────────┤  ├──────────────────────┤  ├──────────────────────┤
│ • Cours              │  │ • Sessions users     │  │ • Exports CSV/JSON   │
│ • Programmes         │  │ • Résultats recherch │  │ • Logs système       │
│ • Avis étudiants     │  │ • Données fréquentes │  │ • Backups DB         │
│ • Profils utilisat.  │  │ • Stats agrégées     │  │ • Documentation      │
│ • Résultats académiq │  │ • TTL: 1-24h         │  │                      │
└──────────────────────┘  └──────────────────────┘  └──────────────────────┘
        ↓                          ↓                          ↓
┌─────────────────────────────────────────────────────────────┐
│              Couche d'accès données (ORM/ODM)               │
└─────────────────────────────────────────────────────────────┘
```

### Schéma de Base de Données (Conceptuel)

**Tables Principales**

1. **Cours**
   - code (PK) : VARCHAR(10)
   - titre : VARCHAR(200)
   - credits : INTEGER
   - description : TEXT
   - prerequis : JSONB
   - session_offert : VARCHAR[]

2. **ResultatsAcademiques**
   - id (PK) : SERIAL
   - code_cours (FK) : VARCHAR(10)
   - session : VARCHAR(6)
   - moyenne : DECIMAL(3,2)
   - inscrits : INTEGER
   - echecs : INTEGER

3. **AvisEtudiants**
   - id (PK) : SERIAL
   - code_cours (FK) : VARCHAR(10)
   - session : VARCHAR(6)
   - difficulte : INTEGER (1-5)
   - charge_travail : INTEGER (heures/semaine)
   - commentaire : TEXT
   - date_creation : TIMESTAMP
   - hash_etudiant : VARCHAR(64) -- anonymisé

4. **ProfilsEtudiants** (optionnel)
   - id (PK) : SERIAL
   - preferences : JSONB
   - statut : ENUM('international', 'travailleur', 'debutant', 'finissant')
   - date_creation : TIMESTAMP

### Stratégie de Sauvegarde

**Backup Complet (Daily)**
- **Fréquence** : Quotidien à 2h00 (faible trafic)
- **Rétention** : 30 jours
- **Destination** : Stockage externe (S3, Google Drive)
- **Chiffrement** : AES-256

**Backup Incrémental (Hourly)**
- **Fréquence** : Toutes les 6 heures
- **Rétention** : 7 jours
- **Contenu** : Modifications uniquement

**Test de Restauration**
- **Fréquence** : Mensuel
- **Durée maximale** : 1 heure
- **Validation** : Intégrité des données

**Plan de Reprise d'Activité**
- **RTO** (Recovery Time Objective) : 4 heures
- **RPO** (Recovery Point Objective) : 6 heures (perte max)

### Gestion du Stockage

**Politiques de Rétention**

| Type de Données | Durée Conservation | Raison |
|----------------|-------------------|--------|
| Cours actifs | Illimitée | Référence permanente |
| Résultats académiques | 5 ans | Analyse tendances |
| Avis étudiants | 3 ans | Pertinence limitée |
| Logs système | 90 jours | Débogage, sécurité |
| Sessions utilisateurs | 30 jours | Conformité |
| Backups complets | 30 jours | Récupération |

**Archivage**
- Avis > 3 ans → Archivage froid (compression)
- Résultats > 5 ans → Export CSV puis suppression
- Cours obsolètes → Marquage "inactif" (pas suppression)

## Solution d'Intégration

### Architecture API REST

```
┌─────────────────────────────────────────────────────────────┐
│                      CLIENTS                                 │
│  (Navigateur Web, App Mobile, CLI, Intégrations tierces)    │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTPS (TLS 1.3)
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                   API GATEWAY                                │
│  • Authentification (JWT)                                    │
│  • Rate Limiting (1000 req/h)                               │
│  • Logging & Monitoring                                      │
│  • Load Balancing                                            │
└────────────────────────┬────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                 SERVICES MÉTIER                              │
├──────────────┬──────────────┬──────────────┬────────────────┤
│  Service     │  Service     │  Service     │  Service       │
│  Cours       │  Avis        │  Recherche   │  Profils       │
└──────┬───────┴──────┬───────┴──────┬───────┴──────┬─────────┘
       │              │              │              │
       ↓              ↓              ↓              ↓
┌─────────────────────────────────────────────────────────────┐
│              INTÉGRATIONS EXTERNES                           │
├─────────────────┬─────────────────┬─────────────────────────┤
│  API Planifium  │  Bot Discord    │  Système Résultats      │
│  (REST API)     │  (Webhook)      │  (Import CSV)           │
└─────────────────┴─────────────────┴─────────────────────────┘
```

### Endpoints API Principaux

**Cours**
```
GET    /api/v1/cours                    # Liste des cours
GET    /api/v1/cours/{code}             # Détails d'un cours
GET    /api/v1/cours/{code}/prerequis   # Prérequis d'un cours
GET    /api/v1/cours/{code}/stats       # Statistiques agrégées
```

**Recherche**
```
GET    /api/v1/recherche?q={query}      # Recherche par mots-clés
GET    /api/v1/recherche?code={code}    # Recherche par code
POST   /api/v1/recherche/avancee        # Recherche avec filtres
```

**Avis**
```
GET    /api/v1/cours/{code}/avis        # Avis pour un cours
POST   /api/v1/avis                     # Soumettre un avis
GET    /api/v1/avis/stats               # Statistiques globales
```

**Comparaison**
```
POST   /api/v1/comparaison              # Comparer plusieurs cours
GET    /api/v1/comparaison/{id}         # Récupérer une comparaison
```

**Profils**
```
POST   /api/v1/profils                  # Créer un profil
GET    /api/v1/profils/{id}             # Récupérer un profil
PUT    /api/v1/profils/{id}             # Modifier un profil
GET    /api/v1/recommandations          # Cours recommandés
```

### Documentation API

**Format** : OpenAPI 3.0 (Swagger)
- Interface interactive Swagger UI
- Exemples de requêtes/réponses
- Codes d'erreur documentés
- Rate limits spécifiés

**Accès** : `https://api.plateforme.umontreal.ca/docs`

### Authentification

**Méthode** : JWT (JSON Web Tokens)

**Flow**
1. Login → Génération token (expire 24h)
2. Header : `Authorization: Bearer {token}`
3. Refresh token si expiré

**Anonymat** : Endpoints publics en lecture (pas d'auth requise)

### Rate Limiting

**Limites par Utilisateur**
- **Anonyme** : 100 requêtes/heure
- **Authentifié** : 1000 requêtes/heure
- **Admin** : Illimité

**Réponse si dépassement** :
```json
{
  "error": "Rate limit exceeded",
  "retry_after": 3600,
  "limit": 1000,
  "remaining": 0
}
```
HTTP Status: `429 Too Many Requests`

### Intégrations Externes

#### 1. API Planifium

**Synchronisation**
- **Fréquence** : Quotidienne (3h00)
- **Méthode** : Pull (requêtes GET)
- **Format** : JSON
- **Endpoints utilisés** :
  - `/api/courses` → Liste des cours
  - `/api/programs` → Programmes
  - `/api/schedules` → Horaires

**Gestion d'Erreurs**
- Retry automatique (3 tentatives)
- Fallback sur cache si échec
- Alerte admin si échec > 24h

#### 2. Bot Discord

**Collecte d'Avis**
- **Méthode** : Webhook POST
- **Format** : JSON
- **Commande** : `!avis IFT2255 difficulte:4 charge:15 "Commentaire"`

**Validation**
- Vérification format données
- Détection spam (rate limit)
- Stockage temporaire avant modération

**Exemple Payload** :
```json
{
  "discord_user_id": "hash_anonymise",
  "code_cours": "IFT2255",
  "session": "A2025",
  "difficulte": 4,
  "charge_travail": 15,
  "commentaire": "Cours intéressant mais charge importante",
  "timestamp": "2025-10-09T14:30:00Z"
}
```

#### 3. Résultats Académiques (CSV)

**Import Périodique**
- **Fréquence** : Début de chaque session
- **Source** : Fourni par DIRO/administration
- **Format attendu** :
```csv
session,code_cours,moyenne,inscrits,echecs
A2024,IFT2255,3.2,150,18
A2024,IFT1015,2.8,200,35
```

**Processus**
1. Upload CSV par admin
2. Validation format (pandas)
3. Insertion/mise à jour base de données
4. Génération rapport (succès/erreurs)

### Monitoring et Observabilité

**Logs Centralisés**
- **Stack** : ELK (Elasticsearch, Logstash, Kibana) ou alternative gratuite (Loki)
- **Niveaux** : DEBUG, INFO, WARNING, ERROR, CRITICAL
- **Rétention** : 90 jours

**Métriques**
- **Outil** : Prometheus + Grafana (open source)
- **Collectées** :
  - Taux de requêtes (req/s)
  - Temps de réponse (p50, p95, p99)
  - Taux d'erreur (%)
  - Utilisation CPU/RAM/Disque

**Alertes**
- **Canaux** : Email, Slack, Discord
- **Conditions** :
  - Temps de réponse > 3s pendant 5min → Alerte
  - Taux d'erreur > 5% → Alerte critique
  - API Planifium inaccessible > 1h → Alerte
  - Disque > 80% plein → Alerte

**Dashboard Temps Réel**
- Statut des services (vert/rouge)
- Graphiques de performance
- Logs récents
- Alertes actives

### CI/CD (Intégration/Déploiement Continu)

**Pipeline GitHub Actions**

```yaml
# Simplifié pour illustration
on: [push, pull_request]

jobs:
  test:
    - Linter (code quality)
    - Tests unitaires
    - Tests d'intégration
    - Coverage > 80%
  
  build:
    - Build Docker image
    - Tag avec version
  
  deploy:
    - Deploy to staging (auto)
    - Deploy to production (manuel)
```

**Environnements**
- **Dev** : Local (chaque développeur)
- **Staging** : Serveur test (auto-déployé)
- **Production** : Serveur public (déployé après validation)

### Sécurité API

**Protection Implémentée**
- ✅ HTTPS obligatoire (TLS 1.3)
- ✅ CORS configuré (origins autorisées)
- ✅ Validation des entrées (injection SQL, XSS)
- ✅ Rate limiting (DDoS protection)
- ✅ Headers de sécurité (HSTS, CSP, X-Frame-Options)
- ✅ Logs des accès (audit trail)

**Pas dans Phase 1 (Future)**
- OAuth 2.0 / OpenID Connect
- WAF (Web Application Firewall)
- Penetration testing

---

[← Retour à l'accueil](index.md) | [Cadre du Projet](cadre-projet.md) | [Cas d'Utilisation →](cas-utilisation.md)