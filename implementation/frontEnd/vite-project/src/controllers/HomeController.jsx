import React, { useState } from "react";
import ConsulterListeView from "../views/ConsulterListeView.jsx";
import ComparerCoursView from "../views/ComparerCoursView.jsx";
import { useCoursesCache } from "../controllers/CoursesCache.jsx";

export default function HomeController() {
    const [activeTab, setActiveTab] = useState("accueil");
    const { selectedProgram } = useCoursesCache();

    const renderTab = () => {
        switch (activeTab) {
            case "liste":
                return <ConsulterListeView goHome={() => setActiveTab("accueil")} />;
            case "comparer":
                return <ComparerCoursView goHome={() => setActiveTab("accueil")} />;
            case "accueil":
            default:
                return (
                    <div style={styles.container}>
                        {/* Hero principal */}
                        <div style={styles.hero}>
                            <div style={styles.heroContent}>
                                <h1 style={styles.title}>
                                    Planifiez votre parcours académique
                                </h1>
                                <p style={styles.subtitle}>
                                    Explorez, comparez et organisez vos cours facilement et efficacement.
                                </p>

                                {selectedProgram && (
                                    <div style={styles.programBadge}>
                                        Programme sélectionné : <strong>{selectedProgram.name}</strong>
                                    </div>
                                )}

                                <div style={styles.buttonsContainer}>
                                    <button
                                        style={{ ...styles.button, backgroundColor: "#1e3a8a" }}
                                        onClick={() => setActiveTab("liste")}
                                    >
                                        Consulter les cours
                                    </button>
                                    <button
                                        style={{ ...styles.button, backgroundColor: "#2563eb" }}
                                        onClick={() => setActiveTab("comparer")}
                                    >
                                        Comparer les cours
                                    </button>
                                </div>
                            </div>

                            <div style={styles.heroIllustration}>
                    
                            </div>
                        </div>

                        <div style={styles.infoSection}>
                            <p style={styles.infoText}>
                                Gérez vos cours, comparez les prérequis et planifiez vos sessions en toute simplicité. 
                                Tout est intégré pour vous donner une expérience fluide.
                            </p>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div style={{ width: "100%", minHeight: "100vh" }}>
            {renderTab()}
        </div>
    );
}

const styles = {
    container: {
        width: "100vw",
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Inter', sans-serif",
        color: "#1f2937",
        overflow: "hidden"
    },
    hero: {
        width: "90%",
        maxWidth: "1400px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "60px 40px",
        boxSizing: "border-box",
        flexWrap: "wrap",
        background: "linear-gradient(90deg, #e0e7ff, #f3f4f6)",
        borderRadius: "20px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
        flex: 1
    },
    heroContent: {
        flex: 1,
        minWidth: "300px",
        marginBottom: "20px"
    },
    title: {
        fontSize: "3rem",
        fontWeight: "bold",
        lineHeight: "1.2",
        marginBottom: "20px"
    },
    subtitle: {
        fontSize: "1.2rem",
        marginBottom: "30px",
        color: "#374151"
    },
    programBadge: {
        marginBottom: "30px",
        padding: "12px 24px",
        backgroundColor: "#e0f2fe",
        color: "#1e40af",
        fontWeight: "600",
        borderRadius: "12px",
        display: "inline-block"
    },
    buttonsContainer: {
        display: "flex",
        gap: "20px",
        flexWrap: "wrap"
    },
    button: {
        padding: "12px 28px",
        fontSize: "16px",
        fontWeight: "600",
        color: "white",
        border: "none",
        borderRadius: "12px",
        cursor: "pointer",
        transition: "transform 0.2s, box-shadow 0.2s"
    },
    heroIllustration: {
        flex: 1,
        minWidth: "300px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "20px"
    },
    illustration: {
        maxWidth: "100%",
        borderRadius: "20px",
        boxShadow: "0 8px 25px rgba(0,0,0,0.15)"
    },
    infoSection: {
        maxWidth: "900px",
        textAlign: "center",
        padding: "20px 40px"
    },
    infoText: {
        fontSize: "1rem",
        color: "#4b5563",
        lineHeight: "1.6"
    }
};
