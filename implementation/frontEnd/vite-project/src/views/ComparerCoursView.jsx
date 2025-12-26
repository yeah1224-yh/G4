// src/views/ComparerCoursView.jsx
import React, { useState, useEffect, useMemo, useRef } from "react";
import { useCoursesCache } from "../controllers/CoursesCache.jsx";
import {
  fetchCourseById,
  fetchCoursesByPrefix,
  fetchAvisByCourseId,
  fetchCourseStats,
} from "../api/coursesApi.js";
import "../styles/ComparerCours.css";
import "../styles/CourseCard2.css";

/* Constantes de configuration */
const ITEMS_PER_PAGE = 20;           // Nombre de cours par page dans la modal
const MIN_SIGLE_LENGTH = 6;          // Longueur minimale pour recherche exacte
const LANG_KEY = "ift2255_langue";   // Clé localStorage pour la langue

/* Objets de traduction i18n */
const txt = {
  fr: {
    backHome: "Retour à l'accueil",
    selectCourse: "Cliquer pour choisir cours",
    sameCoursError: "Impossible de sélectionner le même cours pour les deux slots.",
    chooseCourse: "Choisir un cours",
    search: "Rechercher",
    loading: "Chargement des cours...",
    noCoursesFound: (p) => `Aucun cours trouvé pour "${p}"`,
    previous: "Précédent",
    next: "Suivant",
    page: "Page",
    of: "sur",
    close: "Fermer",
    comparing: "Comparaison...",
    compare: "Comparer",
    comparisonResult: "Résultat de la comparaison",
    academicAverage: "Moyenne académique",
    successScore: "Score de réussite",
    participants: "Participants",
    difficulty: "Difficulté",
    difficult: "Difficile",
    medium: "Moyen",
    easy: "Facile",
    credits: "Crédits",
    schedule: "Horaires",
    session: "Session",
    prerequisite: "Préalable",
    none: "Aucun",
    notSpecified: "Non spécifié",
    ex: "Ex",
    loadingError: "Erreur lors du chargement des données de comparaison.",
    autumn: "Automne",
    winter: "Hiver",
    summer: "Été",
  },
  en: {
    backHome: "Back to Home",
    selectCourse: "Click to select course",
    sameCoursError: "Cannot select the same course for both slots.",
    chooseCourse: "Choose a course",
    search: "Search",
    loading: "Loading courses...",
    noCoursesFound: (p) => `No courses found for "${p}"`,
    previous: "Previous",
    next: "Next",
    page: "Page",
    of: "of",
    close: "Close",
    comparing: "Comparing...",
    compare: "Compare",
    comparisonResult: "Comparison Result",
    academicAverage: "Academic Average",
    successScore: "Success Score",
    participants: "Participants",
    difficulty: "Difficulty",
    difficult: "Difficult",
    medium: "Medium",
    easy: "Easy",
    credits: "Credits",
    schedule: "Schedule",
    session: "Session",
    prerequisite: "Prerequisite",
    none: "None",
    notSpecified: "Not specified",
    ex: "E.g.",
    loadingError: "Error loading comparison data.",
    autumn: "Fall",
    winter: "Winter",
    summer: "Summer",
  },
};

/* Fonction utilitaire : formatage des horaires */
function formatSchedules(schedules = [], t) {
  if (!Array.isArray(schedules) || schedules.length === 0) return t.notSpecified;
  const items = schedules
    .filter(
      (s) =>
        s &&
        typeof s.day === "string" &&
        typeof s.start === "string" &&
        typeof s.end === "string"
    )
    .map((s) => `${s.day} ${s.start}-${s.end}`);
  return items.length > 0 ? items.join(", ") : t.notSpecified;
}

/* Fonction utilitaire : formatage des sessions */
function formatTerms(terms, t) {
  if (!terms) return t.notSpecified;
  const termLabels = {
    autumn: t.autumn,
    winter: t.winter,
    summer: t.summer,
  };
  const active = Object.entries(terms)
    .filter(([, v]) => v)
    .map(([k]) => termLabels[k] || k);
  return active.length > 0 ? active.join(", ") : t.notSpecified;
}

/* Fonction utilitaire : nettoyage du prérequis */
function cleanPrerequisite(text, t) {
  if (!text) return t.none;
  return text.replace(/^prerequisite_courses\s*:\s*/i, "").trim();
}

/* Fonction utilitaire : résumé des avis */
function buildAvisSummary(avisList = []) {
  if (!Array.isArray(avisList) || avisList.length === 0) {
    return { count: 0, avgNote: null, avgDiff: null, avgWork: null };
  }
  let sumNote = 0, sumDiff = 0, sumWork = 0;
  let nNote = 0, nDiff = 0, nWork = 0;

  for (const a of avisList) {
    if (a.note != null) {
      sumNote += a.note;
      nNote++;
    }
    if (a.difficulte != null) {
      sumDiff += a.difficulte;
      nDiff++;
    }
    if (a.volumeTravail != null) {
      sumWork += a.volumeTravail;
      nWork++;
    }
  }

  const round1 = (x, n) => (n > 0 ? Math.round((x / n) * 10) / 10 : null);

  return {
    count: avisList.length,
    avgNote: round1(sumNote, nNote),
    avgDiff: round1(sumDiff, nDiff),
    avgWork: round1(sumWork, nWork),
  };
}

/* Fonction utilitaire : difficulté basée sur la moyenne */
function getDifficultyFromMoyenne(moyenne, t) {
  if (!moyenne) return "—";

  const gradeOrder = [
    "E", "D-", "D", "D+", "C-", "C", "C+", "B-", "B", "B+", "A-", "A", "A+",
  ];
  const index = gradeOrder.indexOf(moyenne);

  if (index === -1) return "—";
  if (index <= 4) return t.difficult;
  if (index <= 7) return t.medium;
  return t.easy;
}

/* Composant principal ComparerCoursView */
export default function ComparerCoursView({ goHome }) {
  /* Hooks du cache des cours */
  const { courses, loadCourses, loading } = useCoursesCache();

  /* États de l'interface */
  const [lang, setLang] = useState("fr");                           // Langue
  const [selected1, setSelected1] = useState(null);                 // Cours slot 1
  const [selected2, setSelected2] = useState(null);                 // Cours slot 2
  const [openModal, setOpenModal] = useState(false);                // Modal sélection ouverte
  const [currentTarget, setCurrentTarget] = useState(null);         // Slot cible (1 ou 2)
  const [searchTerm, setSearchTerm] = useState("");                 // Terme de recherche
  const [searchResults, setSearchResults] = useState(null);         // Résultats recherche
  const [apiLoading, setApiLoading] = useState(false);              // Loading API
  const [apiError, setApiError] = useState(null);                   // Erreur API
  const [error, setError] = useState("");                           // Message erreur popup
  const [showErrorPopup, setShowErrorPopup] = useState(false);      // Affichage popup erreur
  const [currentPage, setCurrentPage] = useState(1);                // Page courante modal
  const [searchFocus, setSearchFocus] = useState(false);            // Focus champ recherche
  const [compareResult, setCompareResult] = useState(null);         // Résultat comparaison
  const [compareLoading, setCompareLoading] = useState(false);      // Loading comparaison

  /* Références DOM */
  const slot1Ref = useRef(null);
  const slot2Ref = useRef(null);
  const errorTimeoutRef = useRef(null);

  /* Traductions actives */
  const t = txt[lang] || txt.fr;

  /* Chargement de la langue depuis localStorage */
  useEffect(() => {
    const stored = window.localStorage.getItem(LANG_KEY);
    if (stored === "fr" || stored === "en") {
      setLang(stored);
    }
  }, []);

  /* Chargement initial des cours */
  useEffect(() => {
    if (!courses) {
      loadCourses().catch((err) =>
        console.error("Erreur chargement cours:", err)
      );
    }
  }, [courses, loadCourses]);

  /* Nettoyage timeout erreur */
  useEffect(() => {
    return () => {
      if (errorTimeoutRef.current) clearTimeout(errorTimeoutRef.current);
    };
  }, []);

  /* Vérifie si le sigle est complet pour recherche exacte */
  const isCompleteSigle = (sigle) => sigle.length >= MIN_SIGLE_LENGTH;

  /* Recherche par sigle exact */
  const searchBySigle = async (sigle) => {
    try {
      const data = await fetchCourseById(sigle);
      if (!data) {
        setSearchResults([]);
        setApiError(
          lang === "fr"
            ? `Aucun cours trouvé avec l'id "${sigle}"`
            : `No courses found with id "${sigle}"`
        );
      } else {
        setSearchResults([data]);
      }
    } catch (err) {
      throw err;
    }
  };

  /* Recherche par préfixe */
  const searchByPrefix = async (prefix) => {
    try {
      const data = await fetchCoursesByPrefix(prefix);
      if (!Array.isArray(data) || data.length === 0) {
        setSearchResults([]);
        setApiError(t.noCoursesFound(prefix));
      } else {
        setSearchResults(data);
      }
    } catch (err) {
      throw err;
    }
  };

  /* Gestionnaire de recherche */
  const handleSearch = async () => {
    const trimmed = searchTerm.trim().toUpperCase();
    if (!trimmed) {
      setSearchResults(null);
      setApiError(null);
      setCurrentPage(1);
      return;
    }

    setApiLoading(true);
    setApiError(null);
    setSearchResults(null);
    setCurrentPage(1);

    try {
      if (isCompleteSigle(trimmed)) {
        await searchBySigle(trimmed);
      } else {
        await searchByPrefix(trimmed);
      }
    } catch (err) {
      setApiError(
        err.message ||
          (lang === "fr" ? "Erreur lors de la recherche" : "Error during search")
      );
      setSearchResults([]);
    } finally {
      setApiLoading(false);
    }
  };

  /* Gestionnaire touche Entrée */
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  /* Liste des cours disponibles (recherche ou tous) */
  const baseList = searchResults === null ? courses || [] : searchResults;
  const filteredCourses = useMemo(() => {
    return baseList || [];
  }, [baseList]);

  /* Pagination */
  const totalPages = Math.max(1, Math.ceil(filteredCourses.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentCourses = filteredCourses.slice(startIndex, endIndex);

  /* Affichage popup erreur */
  const showMessage = (message, duration = 2500) => {
    setError(message);
    setShowErrorPopup(true);
    if (errorTimeoutRef.current) clearTimeout(errorTimeoutRef.current);
    errorTimeoutRef.current = setTimeout(() => setShowErrorPopup(false), duration);
  };

  /* Animation pulse sur un slot */
  const animateSlot = (slotNumber) => {
    const ref = slotNumber === 1 ? slot1Ref : slot2Ref;
    if (ref.current) {
      ref.current.classList.add("pulse");
      setTimeout(() => ref.current?.classList.remove("pulse"), 300);
    }
  };

  /* Ouvre la modal de sélection pour un slot */
  const rechercherCours = (slot) => {
    setCurrentTarget(slot);
    setOpenModal(true);
    setSearchTerm("");
    setSearchResults(null);
    setApiError(null);
    setCurrentPage(1);
  };

  /* Sélectionne un cours pour le slot cible */
  const choisirCours = (course) => {
    const otherSelected = currentTarget === 1 ? selected2 : selected1;
    if (otherSelected?.id === course.id) {
      showMessage(t.sameCoursError);
      return;
    }
    animateSlot(currentTarget);
    if (currentTarget === 1) {
      setSelected1(course);
    } else {
      setSelected2(course);
    }
    setOpenModal(false);
  };

  /* Lance la comparaison des deux cours */
  const comparerCoursA = async () => {
    if (!selected1 || !selected2) return;

    setCompareLoading(true);
    setCompareResult(null);

    try {
      const [avis1, avis2] = await Promise.all([
        fetchAvisByCourseId(selected1.id),
        fetchAvisByCourseId(selected2.id),
      ]);

      const [stats1, stats2] = await Promise.all([
        fetchCourseStats(selected1.id).catch(() => null),
        fetchCourseStats(selected2.id).catch(() => null),
      ]);

      const sum1 = buildAvisSummary(avis1);
      const sum2 = buildAvisSummary(avis2);

      setCompareResult({
        left: { course: selected1, avis: sum1, stats: stats1 },
        right: { course: selected2, avis: sum2, stats: stats2 },
      });
    } catch (err) {
      console.error("Erreur comparaison:", err);
      showMessage(t.loadingError, 4000);
    } finally {
      setCompareLoading(false);
    }
  };

  /* États dérivés */
  const isCompareDisabled = !selected1 || !selected2 || selected1.id === selected2.id;
  const isLoading = loading || apiLoading;
  const hasError = Boolean(apiError);

  /* Rendu principal */
  return (
    <div className="compare-container">
      {/* Bouton retour */}
      <button onClick={goHome} className="compare-back-button">
        {t.backHome}
      </button>

      {/* Slots de comparaison */}
      <Slots
        selected1={selected1}
        selected2={selected2}
        slot1Ref={slot1Ref}
        slot2Ref={slot2Ref}
        rechercherCours={rechercherCours}
        t={t}
      />

      {/* Bouton Comparer */}
      <button
        onClick={comparerCoursA}
        disabled={isCompareDisabled || compareLoading}
        className={`compare-button ${isCompareDisabled || compareLoading ? "disabled" : ""}`}
      >
        {compareLoading ? t.comparing : t.compare}
      </button>

      {/* Popup d'erreur */}
      {showErrorPopup && <div className="compare-error-popup">{error}</div>}

      {/* Modal de sélection de cours */}
      {openModal && (
        <CourseSelectorModal
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          handleSearch={handleSearch}
          handleKeyDown={handleKeyDown}
          filteredCourses={filteredCourses}
          isLoading={isLoading}
          hasError={hasError}
          apiError={apiError}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
          choisirCours={choisirCours}
          closeModal={() => setOpenModal(false)}
          searchFocus={searchFocus}
          setSearchFocus={setSearchFocus}
          t={t}
        />
      )}

      {/* Modal de résultat de comparaison */}
      {compareResult && (
        <ComparisonModal
          left={compareResult.left}
          right={compareResult.right}
          onClose={() => setCompareResult(null)}
          t={t}
        />
      )}
    </div>
  );
}

/* Composant Slots de comparaison */
function Slots({ selected1, selected2, slot1Ref, slot2Ref, rechercherCours, t }) {
  const renderSlot = (selected, ref, slotNumber) => (
    <div
      ref={ref}
      onClick={() => rechercherCours(slotNumber)}
      className={`compare-slot ${selected ? "filled" : "empty"}`}
    >
      {selected ? (
        <>
          <strong className="compare-course-title">{selected.name}</strong>
          <small className="compare-course-id">{selected.id}</small>
          <p className="compare-course-description">{selected.description}</p>
          <div><strong>{t.credits}:</strong> {selected.credits}</div>
          <div><strong>{t.schedule}:</strong> {formatSchedules(selected.schedules, t)}</div>
          <div><strong>{t.session}:</strong> {formatTerms(selected.available_terms, t)}</div>
          <div><strong>{t.prerequisite}:</strong> {cleanPrerequisite(selected.requirement_text, t)}</div>
        </>
      ) : (
        <span className="compare-slot-placeholder">{t.selectCourse} {slotNumber}</span>
      )}
    </div>
  );

  return (
    <div className="compare-slots-container">
      {renderSlot(selected1, slot1Ref, 1)}
      <div className="compare-vs">VS</div>
      {renderSlot(selected2, slot2Ref, 2)}
    </div>
  );
}

/* Composant Modal de sélection de cours */
function CourseSelectorModal({
  searchTerm, setSearchTerm, handleSearch, handleKeyDown, filteredCourses,
  isLoading, hasError, apiError, currentPage, setCurrentPage, totalPages,
  choisirCours, closeModal, searchFocus, setSearchFocus, t,
}) {
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentCourses = filteredCourses.slice(startIndex, endIndex);

  return (
    <div className="compare-modal-overlay" onClick={closeModal}>
      <div className="compare-modal-content" onClick={(e) => e.stopPropagation()}>
        <h3 className="compare-modal-title">{t.chooseCourse}</h3>

        {/* Barre de recherche */}
        <div className="compare-search-row">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={`${t.ex}: IFT2255 ou IFT ou 2255`}
            autoFocus
            onFocus={() => setSearchFocus(true)}
            onBlur={() => setSearchFocus(false)}
            onKeyDown={handleKeyDown}
            className={`compare-search-input ${searchFocus ? "focused" : ""}`}
          />
          <button
            onClick={handleSearch}
            disabled={isLoading || !searchTerm.trim()}
            className="compare-search-button"
          >
            {t.search}
          </button>
        </div>

        {/* États chargement/erreur */}
        {isLoading && <p>{t.loading}</p>}
        {hasError && apiError && <p className="compare-error-text">{apiError}</p>}
        {!isLoading && !hasError && filteredCourses.length === 0 && searchTerm && (
          <p>{t.noCoursesFound(searchTerm)}</p>
        )}

        {/* Grille des cours */}
        {!isLoading && filteredCourses.length > 0 && (
          <>
            {/* Pagination */}
            <div className="compare-pagination">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="compare-page-button"
              >
                {t.previous}
              </button>
              <span className="compare-page-info">
                {t.page} {currentPage} {t.of} {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="compare-page-button"
              >
                {t.next}
              </button>
            </div>

            {/* Cartes de cours */}
            <div className="compare-courses-grid">
              {currentCourses.map((course) => (
                <div
                  key={course.id}
                  className="compare-course-card2"
                  onClick={() => choisirCours(course)}
                >
                  <strong className="compare-course2-title">{course.id}</strong>
                  <p className="compare-course2-name">{course.name}</p>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Bouton fermer */}
        <button onClick={closeModal} className="compare-close-button">
          {t.close}
        </button>
      </div>
    </div>
  );
}

/* Composant Modal de résultat de comparaison */
function ComparisonModal({ left, right, onClose, t }) {
  const { course: c1, avis: a1, stats: s1 } = left;
  const { course: c2, avis: a2, stats: s2 } = right;

  const fmt = (x) => (x == null ? "—" : x);

  return (
    <div className="compare-result-overlay" onClick={onClose}>
      <div className="compare-result" onClick={(e) => e.stopPropagation()}>
        <h3>
          <span>{t.comparisonResult}</span>
          <button onClick={onClose} className="compare-result-close">✕</button>
        </h3>
        <table className="compare-table">
          <thead>
            <tr>
              <th></th>
              <th>{c1.id} — {c1.name}</th>
              <th>{c2.id} — {c2.name}</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>{t.academicAverage}</td><td>{s1 ? fmt(s1.moyenne) : "—"}</td><td>{s2 ? fmt(s2.moyenne) : "—"}</td></tr>
            <tr><td>{t.successScore}</td><td>{s1 ? fmt(s1.score) : "—"}</td><td>{s2 ? fmt(s2.score) : "—"}</td></tr>
            <tr><td>{t.participants}</td><td>{s1 ? fmt(s1.participants) : "—"}</td><td>{s2 ? fmt(s2.participants) : "—"}</td></tr>
            <tr>
              <td>{t.difficulty}</td>
              <td>{s1 ? getDifficultyFromMoyenne(s1.moyenne, t) : "—"}</td>
              <td>{s2 ? getDifficultyFromMoyenne(s2.moyenne, t) : "—"}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
