// src/views/CourseCard.jsx
import React from "react";

export default function CourseCard({ course }) {
    return (
        <div style={{
            width: "400px",
            height: "500px",
            borderRadius: "15px",
            overflow: "hidden",
            boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
            background: "linear-gradient(145deg, #fef9f3, #fcd34d)", // style carte jeu
            border: "3px solid #f59e0b",
            margin: "15px",
            fontFamily: "'Arial', sans-serif",
            display: "flex",
            flexDirection: "column",
            cursor: "pointer",
            transition: "transform 0.3s, box-shadow 0.3s"
        }}
        onMouseEnter={e => {
            e.currentTarget.style.transform = "scale(1.05)";
            e.currentTarget.style.boxShadow = "0 12px 25px rgba(0,0,0,0.5)";
        }}
        onMouseLeave={e => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.3)";
        }}
        >
            {/* Header */}
            <div style={{
                backgroundColor: "#f59e0b",
                color: "#fff",
                textAlign: "center",
                padding: "10px",
                fontWeight: "bold",
                fontSize: "1rem"
            }}>
                {course.name}
            </div>

            {/* ID */}
            <div style={{
                textAlign: "center",
                fontWeight: "bold",
                margin: "10px 0",
                color: "#b45309"
            }}>
                {course.id}
            </div>

            {/* Description */}
            <div style={{
                padding: "10px",
                fontSize: "1rem",
                color: "#333",
                flex: 1,
                overflowY: "auto"
            }}>
                {course.description}
            </div>
        </div>
    );
}

