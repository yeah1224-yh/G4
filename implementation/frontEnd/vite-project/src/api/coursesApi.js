const api = import.meta.env.VITE_API_URL || "http://localhost:7070";

/**
 * Transforme un objet JS en query string pour l'URL
 */
function buildQueryString(params = {}) {
    const query = Object.entries(params)
        .filter(([_, value]) => value !== null && value !== undefined)
        .map(([key, value]) => {
            if (Array.isArray(value)) return `${encodeURIComponent(key)}=${encodeURIComponent(value.join(","))}`;
            return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
        })
        .join("&");
    return query ? `?${query}` : "";
}

// Départements à charger
const DEPARTMENTS = ["IFT", "MAT", "PHY", "STA", "CHM", "BIO"];

/**
 * Récupère tous les cours pour chaque département
 */
export async function fetchAllCourses(queryParams = {}) {
    console.log("Fetching courses by department…");
    try {
        let allCourses = [];
        const seen = new Set();
        for (const dep of DEPARTMENTS) {
            const params = { ...queryParams, sigle: dep, response_level: "full" };
            const qs = buildQueryString(params);
            const res = await fetch(`${api}/courses${qs}`);
            const courses = res.ok ? await res.json() : [];
            console.log(`Loaded ${courses.length} ${dep} courses`);
            for (const course of courses) {
                if (!seen.has(course.id)) {
                    allCourses.push(course);
                    seen.add(course.id);
                }
            }
        }
        console.log(`Total: ${allCourses.length} unique courses loaded`);
        return allCourses;
    } catch (error) {
        console.error("Error fetching courses:", error);
        throw error;
    }
}

/**
 * Récupère un cours par son ID (avec tous les détails)
 */
export async function fetchCourseById(id, queryParams = {}) {
    const params = { ...queryParams, response_level: "full" };
    const queryString = buildQueryString(params);
    const url = `${api}/courses/${id}${queryString}`;
    const res = await fetch(url);
    if (!res.ok) {
        throw new Error(`Cours ${id} introuvable`);
    }
    return await res.json();
}

/**
 * Récupère tous les cours commençant par un préfixe (ex: "IFT", "MAT2", "PHY1")
 */
export async function fetchCoursesByPrefix(prefix, queryParams = {}) {
    console.log(`Searching courses with prefix: ${prefix}`);
    
    const params = {
        response_level: "full",
        sigle: prefix,
        ...queryParams
    };
    
    const queryString = buildQueryString(params);
    const url = `${api}/courses${queryString}`;
    
    const res = await fetch(url);
    
    if (!res.ok) {
        throw new Error(`Erreur lors de la recherche avec le préfixe ${prefix}`);
    }
    
    const courses = await res.json();
    console.log(`Found ${courses.length} courses with prefix ${prefix}`);
    
    return courses;
}

/**
 * Récupère les prérequis d'un cours
 */
export async function fetchCoursePrerequisites(id) {
    const url = `${api}/courses/${id}/prerequisites`;
    const res = await fetch(url);
    if (!res.ok) {
        throw new Error(`Impossible de récupérer les prérequis du cours ${id}`);
    }
    return await res.json();
}

/**
 * Récupère le graphe complet des dépendances (prérequis + requis par)
 */
export async function fetchCoursesDependency(courseIds = []) {
    const params = { 
        course_ids: courseIds.join(","), 
        include_dependents: true, 
        include_prerequisites: true 
    };
    const qs = buildQueryString(params);
    const url = `${api}/courses-dependency${qs}`;
    const res = await fetch(url);
    if (!res.ok) {
        throw new Error("Impossible de récupérer le graphe de dépendances");
    }
    return await res.json();
}