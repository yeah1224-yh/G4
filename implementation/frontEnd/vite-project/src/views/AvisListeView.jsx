// src/views/AvisListeView.jsx
import React, { useEffect, useMemo, useState, useRef } from "react";
import { useCoursesCache } from "../controllers/CoursesCache.jsx";
import {
  fetchCourseById,
  fetchCoursesByPrefix,
  fetchAvisByCourseId,
  postAvis,
} from "../api/coursesApi.js";
import "../styles/AvisListe.css";

const ITEMS_PER_PAGE = 50;
const MIN_SIGLE_LENGTH = 6;
const LANG_KEY = "ift2255_langue";
const CLIENT_ID_KEY = "ift2255_client_id";
const PSEUDO_MAP_KEY = "ift2255_pseudo_map";

const NICKNAMES = [
  "Mamadou", "Alice", "Samir", "Julie", "Karim", "Chloé", "Yanis", "Fatou",
  "Leo", "Nadia", "Olivier", "Inès", "Hugo", "Sara", "Amine", "Emma",
  "Noah", "Lina", "Thomas", "Amina",
];

export default function AvisListeView({ goHome }) {
  const { courses, loadCourses, refreshCourses, loading, error } = useCoursesCache();
  const [clientId, setClientId] = useState("");
  const [lang, setLang] = useState("fr");
  const [searchId, setSearchId] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [apiLoading, setApiLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [selectedCourseAvis, setSelectedCourseAvis] = useState([]);
  const [loadingAvis, setLoadingAvis] = useState(false);
  const [showModal, setShowModal] = useState(false);

  /* États formulaire avis */
  const [showAddAvisForm, setShowAddAvisForm] = useState(false);
  const [newAvis, setNewAvis] = useState({
    auteur: "",
    texte: "",
    session: "",
    difficulte: "",
    volumeTravail: "",
    note: ""
  });
  const [submittingAvis, setSubmittingAvis] = useState(false);
  const [avisSubmitError, setAvisSubmitError] = useState(null);

  /* Toast de succès auto-disparition */
  const [showSuccessToast, setShowSuccessToast] = useState(false);

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
      workloadLabel: "Volume",
      ratingLabel: "Note",
      more: (n) => `+${n} avis...`,
      anon: "Anonyme",
      addReview: "Ajouter un commentaire",
      cancel: "Annuler",
      submit: "Publier",
      submitting: "Publication...",
      authorLabel: "Votre pseudo (optionnel)",
      textLabel: "Votre avis",
      sessionLabelForm: "Session (ex: A24)",
      difficultyLabelForm: "Difficulté (1-5)",
      workloadLabelForm: "Volume de travail (1-5)",
      ratingLabelForm: "Note globale (1-5)",
      success: "Avis publié !",
      errorRequired: "Ce champ est requis",
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
      workloadLabel: "Workload",
      ratingLabel: "Rating",
      more: (n) => `+${n} reviews...`,
      anon: "Anonymous",
      addReview: "Add a review",
      cancel: "Cancel",
      submit: "Publish",
      submitting: "Publishing...",
      authorLabel: "Your nickname (optional)",
      textLabel: "Your review",
      sessionLabelForm: "Term (ex: A24)",
      difficultyLabelForm: "Difficulty (1-5)",
      workloadLabelForm: "Workload (1-5)",
      ratingLabelForm: "Overall rating (1-5)",
      success: "Review published!",
      errorRequired: "This field is required",
    },
  }[lang] || {};

  const nicknamesByCourseRef = useRef({});

  /* Effets d'initialisation */
  useEffect(() => {
    let id = window.localStorage.getItem(CLIENT_ID_KEY);
    if (!id) {
      id = crypto.randomUUID();
      window.localStorage.setItem(CLIENT_ID_KEY, id);
    }
    setClientId(id);
  }, []);

  useEffect(() => {
    const stored = window.localStorage.getItem(LANG_KEY);
    if (stored === "fr" || stored === "en") {
      setLang(stored);
    }
  }, []);

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

  /* Auto-disparition toast après 3s */
  useEffect(() => {
    if (showSuccessToast) {
      const timer = setTimeout(() => {
        setShowSuccessToast(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessToast]);

  const persistNicknames = () => {
    const plain = {};
    Object.entries(nicknamesByCourseRef.current).forEach(([courseId, map]) => {
      plain[courseId] = Object.fromEntries(map.entries());
    });
    window.localStorage.setItem(PSEUDO_MAP_KEY, JSON.stringify(plain));
  };

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

  /* Soumission avis + toast + refresh auto + refresh liste cours */
  const handleSubmitAvis = async (e) => {
    e.preventDefault();
    if (!newAvis.texte.trim()) {
      setAvisSubmitError(t.errorRequired);
      return;
    }

    setSubmittingAvis(true);
    setAvisSubmitError(null);

    try {
      const avisData = {
        coursId: selectedCourseId,
        auteur: newAvis.auteur.trim() || null,
        texte: newAvis.texte.trim(),
        session: newAvis.session.trim() || null,
        difficulte: newAvis.difficulte ? parseInt(newAvis.difficulte) : null,
        volumeTravail: newAvis.volumeTravail ? parseInt(newAvis.volumeTravail) : null,
        note: newAvis.note ? parseInt(newAvis.note) : null,
      };

      await postAvis(avisData);
      
      // SUCCESS TOAST + RESET + REFRESH AUTO
      setShowSuccessToast(true);
      setNewAvis({ auteur: "", texte: "", session: "", difficulte: "", volumeTravail: "", note: "" });
      setShowAddAvisForm(false);
      
      // Refresh automatique des avis du modal
      setLoadingAvis(true);
      const freshAvis = await fetchAvisByCourseId(selectedCourseId);
      setSelectedCourseAvis(Array.isArray(freshAvis) ? freshAvis : []);
      setLoadingAvis(false);
      
      // Refresh de la liste des cours pour mettre à jour nbAvis
      // Force un rechargement depuis l'API en invalidant le cache
      await refreshCourses(); // ← Utilise refreshCourses au lieu de loadCourses
      
      // Si on est en mode recherche, rafraîchir aussi les résultats
      if (searchResults) {
        const trimmedId = searchId.trim().toUpperCase();
        if (trimmedId) {
          if (isCompleteSigle(trimmedId)) {
            const updatedCourse = await fetchCourseById(trimmedId);
            setSearchResults([updatedCourse]);
          } else {
            const updatedResults = await fetchCoursesByPrefix(trimmedId);
            setSearchResults(updatedResults);
          }
        }
      }
      
    } catch (error) {
      setAvisSubmitError(error.message || "Erreur lors de la publication");
    } finally {
      setSubmittingAvis(false);
    }
  };

  useEffect(() => {
    loadCourses().catch((err) =>
      console.error("Erreur lors du chargement des cours :", err)
    );
  }, [loadCourses]);

  useEffect(() => {
    if (!searchId.trim()) {
      setSearchResults(null);
      setApiError(null);
      setCurrentPage(1);
    }
  }, [searchId]);

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

  const isCompleteSigle = (sigle) => sigle.length >= MIN_SIGLE_LENGTH;
  
  const rechercherCoursParId = async (sigle) => {
    const data = await fetchCourseById(sigle);
    setSearchResults([data]);
  };
  
  const rechercherCoursParPrefix = async (prefix) => {
    const data = await fetchCoursesByPrefix(prefix);
    if (data.length === 0) {
      setApiError(t.noneForPrefix(prefix));
    } else {
      setSearchResults(data);
    }
  };
  
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
  
  const selectCourse = (courseId) => {
    setSelectedCourseId(courseId);
    setShowModal(true);
  };
  
  const closeModal = () => {
    setShowModal(false);
    setSelectedCourseId(null);
    setShowAddAvisForm(false);
    setNewAvis({ auteur: "", texte: "", session: "", difficulte: "", volumeTravail: "", note: "" });
    setAvisSubmitError(null);
    setShowSuccessToast(false);
  };
  
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };
  
  const goToPage = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  let currentCourses = [];
  if (searchResults) {
    currentCourses = searchResults;
  } else if (courses) {
    currentCourses = courses;
  }
  
  const displayedCourses = currentCourses.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  
  const totalPages = Math.max(1, Math.ceil(currentCourses.length / ITEMS_PER_PAGE));
  const isLoading = loading || apiLoading;
  const hasError = error || apiError;
  const hasNoCourses = !isLoading && !hasError && displayedCourses.length === 0;
  const allAvailableCourses = searchResults || courses || [];
  const selectedCourse = allAvailableCourses.find((c) => c.id === selectedCourseId);
  
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

  return (
    <div className="cours-container">
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

      {isLoading && <p>{t.loading}</p>}
      {hasError && <p className="error">{t.errorPrefix}{hasError}</p>}
      {hasNoCourses && <p>{t.noneCourses}</p>}

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

      {/* Toast succès auto-disparition */}
      {showSuccessToast && (
        <div className="success-toast">
          {t.success}
        </div>
      )}

      {showModal && selectedCourse && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selectedCourse.id} - {selectedCourse.name}</h3>
              <button onClick={closeModal}>×</button>
            </div>

            <div className="modal-body">
              {/* Bouton ajouter commentaire */}
              {!showAddAvisForm && (
                <button 
                  className="add-avis-btn"
                  onClick={() => setShowAddAvisForm(true)}
                >
                  {t.addReview}
                </button>
              )}

              {/* Formulaire ajout avis */}
              {showAddAvisForm && (
                <form onSubmit={handleSubmitAvis} className="add-avis-form">
                  <div className="form-group">
                    <label>{t.authorLabel}</label>
                    <input
                      type="text"
                      value={newAvis.auteur}
                      onChange={(e) => setNewAvis({...newAvis, auteur: e.target.value})}
                      placeholder="Anonyme"
                      maxLength={50}
                    />
                  </div>

                  <div className="form-group">
                    <label>{t.textLabel} *</label>
                    <textarea
                      value={newAvis.texte}
                      onChange={(e) => setNewAvis({...newAvis, texte: e.target.value})}
                      placeholder="Votre avis sur ce cours..."
                      rows={4}
                      maxLength={1000}
                      required
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>{t.sessionLabelForm}</label>
                      <input
                        type="text"
                        value={newAvis.session}
                        onChange={(e) => setNewAvis({...newAvis, session: e.target.value})}
                        placeholder="A24, H25..."
                        maxLength={10}
                      />
                    </div>
                    <div className="form-group">
                      <label>{t.difficultyLabelForm}</label>
                      <input
                        type="number"
                        min="1"
                        max="5"
                        value={newAvis.difficulte}
                        onChange={(e) => setNewAvis({...newAvis, difficulte: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>{t.workloadLabelForm}</label>
                      <input
                        type="number"
                        min="1"
                        max="5"
                        value={newAvis.volumeTravail}
                        onChange={(e) => setNewAvis({...newAvis, volumeTravail: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label>{t.ratingLabelForm}</label>
                      <input
                        type="number"
                        min="1"
                        max="5"
                        value={newAvis.note}
                        onChange={(e) => setNewAvis({...newAvis, note: e.target.value})}
                      />
                    </div>
                  </div>

                  {avisSubmitError && <p className="error">{avisSubmitError}</p>}

                  <div className="form-actions">
                    <button 
                      type="button" 
                      onClick={() => {
                        setShowAddAvisForm(false);
                        setAvisSubmitError(null);
                      }}
                      disabled={submittingAvis}
                    >
                      {t.cancel}
                    </button>
                    <button type="submit" disabled={submittingAvis}>
                      {submittingAvis ? t.submitting : t.submit}
                    </button>
                  </div>
                </form>
              )}

              {/* Liste des avis existants */}
              {!showAddAvisForm && (
                <>
                  {loadingAvis ? (
                    <p>{t.loadingReviews}</p>
                  ) : selectedCourseAvis.length === 0 ? (
                    <p>{t.noneReviews}</p>
                  ) : (
                    <div className="avis-list">
                      {selectedCourseAvis.slice(0, 10).map((avis, index) => {
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
                            <div className="avis-metas">
                              {avis.session && (
                                <span className="avis-meta">{t.sessionLabel}: {avis.session}</span>
                              )}
                              {avis.difficulte != null && avis.difficulte > 0 && (
                                <span className="avis-meta">
                                  {t.difficultyLabel}: {avis.difficulte}/5
                                </span>
                              )}
                              {avis.volumeTravail != null && avis.volumeTravail > 0 && (  
                                <span className="avis-meta">
                                  {t.workloadLabel}: {avis.volumeTravail}/5
                                </span>
                              )}
                              {avis.note != null && avis.note > 0 && (  
                                <span className="avis-meta">
                                  {t.ratingLabel}: {avis.note}/5
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                      {selectedCourseAvis.length > 10 && (
                        <p className="more-avis">{t.more(selectedCourseAvis.length - 10)}</p>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}