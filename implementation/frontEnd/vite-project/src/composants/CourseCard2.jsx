// src/composants/CourseCard2.jsx
import React, { useEffect, useState } from "react";

/* Clé localStorage pour la langue utilisateur */
const LANG_KEY = "ift2255_langue";

/* Labels des sessions selon la langue */
const TERM_LABELS = {
  fr: {
    autumn: "Automne",
    winter: "Hiver",
    summer: "Été",
  },
  en: {
    autumn: "Autumn",
    winter: "Winter",
    summer: "Summer",
  },
};

/* Composant carte de cours compacte pour la comparaison */
export default function CourseCard2({ course, onClick }) {
  /* État local pour la langue */
  const [lang, setLang] = useState("fr");

  /* Chargement initial de la langue depuis localStorage */
  useEffect(() => {
    const stored = window.localStorage.getItem(LANG_KEY);
    if (stored === "fr" || stored === "en") {
      setLang(stored);
    }
  }, []);

  /* Objets de traduction i18n */
  const t = {
    fr: {
      unspecified: "Non spécifié",
      credits: "Crédits",
      schedule: "Horaires",
      term: "Session",
      prereq: "Préalable",
      nonePrereq: "Aucun",
    },
    en: {
      unspecified: "Not specified",
      credits: "Credits",
      schedule: "Schedule",
      term: "Term",
      prereq: "Prerequisite",
      nonePrereq: "None",
    },
  }[lang] || {};

  /* Labels des sessions selon la langue courante */
  const termLabels = TERM_LABELS[lang] || TERM_LABELS.fr;

  /* Formatage des horaires */
  const formatSchedules = (schedules = []) => {
    if (!Array.isArray(schedules) || schedules.length === 0) return t.unspecified;
    
    const items = schedules
      .filter(
        (s) =>
          s &&
          typeof s.day === "string" &&
          typeof s.start === "string" &&
          typeof s.end === "string"
      )
      .map((s) => `${s.day} ${s.start}-${s.end}`);
    
    return items.length > 0 ? items.join(", ") : t.unspecified;
  };

  /* Formatage des sessions disponibles */
  const formatTerms = (terms) => {
    if (!terms) return t.unspecified;
    
    const active = Object.entries(terms)
      .filter(([, v]) => v)
      .map(([k]) => termLabels[k] || k);
    
    return active.length > 0 ? active.join(", ") : t.unspecified;
  };

  /* Nettoyage du texte des prérequis */
  const cleanPrerequisite = (text) => {
    if (!text) return t.nonePrereq;
    return text.replace(/^prerequisite_courses\s*:\s*/i, "").trim();
  };

  /* Rendu conditionnel : pas de cours → rien */
  if (!course) return null;

  /* Rendu JSX de la carte compacte */
  return (
    <div className="compare-course-card2" onClick={onClick}>
      {/* Nom du cours (titre principal) */}
      <strong className="compare-course2-title">{course.name}</strong>
      
      {/* ID du cours */}
      <p className="compare-course2-id">{course.id}</p>
      
      {/* Description courte */}
      <p className="compare-course2-description">{course.description}</p>

      {/* Informations détaillées */}
      <div>
        <strong>{t.credits}:</strong> {course.credits ?? t.unspecified}
      </div>
      
      <div>
        <strong>{t.schedule}:</strong> {formatSchedules(course.schedules)}
      </div>
      
      <div>
        <strong>{t.term}:</strong> {formatTerms(course.available_terms)}
      </div>
      
      <div>
        <strong>{t.prereq}:</strong> {cleanPrerequisite(course.requirement_text)}
      </div>
    </div>
  );
}
