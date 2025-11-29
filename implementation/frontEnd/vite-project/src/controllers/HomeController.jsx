import React, { useState } from "react";
import AccueilView from "../views/AccueilView.jsx";
import ConsulterListeView from "../views/ConsulterListeView.jsx";
import ComparerCoursView from "../views/ComparerCoursView.jsx";

export default function HomeController() {
    const [activeTab, setActiveTab] = useState("accueil");
    const [hoveredTab, setHoveredTab] = useState(null);

    const renderTab = () => {
        switch (activeTab) {
            case "liste":
                return <ConsulterListeView />;
            case "comparer":
                return <ComparerCoursView />;
            case "accueil":
            default:
                return <AccueilView />;
        }
    };

    const tabs = [
        { key: "accueil", label: "Accueil" },
        { key: "liste", label: "Consulter la liste des cours" },
        { key: "comparer", label: "Comparer les cours" }
    ];

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
            backgroundColor: "#f0f2f5" 
        }}>
            {/* Barre de navigation centrée */}
            <nav style={{
                display: "flex",
                justifyContent: "center",
                gap: "40px",
                padding: "15px",
                backgroundColor: "#fdfdfd", 
                position: "sticky",
                top: 0,
                zIndex: 1000
            }}>
                {tabs.map((tab) => {
                    const isActive = activeTab === tab.key;
                    const isHovered = hoveredTab === tab.key;
                    return (
                        <div
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            onMouseEnter={() => setHoveredTab(tab.key)}
                            onMouseLeave={() => setHoveredTab(null)}
                            style={{
                                fontWeight: isActive ? "bold" : "normal",
                                fontSize: "18px",
                                padding: "5px 10px",
                                cursor: "pointer",
                                color: "black",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                position: "relative"
                            }}
                        >
                            {tab.label}
                            <div style={{
                                marginTop: "4px",
                                height: "4px",
                                width: isActive || isHovered ? "100%" : "0",
                                backgroundColor: "#0d1b2a",
                                transition: "width 0.3s"
                            }} />
                        </div>
                    )
                })}
            </nav>

            {/* Contenu de l’onglet actif */}
            <div style={{ flex: 1 }}>
                {renderTab()}
            </div>
        </div>
    );
}

