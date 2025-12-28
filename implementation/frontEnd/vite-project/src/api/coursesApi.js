// src/api/coursesApi.js
/* URL de base de l'API (VITE_API_URL ou localhost:7070 par défaut) */
const api = import.meta.env.VITE_API_URL || "http://localhost:7070";

/* Fonction utilitaire : construction de query string */
function buildQueryString(params = {}) {
  const query = Object.entries(params)
    .filter(([, value]) => value !== null && value !== undefined)
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        return `${encodeURIComponent(key)}=${encodeURIComponent(value.join(","))}`;
      }
      return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
    })
    .join("&");

  return query ? `?${query}` : "";
}

/* Départements par défaut (IFT + MAT) */
const DEPARTMENTS = ["IFT", "MAT"];

/* Mapping programme → départements */
const PROGRAM_DEPARTMENTS = {
  // Informatique
  informatique: ["IFT"],
  "baccalauréat en informatique": ["IFT"],
  "bachelor of computer science": ["IFT"],

  // Mathématiques
  mathématiques: ["MAT"],
  "baccalauréat en mathématiques": ["MAT"],
  "bachelor of mathematics": ["MAT"],

  // Physique
  physique: ["PHY"],
  "baccalauréat en physique": ["PHY"],
  "bachelor of physics": ["PHY"],
};

/* Fonction interne : récupération des cours par départements */
async function fetchCoursesByDepartments(departments, queryParams = {}) {
  console.log(`Fetching courses for departments: ${departments.join(", ")}`);

  let allCourses = [];
  const seen = new Set();

  try {
    /* Appel API pour chaque département */
    for (const dep of departments) {
      const params = {
        ...queryParams,
        sigle: dep,
        response_level: "full",
        include_schedule: true,
      };

      const qs = buildQueryString(params);
      const res = await fetch(`${api}/courses${qs}`);
      const courses = res.ok ? await res.json() : [];

      console.log(`Loaded ${courses.length} ${dep} courses`);

      /* Évite les doublons par ID */
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
    console.error("Error fetching courses by departments:", error);
    throw error;
  }
}

/* Récupère tous les cours (IFT + MAT par défaut) */
export async function fetchAllCourses(queryParams = {}) {
  return fetchCoursesByDepartments(DEPARTMENTS, queryParams);
}

/* Récupère les cours selon le programme utilisateur */
export async function fetchCoursesByProgram(programme = "", queryParams = {}) {
  const programKey = (programme || "").toLowerCase().trim();

  /* Aucun programme spécifié → tableau vide */
  if (!programKey) {
    console.log("No program specified, returning empty array");
    return [];
  }

  const departments = PROGRAM_DEPARTMENTS[programKey];

  /* Programme non reconnu → tableau vide */
  if (!departments) {
    console.warn(`Program "${programme}" not recognized`);
    return [];
  }

  console.log(`Fetching courses for program: "${programme}"`);
  console.log(`Using departments: ${departments.join(", ")}`);

  return fetchCoursesByDepartments(departments, queryParams);
}

/* Récupère un cours spécifique par ID */
export async function fetchCourseById(id, queryParams = {}) {
  const params = {
    ...queryParams,
    response_level: "full",
    include_schedule: true,
  };
  
  const queryString = buildQueryString(params);
  const url = `${api}/courses/${id}${queryString}`;
  
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Cours ${id} introuvable`);
  }
  
  return await res.json();
}

/* Recherche cours par préfixe (ex: "IFT", "MAT2255") */
export async function fetchCoursesByPrefix(prefix, queryParams = {}) {
  console.log(`Searching courses with prefix: ${prefix}`);

  const params = {
    response_level: "full",
    sigle: prefix,
    include_schedule: true,
    ...queryParams,
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

/* Récupère les prérequis d'un cours */
export async function fetchCoursePrerequisites(id) {
  const url = `${api}/courses/${id}/prerequisites`;
  const res = await fetch(url);
  
  if (!res.ok) {
    throw new Error(`Impossible de récupérer les prérequis du cours ${id}`);
  }
  
  return await res.json();
}

/* Récupère le graphe de dépendances (prérequis + requis par) */
export async function fetchCoursesDependency(courseIds = []) {
  const params = {
    course_ids: courseIds.join(","),
    include_dependents: true,
    include_prerequisites: true,
    include_schedule: true,
  };

  const qs = buildQueryString(params);
  const url = `${api}/courses-dependency${qs}`;
  
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Impossible de récupérer le graphe de dépendances");
  }
  
  return await res.json();
}

/* Récupère les avis d'un cours avec filtres optionnels */
export async function fetchAvisByCourseId(courseId, filters = {}) {
  const params = new URLSearchParams(filters);
  const qs = params.toString() ? `?${params.toString()}` : "";
  
  const res = await fetch(`${api}/courses/${courseId}/avis${qs}`);
  if (!res.ok) {
    throw new Error("Erreur lors du chargement des avis");
  }
  
  return res.json();
}

/* ✅ CORRIGÉ : POST /avis (tes routes Routes.java) */
export async function postAvis(avisData) {
  const url = `${api}/avis`;  // ← /avis (Routes.java: app.post("/avis"))
  
  console.log("Posting avis:", avisData);
  
  const response = await fetch(url, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(avisData),
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error("Avis error:", errorData);
    throw new Error(errorData.message || `Erreur HTTP ${response.status}`);
  }
  
  const result = await response.json();
  console.log("Avis publié:", result);
  return result;
}

/* Récupère les statistiques académiques d'un cours */
export async function fetchCourseStats(id) {
  const res = await fetch(`${api}/courses/${id}/stats`);
  if (!res.ok) {
    throw new Error(`Impossible de récupérer les statistiques du cours ${id}`);
  }
  
  return await res.json();
}
