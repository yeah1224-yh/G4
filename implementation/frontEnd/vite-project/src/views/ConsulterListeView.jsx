import React, { useEffect, useState } from "react";
import { useCoursesCache } from "../controllers/CoursesCache.jsx";
import { fetchCourseById, fetchCoursesByPrefix } from "../api/coursesApi.js";
import CourseCard from "./CourseCard.jsx";

export default function ConsulterListeView({ goHome }) {
    const { courses, loadCourses, loading, error } = useCoursesCache();
    const [searchId, setSearchId] = useState("");
    const [searchResults, setSearchResults] = useState(null); // résultats API (tableau)
    const [apiLoading, setApiLoading] = useState(false);
    const [apiError, setApiError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 50;

    // Charger le cache si vide
    useEffect(() => {
        if (!courses) {
            loadCourses().catch(err => console.error("Erreur lors du chargement des cours :", err));
        }
    }, []);

    // Si champ vide → revenir à l'affichage cache
    useEffect(() => {
        if (!searchId.trim()) {
            setSearchResults(null);
            setApiError(null);
            setCurrentPage(1);
        }
    }, [searchId]);

    const handleSearch = async () => {
        const trimmedId = searchId.trim().toUpperCase();
        if (!trimmedId) return;

        setApiLoading(true);
        setApiError(null);
        setSearchResults(null);

        try {
            // Si c'est un sigle complet (ex: IFT2255), chercher ce cours exact
            if (trimmedId.length >= 6) {
                const data = await fetchCourseById(trimmedId);
                setSearchResults([data]);
            } 
            // Sinon, chercher tous les cours commençant par ce préfixe
            else {
                const data = await fetchCoursesByPrefix(trimmedId);
                if (data.length === 0) {
                    setApiError(`Aucun cours trouvé commençant par "${trimmedId}"`);
                } else {
                    setSearchResults(data);
                }
            }
        } catch (err) {
            setApiError(err.message || "Erreur lors de la recherche");
        } finally {
            setApiLoading(false);
        }
    };

    // Gérer la touche "Enter" dans l'input
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    // Choisir les cours à afficher : soit résultats recherche, soit cache
    const displayedCourses = searchResults 
        ? searchResults.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
        : courses?.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE) || [];
    
    const totalPages = searchResults 
        ? Math.ceil(searchResults.length / ITEMS_PER_PAGE)
        : Math.ceil((courses?.length || 0) / ITEMS_PER_PAGE);

    const goToPage = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div style={styles.container}>
            <div style={styles.listBlock}>
                <div style={styles.topRow}>
                    <button onClick={goHome} style={styles.backButton}>
                        Retour à l'accueil
                    </button>
                    <div style={styles.searchWrapper}>
                        <input
                            type="text"
                            placeholder="Ex: ift, mat2255"
                            value={searchId}
                            onChange={e => setSearchId(e.target.value)}
                            onKeyPress={handleKeyPress}
                            style={styles.searchInput}
                            disabled={loading || apiLoading}
                        />
                        <button 
                            onClick={handleSearch} 
                            style={styles.searchButton} 
                            disabled={loading || apiLoading || !searchId.trim()}
                        >
                            Rechercher
                        </button>
                    </div>
                </div>

                <div style={styles.coursesContainer}>
                    {(loading || apiLoading) && <p>Chargement des cours...</p>}
                    
                    {apiError && <p style={styles.error}>{apiError}</p>}
                    
                    {!loading && !apiLoading && !apiError && displayedCourses.length === 0 && (
                        <p>Aucun cours à afficher</p>
                    )}
                    
                    {!loading && !apiLoading && !apiError && displayedCourses.map(course => (
                        <CourseCard key={course.id} course={course} />
                    ))}
                </div>

                {totalPages > 1 && (
                    <div style={styles.pagination}>
                        <button
                            onClick={() => goToPage(currentPage - 1)}
                            disabled={currentPage === 1}
                            style={styles.pageButton}
                        >
                            ← Précédent
                        </button>
                        <span style={styles.pageInfo}>
                            Page {currentPage} sur {totalPages}
                        </span>
                        <button
                            onClick={() => goToPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            style={styles.pageButton}
                        >
                            Suivant →
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

const styles = {
    container: { 
        width: "100vw", 
        minHeight: "100vh", 
        padding: "20px", 
        boxSizing: "border-box", 
        display: "flex", 
        flexDirection: "column", 
        gap: "20px", 
        backgroundColor: "#f5f5f5" 
    },
    listBlock: { 
        display: "flex", 
        flexDirection: "column", 
        gap: "15px", 
        backgroundColor: "white", 
        padding: "20px", 
        borderRadius: "12px", 
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)" 
    },
    topRow: { 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        marginBottom: "10px", 
        gap: "15px" 
    },
    backButton: { 
        padding: "10px 18px", 
        borderRadius: "6px", 
        cursor: "pointer", 
        backgroundColor: "#1e3a8a", 
        color: "white", 
        border: "none", 
        fontWeight: "600" 
    },
    searchWrapper: { 
        display: "flex", 
        alignItems: "center", 
        gap: "5px" 
    },
    searchInput: { 
        flex: 1, 
        maxWidth: "300px", 
        padding: "10px", 
        borderRadius: "8px", 
        border: "1px solid #ccc", 
        fontSize: "1rem",
        outline: "none"
    },
    searchButton: { 
        padding: "10px 20px", 
        borderRadius: "8px", 
        border: "none", 
        backgroundColor: "#1e3a8a", 
        color: "white",
        cursor: "pointer", 
        fontSize: "14px",
        fontWeight: "600",
        transition: "background-color 0.2s"
    },
    resultsInfo: {
        padding: "10px",
        backgroundColor: "#e7f3ff",
        borderRadius: "6px",
        fontSize: "14px",
        fontWeight: "500",
        color: "#0066cc",
        textAlign: "center"
    },
    coursesContainer: { 
        display: "flex", 
        flexWrap: "wrap", 
        justifyContent: "center", 
        gap: "20px", 
        paddingRight: "10px",
        minHeight: "200px"
    },
    pagination: { 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        gap: "20px", 
        paddingTop: "10px" 
    },
    pageButton: { 
        padding: "8px 16px", 
        borderRadius: "6px", 
        border: "1px solid #ccc", 
        backgroundColor: "white", 
        cursor: "pointer", 
        fontSize: "14px" 
    },
    pageInfo: { 
        fontSize: "14px", 
        fontWeight: "500" 
    },
    error: { 
        color: "red",
        padding: "20px",
        textAlign: "center"
    }
};