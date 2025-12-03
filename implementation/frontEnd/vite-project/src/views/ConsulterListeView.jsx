import React, { useEffect, useState } from "react";
import { useCoursesCache } from "../controllers/CoursesCache.jsx";
import { fetchCourseById, fetchCoursesByPrefix } from "../api/coursesApi.js";
import CourseCard from "./CourseCard.jsx";

const ITEMS_PER_PAGE = 50;
const MIN_SIGLE_LENGTH = 6;

export default function ConsulterListeView({ goHome }) {
    // États pour gérer les cours et la recherche
    const { courses, loadCourses, loading, error } = useCoursesCache();
    const [searchId, setSearchId] = useState("");
    const [searchResults, setSearchResults] = useState(null);
    const [apiLoading, setApiLoading] = useState(false);
    const [apiError, setApiError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

    // Chargement initial des cours
    useEffect(() => {
        if (!courses) {
            loadCourses().catch(err => 
                console.error("Erreur lors du chargement des cours :", err)
            );
        }
    }, []);

    // Réinitialisation si la recherche est vide
    useEffect(() => {
        if (!searchId.trim()) {
            setSearchResults(null);
            setApiError(null);
            setCurrentPage(1);
        }
    }, [searchId]);

    // Vérification si le sigle est complet
    const isCompleteSigle = (sigle) => sigle.length >= MIN_SIGLE_LENGTH;

    // Recherche d'un cours par son ID complet
    const rechercherCoursParId = async (sigle) => {
        const data = await fetchCourseById(sigle);
        setSearchResults([data]);
    };

    // Recherche de cours par préfixe
    const rechercherCoursParPrefix = async (prefix) => {
        const data = await fetchCoursesByPrefix(prefix);
        if (data.length === 0) {
            setApiError(`Aucun cours trouvé commençant par "${prefix}"`);
        } else {
            setSearchResults(data);
        }
    };

    // Gestion de la recherche
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
            setApiError(err.message || "Erreur lors de la recherche");
        } finally {
            setApiLoading(false);
        }
    };

    // Recherche avec la touche Enter
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    // Navigation entre les pages
    const goToPage = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Calcul des cours à afficher selon la page
    const displayedCourses = searchResults 
        ? searchResults.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
        : courses?.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE) || [];
    
    const totalPages = searchResults 
        ? Math.ceil(searchResults.length / ITEMS_PER_PAGE)
        : Math.ceil((courses?.length || 0) / ITEMS_PER_PAGE);

    const isLoading = loading || apiLoading;
    const hasError = apiError;
    const hasNoCourses = !isLoading && !hasError && displayedCourses.length === 0;

    return (
        <div style={styles.container}>
            <div style={styles.listBlock}>
                {/* Barre de navigation et recherche */}
                <TopBar 
                    goHome={goHome}
                    searchId={searchId}
                    setSearchId={setSearchId}
                    handleSearch={handleSearch}
                    handleKeyPress={handleKeyPress}
                    isLoading={isLoading}
                />

                {/* Grille des cours */}
                <CoursesGrid 
                    isLoading={isLoading}
                    hasError={hasError}
                    errorMessage={apiError}
                    hasNoCourses={hasNoCourses}
                    courses={displayedCourses}
                />

                {/* Pagination */}
                {totalPages > 1 && (
                    <Pagination 
                        currentPage={currentPage}
                        totalPages={totalPages}
                        goToPage={goToPage}
                    />
                )}
            </div>
        </div>
    );
}

// Composant pour la barre supérieure
function TopBar({ goHome, searchId, setSearchId, handleSearch, handleKeyPress, isLoading }) {
    return (
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
                    disabled={isLoading}
                />
                <button 
                    onClick={handleSearch} 
                    style={styles.searchButton} 
                    disabled={isLoading || !searchId.trim()}
                >
                    Rechercher
                </button>
            </div>
        </div>
    );
}

// Composant pour afficher la grille de cours
function CoursesGrid({ isLoading, hasError, errorMessage, hasNoCourses, courses }) {
    return (
        <div style={styles.coursesContainer}>
            {isLoading && <p>Chargement des cours...</p>}
            {hasError && <p style={styles.error}>{errorMessage}</p>}
            {hasNoCourses && <p>Aucun cours à afficher</p>}
            {!isLoading && !hasError && courses.map(course => (
                <CourseCard key={course.id} course={course} />
            ))}
        </div>
    );
}

// Composant de pagination
function Pagination({ currentPage, totalPages, goToPage }) {
    return (
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
    );
}

// Styles CSS-in-JS
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