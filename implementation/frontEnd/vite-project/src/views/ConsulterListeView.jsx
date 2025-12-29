// src/views/ConsulterListeView.jsx
import React, { useEffect, useState } from "react";
import { useCoursesCache } from "../controllers/CoursesCache.jsx";
import { fetchCourseById, fetchCoursesByPrefix } from "../api/coursesApi.js";
import CourseCard from "../composants/CourseCard.jsx";
import "../styles/ConsulterListe.css";

/* Constantes de configuration */
const ITEMS_PER_PAGE = 52;           // Nombre de cours par page
const MIN_SIGLE_LENGTH = 7;          // Longueur minimale pour recherche exacte
const LANG_KEY = "ift2255_langue";   // Clé localStorage pour la langue

/* Composant principal ConsulterListeView */
export default function ConsulterListeView({ goHome }) {
  /* États du cache des cours (géré par le provider) */
  const { courses, loading, error } = useCoursesCache();

  /* États locaux pour la recherche et pagination */
  const [lang, setLang] = useState("fr");                          // Langue actuelle
  const [searchId, setSearchId] = useState("");                    // Terme de recherche
  const [searchResults, setSearchResults] = useState(null);        // Résultats recherche
  const [apiLoading, setApiLoading] = useState(false);             // Loading API recherche
  const [apiError, setApiError] = useState(null);                  // Erreur API recherche
  const [currentPage, setCurrentPage] = useState(1);               // Page courante

  /* Objets de traduction i18n */
  const txt = {
    fr: {
      back: "Retour",
      placeholder: "IFT2255 ou IFT ou 2255",
      search: "Rechercher",
      loading: "Chargement des cours...",
      none: "Aucun cours à afficher",
      errorPrefix: "Erreur : ",
      nonePrefix: (p) => `Aucun cours trouvé commençant par "${p}"`,
    },
    en: {
      back: "Back",
      placeholder: "IFT2255 or IFT or 2255",
      search: "Search",
      loading: "Loading courses...",
      none: "No courses to display",
      errorPrefix: "Error: ",
      nonePrefix: (p) => `No course found starting with "${p}"`,
    },
  }[lang] || {};

  /* Chargement de la langue depuis localStorage au démarrage */
  useEffect(() => {
    const stored = window.localStorage.getItem(LANG_KEY);
    if (stored === "fr" || stored === "en") {
      setLang(stored);
    }
  }, []);

  /* Écoute des changements de langue depuis ProfilView */
  useEffect(() => {
    const handleLanguageChange = () => {
      console.log("Language changed");
      const storedLang = window.localStorage.getItem(LANG_KEY);
      if (storedLang === "fr" || storedLang === "en") {
        setLang(storedLang);
      }
    };

    window.addEventListener("languageChanged", handleLanguageChange);
    return () => window.removeEventListener("languageChanged", handleLanguageChange);
  }, []);

  /* Réinitialisation de la recherche quand le champ est vide */
  useEffect(() => {
    if (!searchId.trim()) {
      setSearchResults(null);
      setApiError(null);
      setCurrentPage(1);
    }
  }, [searchId]);

  /* Vérifie si le sigle est complet pour recherche exacte */
  const isCompleteSigle = (sigle) => sigle.length >= MIN_SIGLE_LENGTH;

  /* Recherche cours par ID exact */
  const rechercherCoursParId = async (sigle) => {
    const data = await fetchCourseById(sigle);
    setSearchResults([data]);
    setCurrentPage(1);
  };

  /* Recherche cours par préfixe */
  const rechercherCoursParPrefix = async (prefix) => {
    const data = await fetchCoursesByPrefix(prefix);
    if (data.length === 0) {
      setApiError(txt.nonePrefix(prefix));
      setSearchResults([]);
    } else {
      setSearchResults(data);
      setCurrentPage(1);
    }
  };

  /* Gestionnaire principal de recherche */
  const handleSearch = async () => {
    const trimmedId = searchId.trim().toUpperCase();
    if (!trimmedId) return;

    setApiLoading(true);
    setApiError(null);
    setSearchResults(null);

    try {
      if (isCompleteSigle(trimmedId)) {
        await rechercherCoursParId(trimmedId);
      } else {
        await rechercherCoursParPrefix(trimmedId);
      }
    } catch (err) {
      console.error("Erreur recherche cours :", err);
      setApiError(err.message || "Erreur lors de la recherche");
    } finally {
      setApiLoading(false);
    }
  };

  /* Gestionnaire touche Entrée dans le champ de recherche */
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  /* Navigation vers une page spécifique */
  const goToPage = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* États dérivés pour l'affichage */
  const isLoading = loading || apiLoading;                         // Loading global
  const hasError = apiError || error;                              // Erreur globale
  const sourceCourses = searchResults ?? courses ?? [];            // Source des cours
  const displayedCourses = sourceCourses.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );                                                              // Cours de la page courante
  const totalPages = Math.max(1, Math.ceil(sourceCourses.length / ITEMS_PER_PAGE)); // Total pages
  const hasNoCourses = !isLoading && !hasError && displayedCourses.length === 0; // Aucun cours

  /* Rendu JSX principal */
  return (
    <div className="cours-container">
      {/* Barre de navigation supérieure */}
      <header className="toolbar">
        <div className="top-row">
          <button onClick={goHome}>{txt.back}</button>

          {/* Barre de recherche */}
          <div className="search-bar">
            <input
              type="text"
              placeholder={txt.placeholder}
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button
              onClick={handleSearch}
              disabled={isLoading || !searchId.trim()}
            >
              {txt.search}
            </button>
          </div>
        </div>
      </header>

      {/* Indicateur de chargement */}
      {isLoading && <p>{txt.loading}</p>}

      {/* Message d'erreur */}
      {hasError && (
        <div className="error">
          <p>{txt.errorPrefix}{apiError || error}</p>
        </div>
      )}

      {/* Message aucun cours */}
      {hasNoCourses && <p>{txt.none}</p>}

      {/* Grille des cours */}
      {!isLoading && !hasError && displayedCourses.length > 0 && (
        <>
          <div className="courses-grid">
            {displayedCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  className={page === currentPage ? "active" : ""}
                  onClick={() => goToPage(page)}
                >
                  {page}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
