// src/views/ComparerCoursView.jsx
import React, { useState, useEffect } from "react";
import { fetchAllCourses } from "../api/coursesApi";

export default function ComparerCoursView() {
    const [selected1, setSelected1] = useState(null);
    const [selected2, setSelected2] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [currentTarget, setCurrentTarget] = useState(null);
    const [courses, setCourses] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [error, setError] = useState(""); // pour le popup
    const [showErrorPopup, setShowErrorPopup] = useState(false);

    useEffect(() => {
        fetchAllCourses()
            .then(data => setCourses(data))
            .catch(err => console.error(err));
    }, []);

    const filteredCourses = courses.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const openSelectorModal = (slot) => {
        setCurrentTarget(slot);
        setOpenModal(true);
        setSearchTerm("");
    };

    const chooseCourse = (course) => {
        if ((currentTarget === 1 && selected2?.id === course.id) ||
            (currentTarget === 2 && selected1?.id === course.id)) {
            setError("Impossible de sélectionner le même cours pour les deux slots.");
            setShowErrorPopup(true);
            setTimeout(() => setShowErrorPopup(false), 2500); // disparaît après 2.5s
            return;
        }

        const element = document.getElementById(`selected-slot-${currentTarget}`);
        element.classList.add("pulse");
        setTimeout(() => element.classList.remove("pulse"), 300);

        if (currentTarget === 1) setSelected1(course);
        else setSelected2(course);

        setOpenModal(false);
    };

    const swap = () => {
        const temp = selected1;
        setSelected1(selected2);
        setSelected2(temp);
    };

    const handleCompare = () => {
        if (selected1 && selected2) {
            alert(`Comparer:\n1 ${selected1.name}\n2 ${selected2.name}`);
        }
    };

    const isCompareDisabled = !selected1 || !selected2 || (selected1 && selected2 && selected1.id === selected2.id);

    return (
        <div style={{
            width: "100vw",
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#f0f2f5",
        }}>
            {/* Bloc centré */}
            <div style={{
                display: "flex",
                alignItems: "center",
                gap: "20px",
                marginBottom: "10px"
            }}>
                {/* Slot 1 */}
                <div
                    id="selected-slot-1"
                    onClick={() => openSelectorModal(1)}
                    style={{
                        width: "280px",
                        height: "180px",
                        border: "3px solid #ff7f50",
                        borderRadius: "12px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        background: selected1 ? "#ffe4b5" : "transparent",
                        transition: "transform 0.3s",
                        boxShadow: "2px 2px 10px rgba(0,0,0,0.2)"
                    }}
                >
                    {selected1 ? (
                        <>
                            <strong style={{ fontSize: "16px" }}>{selected1.name}</strong>
                            <small>{selected1.id}</small>
                        </>
                    ) : <span style={{ fontSize: "16px" }}> Choisir cours 1</span>}
                </div>

                {/* Swap */}
                <button
                    onClick={swap}
                    disabled={!selected1 || !selected2}
                    style={{
                        height: "45px",
                        padding: "5px 20px",
                        cursor: (!selected1 || !selected2) ? "not-allowed" : "pointer",
                        fontSize: "18px",
                        borderRadius: "8px"
                    }}
                >
                    ↔ Swap
                </button>

                {/* Slot 2 */}
                <div
                    id="selected-slot-2"
                    onClick={() => openSelectorModal(2)}
                    style={{
                        width: "280px",
                        height: "180px",
                        border: "3px solid #6495ed",
                        borderRadius: "12px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        background: selected2 ? "#add8e6" : "transparent",
                        transition: "transform 0.3s",
                        boxShadow: "2px 2px 10px rgba(0,0,0,0.2)"
                    }}
                >
                    {selected2 ? (
                        <>
                            <strong style={{ fontSize: "16px" }}>{selected2.name}</strong>
                            <small>{selected2.id}</small>
                        </>
                    ) : <span style={{ fontSize: "16px" }}> Choisir cours 2</span>}
                </div>
            </div>

            {/* Bouton Comparer */}
            <button
                onClick={handleCompare}
                disabled={isCompareDisabled}
                style={{
                    padding: "12px 30px",
                    fontSize: "16px",
                    cursor: isCompareDisabled ? "not-allowed" : "pointer",
                    borderRadius: "8px",
                    backgroundColor: isCompareDisabled ? "#ccc" : "#4caf50",
                    color: "white",
                    border: "none",
                    marginBottom: "20px"
                }}
            >
                Comparer
            </button>

            {/* Popup d’erreur */}
            {showErrorPopup && (
                <div style={{
                    position: "fixed",
                    top: "20%",
                    left: "50%",
                    transform: "translateX(-50%)",
                    backgroundColor: "#ff4d4d",
                    color: "white",
                    padding: "15px 25px",
                    borderRadius: "8px",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
                    zIndex: 500,
                    fontWeight: "bold",
                    animation: "fadeInOut 2.5s forwards"
                }}>
                    {error}
                </div>
            )}

            {/* Modal */}
            {openModal && (
                <div style={{
                    position: "fixed",
                    top: 0, left: 0,
                    width: "100vw",
                    height: "100vh",
                    background: "rgba(0,0,0,0.5)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 300
                }}>
                    <div style={{
                        background: "#fdf5e6",
                        width: "80%",
                        maxWidth: "1200px",
                        height: "80%",
                        padding: "20px",
                        borderRadius: "12px",
                        overflowY: "auto",
                        display: "flex",
                        flexDirection: "column",
                    }}>
                        <h3 style={{ marginBottom: "10px" }}>Choisir un cours</h3>

                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Rechercher un cours…"
                            style={{
                                width: "100%",
                                padding: "10px",
                                margin: "10px 0 20px 0",
                                fontSize: "16px",
                                boxSizing: "border-box"
                            }}
                        />

                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                            gap: "15px"
                        }}>
                            {filteredCourses.map((course) => (
                                <div
                                    key={course.id}
                                    onClick={() => chooseCourse(course)}
                                    style={{
                                        border: "2px solid #888",
                                        borderRadius: "12px",
                                        padding: "10px",
                                        cursor: "pointer",
                                        backgroundColor: "#fffbe6",
                                        boxShadow: "2px 2px 8px rgba(0,0,0,0.15)",
                                        transition: "transform 0.2s",
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "flex-start",
                                        height: "280px"
                                    }}
                                >
                                    <strong style={{ fontSize: "16px", marginBottom: "5px" }}>{course.name}</strong>
                                    <p style={{ margin: "2px 0", fontWeight: "bold" }}>{course.id}</p>
                                    <p style={{ fontSize: "14px", overflowY: "auto", flexGrow: 1 }}>
                                        {course.description}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={() => setOpenModal(false)}
                            style={{
                                marginTop: "20px",
                                padding: "8px 15px",
                                borderRadius: "6px",
                                cursor: "pointer",
                                alignSelf: "flex-end",
                                backgroundColor: "#ff7f50",
                                color: "white",
                                border: "none"
                            }}
                        >
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

