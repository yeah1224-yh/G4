// src/composants/CourseCard.jsx
import React, { useEffect, useState } from "react";
import "../styles/CourseCard.css";

/* Clé localStorage pour la langue utilisateur */
const LANG_KEY = "ift2255_langue";

/* Composant carte individuelle de cours */
export default function CourseCard({ course }) {
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
      sessions: "Sessions offertes",
      periods: "Périodes",
      schedule: "Horaire",
      prereq: "Prérequis",
      day: "Jour",
      evening: "Soir",
      nonePrereq: "Aucun",
      or: " ou ",
      autumn: "Automne",
      winter: "Hiver",
      summer: "Été",
    },
    en: {
      unspecified: "Not specified",
      credits: "Credits",
      sessions: "Offered terms",
      periods: "Periods",
      schedule: "Schedule",
      prereq: "Prerequisites",
      day: "Daytime",
      evening: "Evening",
      nonePrereq: "None",
      or: " or ",
      autumn: "Autumn",
      winter: "Winter",
      summer: "Summer",
    },
  }[lang] || {};

  /* Formatage des horaires du cours */
  const getSchedule = () => {
    const list = Array.isArray(course.schedules) ? course.schedules : [];
    const valid = list.filter((s) => s && (s.day || s.start || s.end));
    
    if (valid.length === 0) return t.unspecified;

    return valid
      .map((s) => {
        const day = s.day ?? "";
        const start = s.start ?? "";
        const end = s.end ?? "";
        return `${day} ${start}${start || end ? " - " : ""}${end}`.trim();
      })
      .join(", ");
  };

  /* Sessions disponibles (automne/hiver/été) */
  const getAvailableTerms = () => {
    const termsInfo = course.available_terms;
    if (!termsInfo) return t.unspecified;

    const terms = [];
    if (termsInfo.autumn) terms.push(t.autumn);
    if (termsInfo.winter) terms.push(t.winter);
    if (termsInfo.summer) terms.push(t.summer);

    return terms.length > 0 ? terms.join(", ") : t.unspecified;
  };

  /* Périodes disponibles (jour/soir) */
  const getAvailablePeriods = () => {
    const periodsInfo = course.available_periods;
    if (!periodsInfo) return t.unspecified;

    const periods = [];
    if (periodsInfo.daytime) periods.push(t.day);
    if (periodsInfo.evening) periods.push(t.evening);

    return periods.length > 0 ? periods.join(", ") : t.unspecified;
  };

  /* Prérequis du cours */
  const getPrerequisites = () => {
    if (
      Array.isArray(course.prerequisite_courses) &&
      course.prerequisite_courses.length > 0
    ) {
      return course.prerequisite_courses.join(t.or);
    }
    return t.nonePrereq;
  };

  /* Rendu JSX de la carte */
  return (
    <div className="course-card">
      {/* En-tête : code et nom du cours */}
      <h3>
        {course.id} – {course.name}
      </h3>
      
      {/* Description du cours */}
      <p className="description">{course.description}</p>

      {/* Liste des informations détaillées */}
      <ul className="course-info">
        {/* Nombre de crédits */}
        <li>
          <strong>{t.credits} :</strong> {course.credits ?? t.unspecified}
        </li>
        
        {/* Sessions offertes */}
        <li>
          <strong>{t.sessions} :</strong> {getAvailableTerms()}
        </li>
        
        {/* Périodes disponibles */}
        <li>
          <strong>{t.periods} :</strong> {getAvailablePeriods()}
        </li>
        
        {/* Horaires */}
        <li>
          <strong>{t.schedule} :</strong> {getSchedule()}
        </li>
        
        {/* Prérequis */}
        <li>
          <strong>{t.prereq} :</strong> {getPrerequisites()}
        </li>
      </ul>
    </div>
  );
}
