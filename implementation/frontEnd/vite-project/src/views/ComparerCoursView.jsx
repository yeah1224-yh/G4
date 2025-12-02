import React, { useState, useEffect, useMemo, useRef } from "react";
import { useCoursesCache } from "../controllers/CoursesCache.jsx";

export default function ComparerCoursView({ goHome }) {
    const { courses, loadCourses, loading } = useCoursesCache();
    const [selected1, setSelected1] = useState(null);
    const [selected2, setSelected2] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [currentTarget, setCurrentTarget] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [error, setError] = useState("");
    const [showErrorPopup, setShowErrorPopup] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchFocus, setSearchFocus] = useState(false); // <-- ajout

    const slot1Ref = useRef(null);
    const slot2Ref = useRef(null);
    const errorTimeoutRef = useRef(null);

    const ITEMS_PER_PAGE = 20;

    useEffect(() => {
        if (!courses) {
            loadCourses().catch(err => console.error("Erreur chargement cours:", err));
        }
    }, []);

    useEffect(() => {
        return () => {
            if (errorTimeoutRef.current) clearTimeout(errorTimeoutRef.current);
        };
    }, []);

    const filteredCourses = useMemo(() => {
        if (!courses || !Array.isArray(courses)) return [];
        const term = searchTerm.toLowerCase();
        return courses.filter(c =>
            c.name.toLowerCase().includes(term) ||
            c.id.toLowerCase().includes(term)
        );
    }, [courses, searchTerm]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const totalPages = Math.ceil(filteredCourses.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentCourses = filteredCourses.slice(startIndex, endIndex);

    const showError = (message) => {
        setError(message);
        setShowErrorPopup(true);
        if (errorTimeoutRef.current) clearTimeout(errorTimeoutRef.current);
        errorTimeoutRef.current = setTimeout(() => setShowErrorPopup(false), 2500);
    };

    const animateSlot = (slotNumber) => {
        const ref = slotNumber === 1 ? slot1Ref : slot2Ref;
        if (ref.current) {
            ref.current.classList.add("pulse");
            setTimeout(() => ref.current?.classList.remove("pulse"), 300);
        }
    };

    const openSelectorModal = (slot) => {
        setCurrentTarget(slot);
        setOpenModal(true);
        setSearchTerm("");
        setCurrentPage(1);
    };

    const chooseCourse = (course) => {
        const otherSelected = currentTarget === 1 ? selected2 : selected1;
        if (otherSelected?.id === course.id) {
            showError("Impossible de sélectionner le même cours pour les deux slots.");
            return;
        }

        animateSlot(currentTarget);
        currentTarget === 1 ? setSelected1(course) : setSelected2(course);
        setOpenModal(false);
    };

    const handleCompare = () => {
        if (!selected1 || !selected2) return;
        alert(`Comparer:\n1. ${selected1.name}\n2. ${selected2.name}`);
    };

    const isCompareDisabled = !selected1 || !selected2 || selected1.id === selected2.id;

    return (
        <div style={styles.container}>
            <button onClick={goHome} style={styles.backButton}>
                Retour à l'accueil
            </button>

            <div style={styles.slotsContainer}>
                {/* Slot 1 */}
                <div
                    ref={slot1Ref}
                    onClick={() => openSelectorModal(1)}
                    style={{
                        ...styles.slot,
                        ...styles.slot1,
                        background: selected1 ? "linear-gradient(135deg, #edeff7ff, #c7d2fe)" : "#e0e7ff",
                        boxShadow: selected1 ? "0 8px 20px rgba(99,102,241,0.4)" : "0 4px 12px rgba(0,0,0,0.08)",
                        color: selected1 ? "#1f2937" : "#9ca3af",
                        transform: selected1 ? "scale(1.03)" : "scale(1)"
                    }}
                >
                    {selected1 ? (
                        <>
                            <strong style={styles.courseCardTitle}>{selected1.name}</strong>
                            <small style={{ ...styles.courseId, marginBottom: "8px" }}>{selected1.id}</small>
                            <p style={styles.courseDescription}>{selected1.description}</p>
                            <div><strong>Crédits:</strong> {selected1.credits}</div>
                            <div><strong>Horaires:</strong> {selected1.schedules?.map(s => `${s.day} ${s.start}-${s.end}`).join(", ") || "Non spécifié"}</div>
                            <div><strong>Session:</strong> {selected1.available_terms ? Object.entries(selected1.available_terms).filter(([k,v])=>v).map(([k])=>k.charAt(0).toUpperCase() + k.slice(1)).join(", ") : "Non spécifié"}</div>
                            <div><strong>Préalable:</strong> {selected1.requirement_text || "Aucun"}</div>
                        </>
                    ) : (
                        <span style={styles.placeholder}>Cliquer pour choisir cours 1</span>
                    )}
                </div>

                <div style={styles.vs}>VS</div>

                {/* Slot 2 */}
                <div
                    ref={slot2Ref}
                    onClick={() => openSelectorModal(2)}
                    style={{
                        ...styles.slot,
                        ...styles.slot2,
                        background: selected2 ? "linear-gradient(135deg, #edeff7ff, #c7d2fe)" : "#e0e7ff",
                        boxShadow: selected2 ? "0 8px 20px rgba(99,102,241,0.4)" : "0 4px 12px rgba(0,0,0,0.08)",
                        color: selected2 ? "#1f2937" : "#9ca3af",
                        transform: selected2 ? "scale(1.03)" : "scale(1)"
                    }}
                >
                    {selected2 ? (
                        <>
                            <strong style={styles.courseCardTitle}>{selected2.name}</strong>
                            <small style={{ ...styles.courseId, marginBottom: "8px" }}>{selected2.id}</small>
                            <p style={styles.courseDescription}>{selected2.description}</p>
                            <div><strong>Crédits:</strong> {selected2.credits}</div>
                            <div><strong>Horaires:</strong> {selected2.schedules?.map(s => `${s.day} ${s.start}-${s.end}`).join(", ") || "Non spécifié"}</div>
                            <div><strong>Session:</strong> {selected2.available_terms ? Object.entries(selected2.available_terms).filter(([k,v])=>v).map(([k])=>k.charAt(0).toUpperCase() + k.slice(1)).join(", ") : "Non spécifié"}</div>
                            <div><strong>Préalable:</strong> {selected2.requirement_text || "Aucun"}</div>
                        </>
                    ) : (
                        <span style={styles.placeholder}>Cliquer pour choisir cours 2</span>
                    )}
                </div>
            </div>

            <button
                onClick={handleCompare}
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

            {showErrorPopup && <div style={styles.errorPopup}>{error}</div>}

            {openModal && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modalContent}>
                        <h3 style={styles.modalTitle}>Choisir un cours</h3>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Rechercher un cours…"
                            autoFocus
                            onFocus={() => setSearchFocus(true)}
                            onBlur={() => setSearchFocus(false)}
                            style={{
                                ...styles.searchInput,
                                border: searchFocus ? "2px solid #ffffff" : "1px solid #ffffffff",
                                outline: "none",
                                transition: "all 0.2s ease"
                            }}
                        />
                        {loading && <p>Chargement des cours...</p>}
                        {!loading && filteredCourses.length === 0 && (
                            <p>Aucun cours trouvé pour "{searchTerm}"</p>
                        )}
                        {!loading && filteredCourses.length > 0 && (
                            <>
                                <div style={styles.pagination}>
                                    <button
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                        style={styles.pageButton}
                                    >
                                        Précédent
                                    </button>
                                    <span style={styles.pageInfo}>
                                        Page {currentPage} sur {totalPages}
                                    </span>
                                    <button
                                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages}
                                        style={styles.pageButton}
                                    >
                                        Suivant →
                                    </button>
                                </div>

                                <div style={styles.coursesGrid}>
                                    {currentCourses.map((course) => (
                                        <div
                                            key={course.id}
                                            onClick={() => chooseCourse(course)}
                                            style={styles.courseCard}
                                        >
                                            <strong style={styles.courseCardTitle}>{course.name}</strong>
                                            <p style={styles.courseId}>{course.id}</p>
                                            <p style={styles.courseDescription}>{course.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                        <button onClick={() => setOpenModal(false)} style={styles.closeButton}>
                            Fermer
                        </button>
                    </div>
                </div>
            )}

            <style>{`
                .pulse {
                    transform: scale(1.1);
                    transition: transform 0.3s;
                }
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

const styles = {
    container: { width: "100vw", height: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", backgroundColor: "#f0f2f5", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" },
    backButton: { position: "fixed", top: "20px", left: "20px", padding: "10px 18px", borderRadius: "6px", cursor: "pointer", backgroundColor: "#1e3a8a", color: "white", border: "none", fontWeight: "600", zIndex: 1000 },
    slotsContainer: { display: "flex", alignItems: "center", gap: "20px", marginBottom: "15px" },
    slot: { width: "300px", height: "450px", borderRadius: "16px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start", cursor: "pointer", transition: "all 0.3s ease", textAlign: "center", padding: "15px", color: "#1f2937" },
    slot1: { border: "2px solid #6366f1" },
    slot2: { border: "2px solid #6366f1" },
    vs: { fontSize: "80px", fontWeight: "700", color: "#1e3a8a", margin: "0 10px", userSelect: "none" },
    courseCardTitle: { fontSize: "16px", fontWeight: "600", marginBottom: "6px", color: "#1e3a8a" },
    courseDescription: { fontSize: "14px", overflowY: "auto", flexGrow: 1, color: "#374151" },
    courseId: { fontSize: "13px", color: "#070707ff" },
    placeholder: { fontSize: "14px", color: "#6b7280", transition: "all 0.3s" },
    compareButton: { padding: "12px 30px", fontSize: "16px", borderRadius: "8px", color: "white", border: "none", marginBottom: "20px" },
    errorPopup: { position: "fixed", top: "20%", left: "50%", transform: "translateX(-50%)", backgroundColor: "#ff4d4d", color: "white", padding: "15px 25px", borderRadius: "8px", boxShadow: "0 2px 10px rgba(0,0,0,0.3)", zIndex: 500, fontWeight: "bold", animation: "fadeInOut 2.5s forwards" },
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
