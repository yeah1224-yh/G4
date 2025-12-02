import React from "react";

export default function CourseCard({ course }) {
const getSchedule = () => {
if (!course.schedules || course.schedules.length === 0) return "Non spécifié";
return course.schedules.map(s => `${s.day} ${s.start} - ${s.end}`).join(", ");
};


const getAvailableTerms = () => {
    if (!course.available_terms) return "Non spécifié";
    const terms = [];
    if (course.available_terms.autumn) terms.push("Automne");
    if (course.available_terms.winter) terms.push("Hiver");
    if (course.available_terms.summer) terms.push("Été");
    return terms.length > 0 ? terms.join(", ") : "Non spécifié";
};

const getAvailablePeriods = () => {
    if (!course.available_periods) return "Non spécifié";
    const periods = [];
    if (course.available_periods.daytime) periods.push("Jour");
    if (course.available_periods.evening) periods.push("Soir");
    return periods.length > 0 ? periods.join(", ") : "Non spécifié";
};

const getPrerequisites = () => {
    if (course.prerequisite_courses && course.prerequisite_courses.length > 0) {
        return course.prerequisite_courses.join(" ou ");
    }
    return "Aucun";
};

return (
    <div style={{
        width: "380px",
        minHeight: "500px",
        borderRadius: "12px",
        overflow: "hidden",
        boxShadow: "0 4px 15px rgba(5, 5, 5, 0.15)",
        backgroundColor: "#ffffff",
        border: "1px solid #d1d5db",
        margin: "12px",
        fontFamily: "'Helvetica Neue', Arial, sans-serif",
        display: "flex",
        flexDirection: "column",
        cursor: "pointer",
        transition: "transform 0.2s, box-shadow 0.2s"
    }}
    onMouseEnter={e => {
        e.currentTarget.style.transform = "scale(1.03)";
        e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.2)";
    }}
    onMouseLeave={e => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.boxShadow = "0 4px 15px rgba(0,0,0,0.15)";
    }}
    >
        {/* Header */}
        <div style={{
            backgroundColor: "#1e3a8a",
            color: "#f9fafb",
            textAlign: "center",
            padding: "14px",
            fontWeight: "600",
            fontSize: "1.15rem"
        }}>
            {course.name}
        </div>

        {/* ID et Crédits sur la même ligne */}
        <div style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "12px 16px",
            backgroundColor: "#f3f4f6",
            borderBottom: "1px solid #e5e7eb",
            fontSize: "0.95rem",
            color: "#374151",
            fontWeight: "500"
        }}>
            <span>{course.id}</span>
            <span>{course.credits} crédit{course.credits > 1 ? 's' : ''}</span>
        </div>

        {/* Horaires, Périodes, Session et Préalable */}
        <div style={{
            padding: "12px 16px",
            backgroundColor: "#f9fafb",
            borderBottom: "1px solid #e5e7eb",
            fontSize: "0.85rem",
            color: "#374151",
            display: "flex",
            flexDirection: "column",
            gap: "4px"
        }}>
            <div><strong>Horaires:</strong> {getSchedule()}</div>
            <div><strong>Périodes:</strong> {getAvailablePeriods()}</div>
            <div><strong>Session:</strong> {getAvailableTerms()}</div>
            <div><strong>Préalable:</strong> {getPrerequisites()}</div>
        </div>

        {/* Description */}
        <div style={{
            padding: "14px 16px",
            fontSize: "0.9rem",
            color: "#4b5563",
            flex: 1,
            overflowY: "auto",
            lineHeight: "1.45"
        }}>
            {course.description || "Aucune description disponible."}
        </div>
    </div>
);

}
