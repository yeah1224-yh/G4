// src/controllers/CoursesCache.jsx
import { createContext, useContext, useState, useRef, useEffect } from "react";
import { fetchAllCourses, fetchCoursesByProgram } from "../api/coursesApi.js";

/* Contexte React pour le cache des cours */
const CoursesCacheContext = createContext();

/* Clé localStorage pour le programme utilisateur */
const PROGRAM_KEY = "ift2255_programme";

/* Provider principal du cache des cours */
export function CoursesCacheProvider({ children }) {
  /* États principaux du cache */
  const [courses, setCourses] = useState([]);                        // Liste des cours
  const [loading, setLoading] = useState(true);                     // État de chargement
  const [error, setError] = useState(null);                         // Erreur de chargement

  /* Références pour la gestion du cache et des promesses */
  const loadingPromiseRef = useRef(null);                           // Promesse en cours
  const cacheRef = useRef(null);                                    // Cache des données
  const cachedProgrammeRef = useRef(null);                          // Programme du cache

  /* Fonction principale de chargement des cours */
  const loadCourses = async (queryParams = {}) => {
    /* Récupération du programme utilisateur depuis localStorage */
    const programme = window.localStorage.getItem(PROGRAM_KEY) || "";

    /* Vérification cache valide (données + même programme) */
    if (
      cacheRef.current &&
      cacheRef.current.length > 0 &&
      cachedProgrammeRef.current === programme
    ) {
      console.log("Using cached courses");
      setCourses(cacheRef.current);
      return Promise.resolve(cacheRef.current);
    }

    /* Éviter les chargements multiples simultanés */
    if (loadingPromiseRef.current) {
      return loadingPromiseRef.current;
    }

    /* Initialisation du chargement */
    setLoading(true);
    setError(null);

    /* Exécution du chargement asynchrone */
    loadingPromiseRef.current = (async () => {
      try {
        let data = [];

        /* Logique de chargement selon le programme */
        if (programme && programme.trim() !== "") {
          /* Chargement filtré par programme utilisateur */
          console.log(`Loading courses for program: "${programme}"`);
          data = await fetchCoursesByProgram(programme);

          if (data.length === 0) {
            console.log("No courses found for this program");
            cacheRef.current = [];
            cachedProgrammeRef.current = programme;
            setCourses([]);
            return [];
          }
        } else {
          /* Chargement complet (IFT + MAT par défaut) */
          console.log("Loading courses (default: IFT + MAT)");
          data = await fetchAllCourses(queryParams);
        }

        /* Mise en cache et mise à jour de l'état */
        cacheRef.current = data;
        cachedProgrammeRef.current = programme;
        setCourses(data);
        console.log(`${data.length} courses loaded and cached`);
        return data;
      } catch (err) {
        /* Gestion d'erreur */
        console.error("Erreur chargement courses:", err);
        setError(err.message || "Erreur de chargement");
        setCourses([]);
        cacheRef.current = [];
        throw err;
      } finally {
        /* Nettoyage */
        setLoading(false);
        loadingPromiseRef.current = null;
      }
    })();

    return loadingPromiseRef.current;
  };

  /* Chargement automatique au montage du composant */
  useEffect(() => {
    loadCourses();
  }, []);

  /* Réécoute des changements de programme */
  useEffect(() => {
    const handleProgrammeChange = () => {
      console.log("Programme changed, reloading cache...");
      loadCourses();
    };

    window.addEventListener("programmeChanged", handleProgrammeChange);
    return () =>
      window.removeEventListener("programmeChanged", handleProgrammeChange);
  }, []);

  /* Fonction de rafraîchissement forcé du cache */
  const refreshCourses = async (queryParams = {}) => {
    /* Invalidation du cache */
    cacheRef.current = null;
    cachedProgrammeRef.current = null;
    setCourses([]);
    return loadCourses(queryParams);
  };

  /* Fonction de vidage complet du cache */
  const clearCache = () => {
    cacheRef.current = null;
    cachedProgrammeRef.current = null;
    setCourses([]);
    setError(null);
    setLoading(false);
  };

  /* Valeurs exposées par le contexte */
  const value = {
    courses,           // Liste des cours actuels
    loadCourses,       // Fonction de chargement
    refreshCourses,    // Rafraîchissement forcé
    clearCache,        // Vidage du cache
    loading,           // État de chargement
    error,             // Erreur de chargement
  };

  return (
    <CoursesCacheContext.Provider value={value}>
      {children}
    </CoursesCacheContext.Provider>
  );
}

/* Hook personnalisé pour utiliser le cache des cours */
export function useCoursesCache() {
  const context = useContext(CoursesCacheContext);
  if (!context) {
    throw new Error(
      "useCoursesCache must be used within a CoursesCacheProvider"
    );
  }
  return context;
}
