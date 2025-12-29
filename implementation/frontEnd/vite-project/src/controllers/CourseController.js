// src/utils/loadCourses.js
import { useCoursesCache } from "./controllers/CoursesCache.jsx"; 

/* Fonction utilitaire pour charger les cours depuis le cache ou l'API */
export async function loadCourses(setCourses, setLoading) {
    /* Accès au hook du cache des cours */
    const { courses, loadCourses: loadCoursesFromCache } = useCoursesCache();

    /* Activation de l'état de chargement */
    setLoading(true);

    try {
        /* Logique de chargement :
           - Si les cours sont déjà dans le cache → utilisation directe
           - Sinon → appel de la fonction de chargement du cache */
        const data = courses || await loadCoursesFromCache();
        
        /* Mise à jour de l'état avec les données récupérées */
        setCourses(data);
    } catch (err) {
        /* Gestion d'erreur avec log en console */
        console.error("Erreur dans loadCourses :", err);
    } finally {
        /* Désactivation de l'état de chargement */
        setLoading(false);
    }
}
