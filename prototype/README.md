# Prototype - Plateforme de Choix de Cours

## 📱 Prototype Interactif HTML/CSS/JS

Ce prototype démontre les fonctionnalités principales de la plateforme de choix de cours en utilisant des technologies web simples.

---

## 🚀 Comment utiliser

### **Option 1 : Ouvrir directement**
1. Ouvrez le fichier `index.html` dans votre navigateur
2. Naviguez dans l'application !

### **Option 2 : Serveur local (recommandé)**
```bash
# Depuis le dossier prototype/
python3 -m http.server 8080

# Puis ouvrez : http://localhost:8080
```

---

## ✨ Fonctionnalités Implémentées

### ✅ **Page d'accueil (index.html)**
- 🔍 Barre de recherche fonctionnelle
- 🏷️ Filtres rapides par niveau (1000, 2000, 3000)
- 📋 Affichage de 15 cours avec données mockées
- ⭐ Indicateurs visuels (difficulté, charge, avis)
- ➕ Bouton "Ajouter à la comparaison"
- 🔄 Tri des résultats (code, difficulté, charge)

### ✅ **Page détails (cours-details.html)**
- 📄 Informations complètes du cours
- 📊 Statistiques (difficulté, charge, moyenne, taux d'échec)
- 💬 Avis étudiants (si n≥5)
- 🔗 Prérequis cliquables
- 📅 Sessions offertes
- 🎯 Sidebar avec stats rapides

### ✅ **Page comparaison (comparaison.html)**
- ⚖️ Tableau comparatif de 2-5 cours
- 📊 Calcul automatique des totaux
- ⚠️ Alertes si charge > 40h/semaine
- 💡 Conseils pour sélection équilibrée
- 🗑️ Possibilité de retirer des cours

---

## 📁 Structure des Fichiers

```
prototype/
├── index.html              # Page d'accueil avec recherche
├── cours-details.html      # Page détails d'un cours
├── comparaison.html        # Page de comparaison
├── style.css               # Styles personnalisés
├── app.js                  # Logique JavaScript
├── data.js                 # Données mockées (15 cours)
└── README.md               # Ce fichier
```

---

## 🎨 Technologies Utilisées

- **HTML5** : Structure sémantique
- **CSS3** : Styling moderne avec animations
- **Bootstrap 5.3** : Framework UI responsive
- **Bootstrap Icons** : Icônes vectorielles
- **Vanilla JavaScript** : Logique sans framework
- **LocalStorage** : Persistance de la liste de comparaison

---

## 📊 Données Mockées

### **15 Cours Disponibles**
```
IFT1015 - Programmation 1
IFT1025 - Programmation 2
IFT2255 - Génie Logiciel ⭐
IFT2035 - Concepts des langages
IFT2245 - Systèmes d'exploitation
IFT3000 - Langages de script
IFT3100 - Infographie
IFT3150 - Projet de développement
IFT3245 - Simulation
IFT3295 - Sécurité informatique
IFT3710 - Bases de données
IFT3913 - Qualité logicielle
IFT3911 - Apprentissage automatique
IFT2125 - Informatique théorique
IFT2105 - Réseaux informatiques
```

### **Données par cours**
- Code, titre, description
- Crédits (3-6)
- Difficulté (1-5 étoiles)
- Charge de travail (heures/semaine)
- Nombre d'avis
- Moyenne de classe
- Taux d'échec
- Prérequis
- Sessions offertes
- Tags

---

## 🎯 Cas d'Utilisation Démontrés

### **CU1 : Rechercher un cours**
1. Saisir "génie" dans la barre de recherche
2. Voir IFT2255 s'afficher
3. Filtrer par niveau avec les boutons rapides

### **CU2 : Consulter détails**
1. Cliquer sur un cours (ex: IFT2255)
2. Voir toutes les informations
3. Lire les avis étudiants

### **CU3 : Comparer plusieurs cours**
1. Depuis l'accueil, cliquer ➕ sur 2-3 cours
2. Aller dans "Comparaison"
3. Voir le tableau comparatif
4. Observer les alertes (charge totale, difficulté)

---

## ✨ Fonctionnalités Avancées

### **Recherche Intelligente**
- Recherche par code (IFT2255)
- Recherche par titre (génie logiciel)
- Recherche par description
- Recherche par tags

### **Tri Dynamique**
- Par code alphabétique
- Par difficulté (décroissant)
- Par charge de travail (décroissant)

### **Persistance**
- La liste de comparaison est sauvegardée dans LocalStorage
- Même après fermeture du navigateur, les cours comparés restent

### **Responsive Design**
- Adapté aux écrans desktop
- Fonctionne sur tablette
- Optimisé pour mobile

### **Alertes Contextuelles**
- ⚠️ Alerte si charge totale > 40h/semaine
- ℹ️ Info si difficulté moyenne élevée (≥4)
- 💡 Conseils pour sélection équilibrée

---

## 🚫 Limitations (Normal pour un Prototype)

- ❌ Pas de backend réel (données mockées)
- ❌ Pas d'authentification
- ❌ Pas de soumission d'avis
- ❌ Pas de vérification d'éligibilité interactive
- ❌ Pas d'intégration API Planifium

---

## 🎓 Utilisation Pédagogique

### **Démonstration des Cas d'Utilisation**

Ce prototype permet de **visualiser concrètement** les cas d'utilisation documentés dans la Phase 1 :

| CU | Fonctionnalité | Page |
|----|----------------|------|
| CU1 | Rechercher un cours | index.html |
| CU2 | Consulter détails | cours-details.html |
| CU3 | Comparer cours | comparaison.html |
| CU4 | Avis étudiants | cours-details.html |

---

## 💡 Améliorations Futures

### **Phase 2 (si implémentation réelle)**
- Connexion à l'API Planifium
- Backend Node.js/Python
- Base de données PostgreSQL
- Authentification JWT
- Soumission d'avis via Discord
- Vérification automatique des prérequis

---

## 🎨 Aperçu

### **Page d'accueil**
- Design moderne avec hero section
- Cartes de cours avec animations hover
- Filtres et recherche instantanée

### **Page détails**
- Layout 2 colonnes (détails + sidebar)
- Statistiques visuelles
- Avis étudiants avec code couleur

### **Page comparaison**
- Tableau responsive
- Totaux calculés automatiquement
- Code couleur pour alertes

---

## 🏆 Valeur Ajoutée

Ce prototype démontre :
- ✅ Compréhension complète des besoins
- ✅ Faisabilité technique du projet
- ✅ Vision claire de l'UX/UI
- ✅ Simulation des cas d'utilisation
- ✅ Effort supplémentaire (bonus +5%)

---

## 📞 Support

Pour toute question sur le prototype :
- Voir la documentation Phase 1
- Consulter les cas d'utilisation détaillés
- Vérifier l'architecture C4

---

**Date de création** : Octobre 2025  
**Version** : 1.0 (Prototype Phase 1)  
**Équipe** : Projet IFT2255 - UdeM






