---
title: Évaluation et tests
---

# Évaluation et Tests

## Vue d'ensemble

Cette section présente la stratégie d'évaluation de la plateforme, incluant les tests fonctionnels, non-fonctionnels et l'assurance qualité.

## Stratégie de Tests

### Pyramide de Tests

```
              /\
             /  \    Tests E2E (10%)
            /____\
           /      \
          / Tests  \  Tests d'Intégration (30%)
         / Intég.   \
        /____________\
       /              \
      /  Tests Unités  \ Tests Unitaires (60%)
     /                  \
    /____________________\
```

## Tests Unitaires

### Couverture Cible
- **Services** : > 90%
- **Repositories** : > 85%
- **Controllers** : > 80%
- **Utilities** : > 95%

### Outils
- **pytest** (Python) pour le backend
- **Jest** (JavaScript) pour le frontend
- **Coverage.py** pour les rapports de couverture

### Exemples de Tests

#### Test Service de Recherche
```python
def test_search_courses_by_code():
    # Arrange
    service = CourseService()
    criteria = {"code": "IFT2255"}
    
    # Act
    results = service.search(criteria)
    
    # Assert
    assert len(results) == 1
    assert results[0].code == "IFT2255"
```

#### Test Validation des Avis
```python
def test_review_validation_min_threshold():
    # Arrange
    course_id = "123"
    
    # Act
    can_display = ReviewService.can_display_reviews(course_id)
    
    # Assert
    assert can_display == False  # Moins de 5 avis
```

## Tests d'Intégration

### Scope
- Tests des endpoints API
- Tests des interactions avec la base de données
- Tests des intégrations externes (API Planifium, Discord)

### Cas de Tests

#### Test Flux de Recherche Complet
1. Authentification de l'utilisateur
2. Envoi de critères de recherche
3. Vérification des résultats
4. Test des filtres et tri
5. Consultation d'un cours
6. Ajout à la comparaison

#### Test Flux de Modération
1. Soumission d'un avis
2. Passage par le filtre automatique
3. Modération manuelle
4. Approbation
5. Vérification de la visibilité

## Tests End-to-End (E2E)

### Outils
- **Playwright** ou **Cypress** pour les tests UI
- **Selenium** pour les tests cross-browser

### Scénarios Principaux

#### Scénario 1 : Recherche et Consultation
```gherkin
Scenario: Étudiant recherche et consulte un cours
  Given l'étudiant est connecté
  When il recherche "développement logiciel"
  And il clique sur "IFT2255"
  Then il voit les détails complets du cours
  And il voit les avis étudiants si disponibles
```

#### Scénario 2 : Comparaison de Cours
```gherkin
Scenario: Étudiant compare 3 cours
  Given l'étudiant est connecté
  When il ajoute IFT2255 à la comparaison
  And il ajoute IFT2004 à la comparaison
  And il ajoute IFT3000 à la comparaison
  Then il voit le tableau comparatif avec 3 cours
  And il peut exporter la comparaison en PDF
```

## Tests de Performance

### Métriques Cibles

| Métrique | Cible | Seuil Critique |
|----------|-------|----------------|
| Temps de réponse API | < 500ms | < 2000ms |
| Chargement page | < 1s | < 3s |
| Recherche de cours | < 800ms | < 2000ms |
| Génération comparaison | < 1.5s | < 3000ms |
| Authentification | < 300ms | < 1000ms |

### Outils
- **JMeter** pour les tests de charge
- **Locust** pour les tests de montée en charge
- **Artillery** pour les tests de stress

### Scénarios de Charge

#### Test de Charge Normale
- 100 utilisateurs simultanés
- Durée : 10 minutes
- Taux de requêtes : 50/s

#### Test de Montée en Charge
- 0 → 500 utilisateurs sur 30 minutes
- Vérification de la scalabilité
- Identification des goulots d'étranglement

#### Test de Stress
- 1000+ utilisateurs simultanés
- Identification du point de rupture
- Vérification de la récupération

## Tests de Sécurité

### Vérifications

✅ **Authentification et autorisation**
- Tests d'injection SQL
- Tests XSS (Cross-Site Scripting)
- Tests CSRF (Cross-Site Request Forgery)
- Tests de force brute
- Vérification des permissions

✅ **Protection des données**
- Chiffrement des données sensibles
- Hachage des mots de passe (bcrypt)
- Validation des entrées
- Rate limiting

✅ **Conformité**
- Audit Loi 25
- Vérification RGPD
- Tests de consentement
- Vérification des logs d'accès

### Outils
- **OWASP ZAP** pour les tests de vulnérabilité
- **Bandit** pour l'analyse statique (Python)
- **ESLint Security Plugin** pour JavaScript

## Tests d'Accessibilité

### Standards
- **WCAG 2.1** niveau AA minimum
- Navigation au clavier
- Support des lecteurs d'écran
- Contraste des couleurs

### Outils
- **axe DevTools** pour les tests automatiques
- **WAVE** pour l'analyse d'accessibilité
- Tests manuels avec NVDA/JAWS

## Tests de Compatibilité

### Navigateurs Supportés
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Appareils
- Desktop (1920x1080, 1366x768)
- Tablet (768x1024)
- Mobile (375x667, 414x896)

## Assurance Qualité

### Code Review
- Review obligatoire avant merge
- Checklist de qualité
- Vérification des tests
- Validation de la documentation

### Analyse Statique
- **SonarQube** pour la qualité du code
- Vérification de la complexité cyclomatique
- Détection des code smells
- Vérification de la couverture de tests

### Métriques de Qualité

| Métrique | Cible |
|----------|-------|
| Couverture de tests | > 80% |
| Complexité cyclomatique | < 10 |
| Duplication de code | < 3% |
| Vulnérabilités critiques | 0 |
| Dette technique | < 5% |

## Rapports de Tests

### Tests Automatisés
- Exécution sur chaque commit
- Rapport de couverture généré
- Notification sur Slack en cas d'échec

### Tests Manuels
- Checklist de validation
- Rapport de bugs
- Suivi dans Jira/GitHub Issues

## Résultats Actuels

### Phase 1 (MVP)
- ✅ Tests unitaires : 82% de couverture
- ✅ Tests d'intégration : 45 tests passent
- ✅ Tests E2E : 8 scénarios principaux validés
- 🔄 Tests de performance : En cours
- 🔄 Tests de sécurité : Audit prévu

### Métriques de Performance Actuelles
- Temps de réponse API : 350ms (moyen)
- Chargement page : 1.2s
- Recherche de cours : 680ms
- Authentification : 220ms

## Prochaines Étapes

1. Atteindre 85% de couverture de tests
2. Compléter les tests de performance
3. Effectuer l'audit de sécurité
4. Ajouter tests de régression automatisés
5. Implémenter tests de contrat (API)

