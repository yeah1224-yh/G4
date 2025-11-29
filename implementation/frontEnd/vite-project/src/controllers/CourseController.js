import { fetchAllCourses } from "../api/coursesApi";

export async function loadCourses(setCourses, setLoading) {
    try {
        const data = await fetchAllCourses();
        setCourses(data);
    } catch (err) {
          console.error("Erreur dans loadCourses :", err);
    } finally {
          setLoading(false);
    }
}

