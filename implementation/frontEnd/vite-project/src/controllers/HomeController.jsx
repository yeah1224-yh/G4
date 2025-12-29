// src/controllers/HomeController.jsx
import React, { useState, useEffect } from "react";
import ConsulterListeView from "../views/ConsulterListeView.jsx";
import ComparerCoursView from "../views/ComparerCoursView.jsx";
import AvisListeView from "../views/AvisListeView.jsx";
import ProfilView from "../views/ProfilView.jsx";
import { useCoursesCache } from "../controllers/CoursesCache.jsx";
import "../styles/HomeController.css";

/* Clé localStorage pour la langue utilisateur */
const LANG_KEY = "ift2255_langue";

/* Composant principal de navigation et routage */
export default function HomeController() {
  /* États locaux du contrôleur */
  const [activeTab, setActiveTab] = useState("accueil");            // Onglet actif
  const [lang, setLang] = useState("fr");                           // Langue actuelle

  /* Accès au cache des cours (optionnel, pour détecter le chargement) */
  const { courses } = useCoursesCache?.() || {};

  /* Chargement initial de la langue depuis localStorage */
  useEffect(() => {
    const stored = window.localStorage.getItem(LANG_KEY);
    if (stored === "fr" || stored === "en") {
      setLang(stored);
    }
  }, []);

  /* Écoute des changements de langue depuis ProfilView */
  useEffect(() => {
    const handleLanguageChange = () => {
      console.log("Language changed in HomeController");
      const storedLang = window.localStorage.getItem(LANG_KEY);
      if (storedLang === "fr" || storedLang === "en") {
        setLang(storedLang);
      }
    };

    window.addEventListener("languageChanged", handleLanguageChange);
    return () => window.removeEventListener("languageChanged", handleLanguageChange);
  }, []);

  /* Fonctions de navigation entre les onglets */
  const goHome = () => setActiveTab("accueil");
  const goListe = () => setActiveTab("liste");
  const goComparer = () => setActiveTab("comparer");
  const goAvis = () => setActiveTab("avis");
  const goProfil = () => setActiveTab("profil");

  /* Objets de traduction i18n pour l'accueil */
  const t = {
    fr: {
      title: "Planificateur de cours",
      intro: "Explorez, comparez et organisez vos cours facilement et efficacement.",
      btnListe: "Consulter la liste des cours",
      btnComparer: "Comparer des cours",
      btnAvis: "Voir les avis",
      btnProfil: "Profil",
    },
    en: {
      title: "Course planner",
      intro: "Explore, compare, and organize your courses easily and efficiently.",
      btnListe: "Browse course list",
      btnComparer: "Compare courses",
      btnAvis: "See reviews",
      btnProfil: "Profile",
    },
  }[lang] || {
    title: "Planificateur de cours",
    intro: "Explorez, comparez et organisez vos cours facilement et efficacement.",
    btnListe: "Consulter la liste des cours",
    btnComparer: "Comparer des cours",
    btnAvis: "Voir les avis",
    btnProfil: "Profil",
  };

  /* Fonction de rendu conditionnel des onglets */
  const renderTab = () => {
    switch (activeTab) {
      /* Onglet liste des cours */
      case "liste":
        return <ConsulterListeView goHome={goHome} />;
      
      /* Onglet comparateur de cours */
      case "comparer":
        return <ComparerCoursView goHome={goHome} />;
      
      /* Onglet avis par cours */
      case "avis":
        return <AvisListeView goHome={goHome} />;
      
      /* Onglet profil et préférences */
      case "profil":
        return <ProfilView goHome={goHome} />;
      
      /* Onglet d'accueil par défaut */
      case "accueil":
      default:
        return (
          <div className="home-view">
            {/* Titre principal */}
            <h1>{t.title}</h1>
            
            {/* Introduction dynamique */}
            <p className="home-intro">
              {t.intro}
              {courses && courses.length > 0 && (
                <> Gérez vos cours, comparez les prérequis et planifiez vos sessions en toute simplicité.</>
              )}
            </p>

            {/* Boutons d'action principaux */}
            <div className="home-actions">
              <button onClick={goListe}>{t.btnListe}</button>
              <button onClick={goComparer}>{t.btnComparer}</button>
              <button onClick={goAvis}>{t.btnAvis}</button>
              <button onClick={goProfil}>{t.btnProfil}</button>
            </div>
          </div>
        );
    }
  };

  /* Rendu principal */
  return (
    <div className="app-container">
      {renderTab()}
    </div>
  );
}
