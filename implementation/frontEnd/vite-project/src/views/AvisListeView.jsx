// src/views/AvisListeView.jsx
import React, { useEffect, useMemo, useState, useRef } from "react";
import { useCoursesCache } from "../controllers/CoursesCache.jsx";
import {
  fetchCourseById,
  fetchCoursesByPrefix,
  fetchAvisByCourseId,
} from "../api/coursesApi.js";
import "../styles/AvisListe.css";

/* Constantes de configuration */
const ITEMS_PER_PAGE = 50;           // Nombre de cours par page
const MIN_SIGLE_LENGTH = 6;          // Longueur minimale pour recherche exacte
const LANG_KEY = "ift2255_langue";   // Clé localStorage pour la langue

// Clés de stockage localStorage
const CLIENT_ID_KEY = "ift2255_client_id";
const PSEUDO_MAP_KEY = "ift2255_pseudo_map";

// Liste des 20 pseudos disponibles pour l'anonymisation
const NICKNAMES = [
  "Mamadou", "Alice", "Samir", "Julie", "Karim", "Chloé", "Yanis", "Fatou",
  "Leo", "Nadia", "Olivier", "Inès", "Hugo", "Sara", "Amine", "Emma",
  "Noah", "Lina", "Thomas", "Amina",
];

/* Composant principal AvisListeView */
export default function AvisListeView({ goHome }) {
  /* Hooks du cache des cours */
  const { courses, loadCourses, loading, error } = useCoursesCache();

  /* États de l'interface */
  const [clientId, setClientId] = useState("");                    // ID unique client
  const [lang, setLang] = useState("fr");                          // Langue (fr/en)
  const [searchId, setSearchId] = useState("");                    // Terme de recherche
  const [searchResults, setSearchResults] = useState(null);        // Résultats recherche
  const [apiLoading, setApiLoading] = useState(false);             // Loading API recherche
  const [apiError, setApiError] = useState(null);                  // Erreur API recherche
  const [currentPage, setCurrentPage] = useState(1);               // Page courante
  const [selectedCourseId, setSelectedCourseId] = useState(null);  // Cours sélectionné
  const [selectedCourseAvis, setSelectedCourseAvis] = useState([]); // Avis du cours sélectionné
  const [loadingAvis, setLoadingAvis] = useState(false);           // Loading avis
  const [showModal, setShowModal] = useState(false);               // Affichage modal

  /* Objets de traduction i18n */
  const t = {
    fr: {
      back: "Retour",
      searchPlaceholder: "IFT2255 ou IFT ou 2255",
      search: "Rechercher",
      searching: "Recherche...",
      title: "Avis par cours",
      loading: "Chargement...",
      errorPrefix: "Erreur : ",
      noneCourses: "Aucun cours trouvé.",
      noneForPrefix: (p) => `Aucun cours trouvé commençant par "${p}"`,
      code: "Code",
      name: "Nom",
      sessions: "Sessions",
      reviews: "Avis",
      loadingReviews: "Chargement des avis...",
      noneReviews: "Aucun avis pour ce cours.",
      sessionLabel: "Session",
      difficultyLabel: "Difficulté",
      more: (n) => `+${n} avis...`,
      anon: "Anonyme",
    },
    en: {
      back: "Back",
      searchPlaceholder: "IFT2255 or IFT or 2255",
      search: "Search",
      searching: "Searching...",
      title: "Reviews by course",
      loading: "Loading...",
      errorPrefix: "Error: ",
      noneCourses: "No course found.",
      noneForPrefix: (p) => `No course found starting with "${p}"`,
      code: "Code",
      name: "Name",
      sessions: "Terms",
      reviews: "Reviews",
      loadingReviews: "Loading reviews...",
      noneReviews: "No review for this course.",
      sessionLabel: "Term",
      difficultyLabel: "Difficulty",
      more: (n) => `+${n} reviews...`,
      anon: "Anonymous",
    },
  }[lang] || {};

  /* Référence pour stocker les pseudos par cours */
  const nicknamesByCourseRef = useRef({});

  /* Génération ID client unique */
  useEffect(() => {
    let id = window.localStorage.getItem(CLIENT_ID_KEY);
    if (!id) {
      id = crypto.randomUUID();
      window.localStorage.setItem(CLIENT_ID_KEY, id);
    }
    setClientId(id);
  }, []);

  /* Chargement de la langue depuis localStorage */
  useEffect(() => {
    const stored = window.localStorage.getItem(LANG_KEY);
    if (stored === "fr" || stored === "en") {
      setLang(stored);
    }
  }, []);

  /* Chargement de la map des pseudos depuis localStorage */
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(PSEUDO_MAP_KEY);
      if (raw) {
        const obj = JSON.parse(raw);
        const byCourse = {};
        Object.entries(obj).forEach(([courseId, authorsObj]) => {
          const m = new Map();
          Object.entries(authorsObj).forEach(([author, nick]) => {
            m.set(author, nick);
          });
          byCourse[courseId] = m;
        });
        nicknamesByCourseRef.current = byCourse;
      }
    } catch (e) {
      console.error("Erreur lecture pseudo map:", e);
      nicknamesByCourseRef.current = {};
    }
  }, []);

  /* Sauvegarde des pseudos en localStorage */
  const persistNicknames = () => {
    const plain = {};
    Object.entries(nicknamesByCourseRef.current).forEach(([courseId, map]) => {
      plain[courseId] = Object.fromEntries(map.entries());
    });
    window.localStorage.setItem(PSEUDO_MAP_KEY, JSON.stringify(plain));
  };

  /* Attribution d'un pseudo unique par auteur et cours */
  const getNicknameForAuthor = (courseId, rawAuthor) => {
    const authorKey = rawAuthor || "anonyme";

    if (!nicknamesByCourseRef.current[courseId]) {
      nicknamesByCourseRef.current[courseId] = new Map();
    }
    const map = nicknamesByCourseRef.current[courseId];

    if (map.has(authorKey)) {
      return map.get(authorKey);
    }

    const used = new Set(map.values());
    const available = NICKNAMES.filter((n) => !used.has(n));

    let chosen;
    if (available.length > 0) {
      const idx = Math.floor(Math.random() * available.length);
      chosen = available[idx];
    } else {
      chosen = `Utilisateur ${map.size + 1}`;
    }

    map.set(authorKey, chosen);
    persistNicknames();
    return chosen;
  };

  /* Chargement initial des cours */
  useEffect(() => {
    loadCourses().catch((err) =>
      console.error("Erreur lors du chargement des cours :", err)
    );
  }, [loadCourses]);

  /* Réinitialisation recherche vide */
  useEffect(() => {
    if (!searchId.trim()) {
      setSearchResults(null);
      setApiError(null);
      setCurrentPage(1);
    }
  }, [searchId]);

  /* Chargement des avis du cours sélectionné */
  useEffect(() => {
    if (!selectedCourseId) {
      setSelectedCourseAvis([]);
      return;
    }

    setLoadingAvis(true);
    fetchAvisByCourseId(selectedCourseId)
      .then((avis) => setSelectedCourseAvis(Array.isArray(avis) ? avis : []))
      .catch((e) => {
        console.error("Erreur avis:", e);
        setSelectedCourseAvis([]);
      })
      .finally(() => setLoadingAvis(false));
  }, [selectedCourseId]);

  /* Vérifie si le sigle est complet pour recherche exacte */
  const isCompleteSigle = (sigle) => sigle.length >= MIN_SIGLE_LENGTH;

  /* Recherche cours par ID exact */
  const rechercherCoursParId = async (sigle) => {
    const data = await fetchCourseById(sigle);
    setSearchResults([data]);
  };

  /* Recherche cours par préfixe */
  const rechercherCoursParPrefix = async (prefix) => {
    const data = await fetchCoursesByPrefix(prefix);
    if (data.length === 0) {
      setApiError(t.noneForPrefix(prefix));
    } else {
      setSearchResults(data);
    }
  };

  /* Gestionnaire de recherche */
  const handleSearch = async () => {
    const trimmedId = searchId.trim().toUpperCase();
    if (!trimmedId) return;

    setApiLoading(true);
    setApiError(null);
    setSearchResults(null);
    setCurrentPage(1);

    try {
      if (isCompleteSigle(trimmedId)) {
        await rechercherCoursParId(trimmedId);
      } else {
        await rechercherCoursParPrefix(trimmedId);
      }
    } catch (err) {
      setApiError(err.message || "Erreur lors de la recherche");
    } finally {
      setApiLoading(false);
    }
  };

  /* Sélection d'un cours */
  const selectCourse = (courseId) => {
    setSelectedCourseId(courseId);
    setShowModal(true);
  };

  /* Fermeture modal */
  const closeModal = () => {
    setShowModal(false);
    setSelectedCourseId(null);
  };

  /* Recherche sur Entrée */
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  /* Changement de page */
  const goToPage = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* Cours actuellement affichés */
  let currentCourses = [];
  if (searchResults) {
    currentCourses = searchResults;
  } else if (courses) {
    currentCourses = courses;
  }

  /* Pagination */
  const displayedCourses = currentCourses.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const totalPages = Math.max(1, Math.ceil(currentCourses.length / ITEMS_PER_PAGE));

  /* États globaux */
  const isLoading = loading || apiLoading;
  const hasError = error || apiError;
  const hasNoCourses = !isLoading && !hasError && displayedCourses.length === 0;

  const allAvailableCourses = searchResults || courses || [];
  const selectedCourse = allAvailableCourses.find((c) => c.id === selectedCourseId);

  /* Sessions disponibles par cours */
  const sessionsByCourse = useMemo(() => {
    const map = {};
    (currentCourses || []).forEach((course) => {
      const terms = course.available_terms || {};
      const sessions = [];
      if (terms.winter) sessions.push(lang === "fr" ? "Hiver" : "Winter");
      if (terms.summer) sessions.push(lang === "fr" ? "Été" : "Summer");
      if (terms.autumn) sessions.push(lang === "fr" ? "Automne" : "Autumn");
      map[course.id] = sessions;
    });
    return map;
  }, [currentCourses, lang]);

  /* Rendu JSX */
  return (
    <div className="cours-container">
      {/* Barre de navigation supérieure */}
      <div className="top-row">
        <button onClick={goHome}>{t.back}</button>
        <div className="search-bar">
          <input
            type="text"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={t.searchPlaceholder}
            className="search-input"
          />
          <button onClick={handleSearch} disabled={apiLoading}>
            {apiLoading ? t.searching : t.search}
          </button>
        </div>
      </div>

      <h2>{t.title}</h2>

      {/* États de chargement/erreur */}
      {isLoading && <p>{t.loading}</p>}
      {hasError && <p className="error">{t.errorPrefix}{hasError}</p>}
      {hasNoCourses && <p>{t.noneCourses}</p>}

      {/* Tableau des cours */}
      {!isLoading && !hasError && displayedCourses.length > 0 && (
        <>
          <table className="courses-table">
            <thead>
              <tr>
                <th>{t.code}</th>
                <th>{t.name}</th>
                <th>{t.sessions}</th>
                <th>{t.reviews}</th>
              </tr>
            </thead>
            <tbody>
              {displayedCourses.map((course) => {
                const sessions = sessionsByCourse[course.id] || [];
                return (
                  <tr
                    key={course.id}
                    onClick={() => selectCourse(course.id)}
                    style={{ cursor: "pointer" }}
                  >
                    <td>{course.id}</td>
                    <td>{course.name}</td>
                    <td>{sessions.length ? sessions.join(", ") : "—"}</td>
                    <td>{course.nbAvis ?? 0}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

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

      {/* Modal des avis */}
      {showModal && selectedCourse && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selectedCourse.id} - {selectedCourse.name}</h3>
              <button onClick={closeModal}>×</button>
            </div>

            <div className="modal-body">
              {loadingAvis ? (
                <p>{t.loadingReviews}</p>
              ) : selectedCourseAvis.length === 0 ? (
                <p>{t.noneReviews}</p>
              ) : (
                <div className="avis-list">
                  {/* Affichage des 10 premiers avis */}
                  {selectedCourseAvis.slice(0, 10).map((avis, index) => {
                    /* Nettoyage du texte des avis */
                    let cleanedText = (avis.texte || "").trim();
                    const lines = cleanedText.split("\n").map(l => l.trim()).filter(l => l !== "");
                    if (lines.length > 0 && lines[lines.length - 1] === "0") {
                      lines.pop();
                    }
                    cleanedText = lines.join("\n");

                    const rawAuthor = avis.auteur || t.anon;
                    const pseudo = getNicknameForAuthor(selectedCourse.id, rawAuthor);

                    return (
                      <div key={avis.id || index} className="avis-item">
                        <strong>{pseudo}:</strong>
                        <p style={{ whiteSpace: "pre-line" }}>{cleanedText}</p>
                        {avis.session && (
                          <span className="avis-meta">{t.sessionLabel}: {avis.session}</span>
                        )}
                        {avis.difficulte != null && avis.difficulte > 0 && (
                          <span className="avis-meta">
                            {t.difficultyLabel}: {avis.difficulte}/5
                          </span>
                        )}
                      </div>
                    );
                  })}
                  {selectedCourseAvis.length > 10 && (
                    <p className="more-avis">{t.more(selectedCourseAvis.length - 10)}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
