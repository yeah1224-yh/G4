import React, { useEffect, useState, useMemo } from "react";
import { fetchAllCourses } from "../api/coursesApi.js";
import CourseCard from "./CourseCard.jsx";

export default function ConsulterListeView() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchId, setSearchId] = useState("");

    useEffect(() => {
        fetchAllCourses()
            .then(data => {
                setCourses(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Erreur lors du chargement des cours :", err);
                setError("Impossible de récupérer les cours.");
                setLoading(false);
            });
    }, []);

    const filteredCourses = useMemo(() => {
        if (!searchId) return courses;
        return courses.filter(course =>
            course.id.toLowerCase().includes(searchId.toLowerCase())
        );
    }, [courses, searchId]);

    return (
        <div style={{
            width: "100vw",
            height: "100vh",
            padding: "20px",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            backgroundColor: "#f5f5f5"
        }}>
            {/* Barre de recherche en haut */}
            <div style={{
                display: "flex",
                justifyContent: "flex-end" // aligne à droite
            }}>
                <input
                    type="text"
                    placeholder="Rechercher par ID..."
                    value={searchId}
                    onChange={e => setSearchId(e.target.value)}
                    style={{
                        width: "250px",       // largeur fixe
                        padding: "10px",
                        borderRadius: "8px",
                        border: "1px solid #ccc",
                        fontSize: "1rem"
                    }}
                />
            </div>

            {/* Liste des cours scrollable */}
            <div style={{
                flex: 1,
                overflowY: "auto",
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: "20px",
                paddingRight: "10px"
            }}>
                {loading && <p>Chargement des cours...</p>}
                {error && <p style={{ color: "red" }}>{error}</p>}
                {!loading && !error && filteredCourses.map((course, index) => (
                    <CourseCard key={index} course={course} />
                ))}
            </div>
        </div>
    );
}

