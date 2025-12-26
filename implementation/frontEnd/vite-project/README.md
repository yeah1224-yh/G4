
# Structure complet de la front-end

```sh
frontEnd/vite-project/
├── node_modules/
├── public/
├── src/
│   ├── api/
│   │   └── coursesApi.js
│   ├── assets/              # Images, icônes, etc.
│   ├── composants/
│   │   ├── CourseCard.jsx
│   │   └── CourseCard2.jsx
│   ├── controllers/
│   │   ├── CourseController.jsx
│   │   ├── CoursesCache.jsx
│   │   └── HomeController.jsx
│   ├── styles/
│   │   ├── AvisListe.css
│   │   ├── ComparerCours.css
│   │   ├── ConsulterListe.css
│   │   ├── CourseCard.css
│   │   ├── CourseCard2.css
│   │   ├── HomeController.css
│   │   └── Profil.css
│   ├── views/
│   │   ├── AvisListeView.jsx
│   │   ├── ComparerCoursView.jsx
│   │   ├── ConsulterListeView.jsx
│   │   └── ProfilView.jsx
│   ├── App.jsx
│   └── main.jsx
├── .env
└── package.json

```

# Message de confirmation## Architecture

- API (src/api/) : Regroupe les fonctions qui communiquent avec le backend (ex. coursesApi.js pour récupérer les cours depuis l’API REST).

- Views (src/views/) : Représente les pages principales de l’application (ex. AvisListeView, ComparerCoursView, ConsulterListeView, ProfilView), chacune correspondant à un écran utilisateur.

- Composants (src/composants/) : Contient les composants React réutilisables, comme les cartes de cours (CourseCard, CourseCard2) utilisés dans plusieurs vues.

- Controllers (src/controllers/) : Composants « intelligents » qui gèrent l’état, orchestrent les appels à l’API, appliquent la logique de présentation et fournissent les données aux vues/        composants (ex. CourseController, HomeController, CoursesCache).

- Styles (src/styles/) : Fichiers CSS responsables de l’apparence des vues et des composants (mise en page, couleurs, typographie).

- Assets (src/assets/) : Ressources statiques de l’interface (images, icônes, etc.) utilisées dans les vues et composants.

- App.jsx et main.jsx : Point d’entrée de l’application React, où l’application est montée, la navigation est configurée et les vues sont reliées au DOM.


## Installation des dépendences
Ouvrez la commande de ligne ( Moi je suis sur linux, en fonction de votre système suivez les instructions de votre système)
Il faut être dans le dossier vite-project.

- npm install
- npm install axios react-router-dom @tanstack/react-query
- npm run dev

# Message de confirmation

> vite-project@0.0.0 dev
> vite


  VITE v7.2.4  ready in 405 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help


