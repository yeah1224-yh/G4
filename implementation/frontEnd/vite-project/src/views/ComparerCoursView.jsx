import React, { useState, useEffect, useMemo, useRef } from "react";
import { useCoursesCache } from "../controllers/CoursesCache.jsx";
import { fetchCourseById, fetchCoursesByPrefix } from "../api/coursesApi.js";

const ITEMS_PER_PAGE = 20;        // Nombre de cours affichés par page dans la modale
const MIN_SIGLE_LENGTH = 6;       // Longueur minimale pour considérer un sigle comme complet (ex: IFT1010)

// Composant principal : Vue de comparaison de deux cours
export default function ComparerCoursView({ goHome }) {
  // États principaux
  const { courses, loadCourses, loading } = useCoursesCache(); // Cache global des cours
  const [selected1, setSelected1] = useState(null);             // Cours sélectionné dans le slot 1
  const [selected2, setSelected2] = useState(null);             // Cours sélectionné dans le slot 2
  const [openModal, setOpenModal] = useState(false);            // Ouverture/fermeture de la modale de sélection
  const [currentTarget, setCurrentTarget] = useState(null);     // Indique quel slot (1 ou 2) est en cours de remplissage

  // États liés à la recherche dans la modale
  const [searchTerm, setSearchTerm] = useState("");             // Texte saisi dans la barre de recherche
  const [searchResults, setSearchResults] = useState(null);     // Résultats de l'API (ou null si pas de recherche)
  const [apiLoading, setApiLoading] = useState(false);          // Indicateur de chargement API
  const [apiError, setApiError] = useState(null);               // Erreur provenant de l'API

  // États UI supplémentaires
  const [error, setError] = useState("");                       // Message d'erreur à afficher
  const [showErrorPopup, setShowErrorPopup] = useState(false);  // Affichage du popup d'erreur temporisé
  const [currentPage, setCurrentPage] = useState(1);            // Page actuelle dans la liste paginée
  const [searchFocus, setSearchFocus] = useState(false);        // État du focus sur l'input de recherche (pour style)

  // Références pour animations et timeout
  const slot1Ref = useRef(null);
  const slot2Ref = useRef(null);
  const errorTimeoutRef = useRef(null);

  // Chargement initial des cours depuis le cache
  useEffect(() => {
    if (!courses) loadCourses().catch(err => console.error("Erreur chargement cours:", err));
  }, []);

  // Nettoyage du timeout d'erreur à la destruction du composant
  useEffect(() => {
    return () => {
      if (errorTimeoutRef.current) clearTimeout(errorTimeoutRef.current);
    };
  }, []);

  // Réinitialisation de la pagination quand la recherche change
  useEffect(() => setCurrentPage(1), [searchTerm, searchResults]);

  // Réinitialisation des résultats quand la recherche est vidée
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults(null);
      setApiError(null);
      setApiLoading(false);
    }
  }, [searchTerm]);

  // Vérifie si un sigle est complet (ex: ABC1234 → 8 caractères)
  const isCompleteSigle = (sigle) => sigle.length >= MIN_SIGLE_LENGTH;

  // Recherche exacte par sigle complet via l'API
  const searchBySigle = async (sigle) => {
    try {
      const data = await fetchCourseById(sigle);
      if (!data) {
        setSearchResults([]);
        setApiError(`Aucun cours trouvé avec l'id "${sigle}"`);
      } else {
        setSearchResults([data]);
      }
    } catch (err) {
      throw new Error(err?.message || "Erreur récupération cours par id");
    }
  };

  // Recherche par préfixe (ex: "IFT" → tous les cours commençant par IFT)
  const searchByPrefix = async (prefix) => {
    try {
      const data = await fetchCoursesByPrefix(prefix);
      if (!Array.isArray(data) || data.length === 0) {
        setSearchResults([]);
        setApiError(`Aucun cours trouvé commençant par "${prefix}"`);
      } else {
        setSearchResults(data);
      }
    } catch (err) {
      throw new Error(err?.message || "Erreur recherche par préfixe");
    }
  };

  // Lancement de la recherche (sigle complet ou préfixe)
  const handleSearch = async () => {
    const trimmed = searchTerm.trim().toUpperCase();
    if (!trimmed) {
      setSearchResults(null);
      setApiError(null);
      return;
    }

    setApiLoading(true);
    setApiError(null);
    setSearchResults(null);

    try {
      if (isCompleteSigle(trimmed)) await searchBySigle(trimmed);
      else await searchByPrefix(trimmed);
    } catch (err) {
      setApiError(err.message || "Erreur lors de la recherche");
      setSearchResults([]);
    } finally {
      setApiLoading(false);
    }
  };

  // Recherche au pression de la touche Entrée
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  // Liste de base : résultats API si recherche effectuée, sinon tous les cours du cache
  const baseList = searchResults === null ? (courses || []) : searchResults;

  // Filtrage local (quand pas de recherche API) par nom ou sigle
  const filteredCourses = useMemo(() => {
    if (!baseList || !Array.isArray(baseList)) return [];
    const term = searchTerm.trim().toLowerCase();
    if (!term || searchResults !== null) return baseList;
    return baseList.filter(c =>
      (c.name || "").toLowerCase().includes(term) ||
      (c.id || "").toLowerCase().includes(term)
    );
  }, [baseList, searchTerm, searchResults]);

  // Calcul de la pagination
  const totalPages = Math.max(1, Math.ceil(filteredCourses.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentCourses = filteredCourses.slice(startIndex, endIndex);

  // Affichage d'un message temporaire (utilisé pour les erreurs et le bouton Comparer)
  const showMessage = (message, duration = 2500) => {
    setError(message);
    setShowErrorPopup(true);
    if (errorTimeoutRef.current) clearTimeout(errorTimeoutRef.current);
    errorTimeoutRef.current = setTimeout(() => setShowErrorPopup(false), duration);
  };

  // Animation "pulse" sur le slot lors de la sélection d'un cours
  const animateSlot = (slotNumber) => {
    const ref = slotNumber === 1 ? slot1Ref : slot2Ref;
    if (ref.current) {
      ref.current.classList.add("pulse");
      setTimeout(() => ref.current?.classList.remove("pulse"), 300);
    }
  };

  // Ouvre la modale pour choisir un cours dans un slot donné
  const rechercherCours = (slot) => {
    setCurrentTarget(slot);
    setOpenModal(true);
    setSearchTerm("");
    setSearchResults(null);
    setApiError(null);
    setApiLoading(false);
    setCurrentPage(1);
  };

  // Sélectionne un cours dans le slot actif
  const choisirCours = (course) => {
    const otherSelected = currentTarget === 1 ? selected2 : selected1;
    if (otherSelected?.id === course.id) {
      showMessage("Impossible de sélectionner le même cours pour les deux slots.");
      return;
    }
    animateSlot(currentTarget);
    currentTarget === 1 ? setSelected1(course) : setSelected2(course);
    setOpenModal(false);
  };

  // NOUVELLE FONCTION : clic sur Comparer
  const comparerCoursA = () => {
    if (!selected1 || !selected2) return;
    showMessage("Indisponible pour le moment, on n’a pas encore les avis Discord ", 7000);
  };

  // États dérivés pour le bouton Comparer et le chargement
  const isCompareDisabled = !selected1 || !selected2 || selected1.id === selected2.id;
  const isLoading = loading || apiLoading;
  const hasError = Boolean(apiError);

  // Rendu principal du composant
  return (
    <div style={styles.container}>
      <button onClick={goHome} style={styles.backButton}>
        Retour à l'accueil
      </button>

      {/* Affichage des deux slots de comparaison */}
      <Slots
        selected1={selected1}
        selected2={selected2}
        slot1Ref={slot1Ref}
        slot2Ref={slot2Ref}
        rechercherCours={rechercherCours}
      />

      {/* Bouton de comparaison */}
      <button
        onClick={comparerCoursA}
        disabled={isCompareDisabled}
        style={{
          ...styles.compareButton,
          cursor: isCompareDisabled ? "not-allowed" : "pointer",
          backgroundColor: isCompareDisabled ? "#a0afc4ff" : "#5973c7ff",
          opacity: isCompareDisabled ? 0.6 : 1
        }}
      >
        Comparer
      </button>

      {/* Popup de message (erreur ou indisponibilité) */}
      {showErrorPopup && <div style={styles.errorPopup}>{error}</div>}

      {/* Modale de sélection de cours */}
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
        />
      )}

      {/* Animations CSS */}
      <style>{`
        .pulse { transform: scale(1.1); transition: transform 0.3s; }
        @keyframes fadeInOut {
          0% { opacity: 0; transform: translateX(-50%) translateY(-10px); }
          10% { opacity: 1; transform: translateX(-50%) translateY(0); }
          90% { opacity: 1; transform: translateX(-50%) translateY(0); }
          100% { opacity: 0; transform: translateX(-50%) translateY(-10px); }
        }
      `}</style>
    </div>
  );
}

// Composant : Affichage des deux slots (gauche/droite) avec le VS au milieu
function Slots({ selected1, selected2, slot1Ref, slot2Ref, rechercherCours }) {
  const renderSlot = (selected, ref, slotNumber) => (
    <div
      ref={ref}
      onClick={() => rechercherCours(slotNumber)}
      style={{
        ...styles.slot,
        background: selected ? "linear-gradient(135deg, #edeff7ff, #c7d2fe)" : "#e0e7ff",
        boxShadow: selected ? "0 8px 20px rgba(99,102,241,0.4)" : "0 4px 12px rgba(0,0,0,0.08)",
        color: selected ? "#1f2937" : "#9ca3af",
        transform: selected ? "scale(1.03)" : "scale(1)"
      }}
    >
      {selected ? (
        <>
          <strong style={styles.courseCardTitle}>{selected.name}</strong>
          <small style={{ ...styles.courseId, marginBottom: "8px" }}>{selected.id}</small>
          <p style={styles.courseDescription}>{selected.description}</p>
          <div><strong>Crédits:</strong> {selected.credits}</div>
          <div><strong>Horaires:</strong> {selected.schedules?.map(s => `${s.day} ${s.start}-${s.end}`).join(", ") || "Non spécifié"}</div>
          <div><strong>Session:</strong> {selected.available_terms ? Object.entries(selected.available_terms).filter(([k,v])=>v).map(([k])=>k.charAt(0).toUpperCase() + k.slice(1)).join(", ") : "Non spécifié"}</div>
          <div><strong>Préalable:</strong> {selected.requirement_text || "Aucun"}</div>
        </>
      ) : (
        <span style={styles.placeholder}>Cliquer pour choisir cours {slotNumber}</span>
      )}
    </div>
  );

  return (
    <div style={styles.slotsContainer}>
      {renderSlot(selected1, slot1Ref, 1)}
      <div style={styles.vs}>VS</div>
      {renderSlot(selected2, slot2Ref, 2)}
    </div>
  );
}

// Composant : Modale de sélection d'un cours
function CourseSelectorModal({
  searchTerm,
  setSearchTerm,
  handleSearch,
  handleKeyDown,
  filteredCourses,
  isLoading,
  hasError,
  apiError,
  currentPage,
  setCurrentPage,
  totalPages,
  choisirCours,
  closeModal,
  searchFocus,
  setSearchFocus
}) {
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentCourses = filteredCourses.slice(startIndex, endIndex);

  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modalContent}>
        <h3 style={styles.modalTitle}>Choisir un cours</h3>

        {/* Barre de recherche */}
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Ex: IFT, MAT2255"
            autoFocus
            onFocus={() => setSearchFocus(true)}
            onBlur={() => setSearchFocus(false)}
            onKeyDown={handleKeyDown}
            style={{
              ...styles.searchInput,
              border: searchFocus ? "2px solid #ffffff" : "1px solid #ffffffff",
              outline: "none",
              transition: "all 0.2s ease"
            }}
          />
          <button
            onClick={handleSearch}
            disabled={isLoading || !searchTerm.trim()}
            style={{
              padding: "8px 12px",
              borderRadius: "6px",
              border: "none",
              cursor: isLoading ? "not-allowed" : "pointer",
              backgroundColor: "#1e3a8a",
              color: "white",
              fontWeight: 600
            }}
          >
            Rechercher
          </button>
        </div>

        {/* États de chargement / erreur / vide */}
        {isLoading && <p>Chargement des cours...</p>}
        {hasError && apiError && <p style={{ color: "red" }}>{apiError}</p>}
        {!isLoading && !hasError && filteredCourses.length === 0 && <p>Aucun cours trouvé pour "{searchTerm}"</p>}

        {/* Liste paginée des cours */}
        {!isLoading && filteredCourses.length > 0 && (
          <>
            <div style={styles.pagination}>
              <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} style={styles.pageButton}>Précédent</button>
              <span style={styles.pageInfo}>Page {currentPage} sur {totalPages}</span>
              <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} style={styles.pageButton}>Suivant</button>
            </div>

            <div style={styles.coursesGrid}>
              {currentCourses.map(course => (
                <div key={course.id} onClick={() => choisirCours(course)} style={styles.courseCard}>
                  <strong style={styles.courseCardTitle}>{course.name}</strong>
                  <p style={styles.courseId}>{course.id}</p>
                  <p style={styles.courseDescription}>{course.description}</p>
                </div>
              ))}
            </div>
          </>
        )}

        <button onClick={closeModal} style={styles.closeButton}>Fermer</button>
      </div>
    </div>
  );
}

// Tous les styles du composant (inline pour simplicité)
const styles = {
  container: { width: "100vw", height: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", backgroundColor: "#f0f2f5", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" },
  backButton: { position: "fixed", top: "20px", left: "20px", padding: "10px 18px", borderRadius: "6px", cursor: "pointer", backgroundColor: "#1e3a8a", color: "white", border: "none", fontWeight: "600", zIndex: 1000 },
  slotsContainer: { display: "flex", alignItems: "center", gap: "20px", marginBottom: "15px" },
  slot: { width: "300px", height: "450px", borderRadius: "16px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start", cursor: "pointer", transition: "all 0.3s ease", textAlign: "center", padding: "15px", color: "#1f2937" },
  vs: { fontSize: "80px", fontWeight: "700", color: "#1e3a8a", margin: "0 10px", userSelect: "none" },
  courseCardTitle: { fontSize: "16px", fontWeight: "600", marginBottom: "6px", color: "#1e3a8a" },
  courseDescription: { fontSize: "14px", overflowY: "auto", color: "#374151", flex: "1", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "10px 0" },
  courseId: { fontSize: "13px", color: "#070707ff" },
  placeholder: { fontSize: "14px", color: "#6b7280", transition: "all 0.3s" },
  compareButton: { padding: "12px 30px", fontSize: "16px", borderRadius: "8px", color: "white", border: "none", marginBottom: "20px" },
  errorPopup: { position: "fixed", top: "20%", left: "50%", transform: "translateX(-50%)", backgroundColor: "#6366f1", color: "white", padding: "15px 30px", borderRadius: "12px", boxShadow: "0 4px 20px rgba(0,0,0,0.3)", zIndex: 500, fontWeight: "bold", fontSize: "16px", textAlign: "center", animation: "fadeInOut 4s forwards", maxWidth: "90%" },
  modalOverlay: { position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 300 },
  modalContent: { background: "#e6e6fa", width: "80%", maxWidth: "1200px", maxHeight: "80%", padding: "20px", borderRadius: "12px", display: "flex", flexDirection: "column", overflow: "hidden" },
  modalTitle: { marginBottom: "10px" },
  searchInput: { width: "100%", padding: "10px", margin: "10px 0", fontSize: "16px", boxSizing: "border-box", borderRadius: "6px" },
  pagination: { display: "flex", justifyContent: "center", alignItems: "center", gap: "15px", padding: "10px 0" },
  pageButton: { padding: "6px 12px", borderRadius: "4px", border: "1px solid #a38181ff", backgroundColor: "white", cursor: "pointer", fontSize: "13px" },
  pageInfo: { fontSize: "13px", fontWeight: "500" },
  coursesGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "15px", overflowY: "auto", flex: 1, padding: "10px 0" },
  courseCard: {
    border: "2px solid #ffffffff",
    borderRadius: "12px",
    padding: "12px",
    cursor: "pointer",
    backgroundColor: "#fcfcfcff",
    boxShadow: "2px 2px 10px rgba(0,0,0,0.12)",
    transition: "transform 0.2s",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    height: "280px",
    boxSizing: "border-box"
  },
  closeButton: { marginTop: "15px", padding: "8px 15px", borderRadius: "6px", cursor: "pointer", alignSelf: "flex-end", backgroundColor: "#f4f4f8ff", color: "#374151", border: "none" }
};