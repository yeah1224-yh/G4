Lien Github

https://github.com/yeah1224-yh/G4.git

----------------------------------------------------------------------------------------

Utilisation :

1- Installer Node.js et npm
2- si ce n’est pas déjà fait.
3- Démarrer le serveur backend.

Ouvrir un terminal et naviguer jusqu’au dossier vite-project :
cd ift2255/implementation/frontEnd/vite-project

npm install
npm run dev "

--------------------------------------------FIN--------------------------------------------

-------------------------------------------------------------------------------------------
Structure du frontEnd

Le fichier App.jsx Affiche le projet via HomeController.jsx 

Dossier api: le fichier coursesApi.js gère les requetes faites au backend.

Dossier controller:

CourseController.js sert à charger les cours dans un composant React, en utilisant d’abord le cache si disponible, sinon en faisant une requête réseau, tout en gérant l’état de chargement et les erreurs.

CoursesCache.jsx sert a sauvegarder les requetes faites pour un laps de temps, c'est a dire jusqu'a ce que la session se close.

HomeController.jsx, Contient la page d'acceuil et contrôle l'affichage des fichier qui sont dans le dossier views

Dossier views:

ComparerCoursView.jsx contient en même temps la logique et le style pour la comparaison des cours ( on ne peut pas encore faire la comparaison car toutes les données ne sont pas disponibles )

CourseCard.jsx contient la carte utiliser dans le fichier ConsulterListeView.jsx

ConsulterListeView.jsx contient la logique et le style pour afficher les cours et leurs details disponibles et permet la recherche des cours aussi.

-------------------------------------------------------FIN------------------------------

Pour les autres questions, toutes les reponses sont dans le dossier ift2255, même la question Justification des choix de design aussi

