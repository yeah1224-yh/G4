import { useCoursesCache } from "./controllers/CoursesCache.jsx"; 

export async function loadCourses(setCourses, setLoading) {
    const { courses, loadCourses: loadCoursesFromCache } = useCoursesCache();

    setLoading(true);

    try {
        // Si le cache existe déjà, on l'utilise, sinon on fait la requête
        const data = courses || await loadCoursesFromCache();
        setCourses(data);
    } catch (err) {
        console.error("Erreur dans loadCourses :", err);
    } finally {
        setLoading(false);
    }
}

