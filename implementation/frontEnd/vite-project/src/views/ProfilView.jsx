// src/views/ProfilView.jsx
import React, { useEffect, useState } from "react";
import "../styles/HomeController.css";
import "../styles/Profil.css";

/* Constantes de clés localStorage */
const CLIENT_ID_KEY = "ift2255_client_id";    // ID client anonyme
const LANG_KEY = "ift2255_langue";            // Langue utilisateur
const PROGRAM_KEY = "ift2255_programme";      // Programme suivi

/* Liste des programmes disponibles en français */
const PROGRAMS_FR = [
  "Baccalauréat en informatique",
  "Baccalauréat en mathématiques", 
  "Baccalauréat en physique",
];

/* Liste des programmes disponibles en anglais */
const PROGRAMS_EN = [
  "Bachelor of Computer Science",
  "Bachelor of Mathematics",
  "Bachelor of Physics",
];

/* Objets de traduction i18n */
const TEXTS = {
  fr: {
    back: "Retour",
    title: "Profil et préférences",
    anonId: "Identifiant anonyme :",
    language: "Langue",
    french: "Français",
    english: "Anglais",
    program: "Programme suivi",
    noProgram: "-- Aucun programme --",
    save: "Sauvegarder mes préférences",
    noChange: "Aucun changement détecté.",
    saved: "Préférences sauvegardées avec succès.",
    errorSave: "Erreur lors de l'enregistrement des préférences",
    unexpected: "Erreur inattendue.",
  },
  en: {
    back: "Back",
    title: "Profile and preferences",
    anonId: "Anonymous ID:",
    language: "Language",
    french: "French",
    english: "English",
    program: "Program",
    noProgram: "-- No program --",
    save: "Save my preferences",
    noChange: "No changes detected.",
    saved: "Preferences saved successfully.",
    errorSave: "Error while saving preferences",
    unexpected: "Unexpected error.",
  },
};

/* Génère ou récupère l'ID client unique depuis localStorage */
function getOrCreateClientId() {
  let id = window.localStorage.getItem(CLIENT_ID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    window.localStorage.setItem(CLIENT_ID_KEY, id);
  }
  return id;
}

/* Composant principal ProfilView */
export default function ProfilView({ goHome }) {
  /* États locaux du composant */
  const [clientId, setClientId] = useState("");                    // ID client anonyme
  const [langue, setLangue] = useState("fr");                      // Langue sélectionnée
  const [programme, setProgramme] = useState("");                  // Programme sélectionné
  const [message, setMessage] = useState("");                      // Message de feedback
  const [messageType, setMessageType] = useState("");              // Type de message ("success" | "error" | "info")

  /* Traductions actives selon la langue */
  const t = TEXTS[langue] || TEXTS.fr;
  
  /* Liste des programmes selon la langue */
  const programs = langue === "fr" ? PROGRAMS_FR : PROGRAMS_EN;

  /* Initialisation des données au montage du composant */
  useEffect(() => {
    /* Génération/récupération de l'ID client */
    setClientId(getOrCreateClientId());

    /* Chargement de la langue stockée */
    const storedLang = window.localStorage.getItem(LANG_KEY);
    if (storedLang === "fr" || storedLang === "en") {
      setLangue(storedLang);
    }

    /* Chargement du programme stocké */
    const storedProgram = window.localStorage.getItem(PROGRAM_KEY);
    if (storedProgram) {
      setProgramme(storedProgram);
    }
  }, []);

  /* Gestionnaire de soumission du formulaire */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setMessageType("");

    /* Vérification des changements */
    const storedLang = window.localStorage.getItem(LANG_KEY);
    const storedProgram = window.localStorage.getItem(PROGRAM_KEY);

    const langChanged = storedLang !== langue;
    const programChanged = storedProgram !== programme;

    /* Pas de changement détecté */
    if (!langChanged && !programChanged) {
      console.log("No changes detected");
      setMessage(t.noChange);
      setMessageType("info");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    /* Préparation des données à envoyer */
    const payload = {
      clientId,
      langue,
      programme,
    };

    try {
      /* Appel API pour sauvegarder les préférences */
      const api = import.meta.env.VITE_API_URL || "http://localhost:7070";
      const res = await fetch(`${api}/preferences`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(t.errorSave);
      }

      console.log(`Preferences saved - Language: ${langue}, Program: "${programme}"`);

      /* Sauvegarde en localStorage */
      window.localStorage.setItem(LANG_KEY, langue);
      window.localStorage.setItem(PROGRAM_KEY, programme);

      /* Notification des changements aux autres composants */
      if (langChanged) {
        window.dispatchEvent(new Event("languageChanged"));
      }
      if (programChanged) {
        window.dispatchEvent(new Event("programmeChanged"));
      }

      /* Message de succès */
      setMessage(t.saved);
      setMessageType("success");
      setTimeout(() => setMessage(""), 4000);
    } catch (err) {
      console.error("Error saving preferences:", err);
      setMessage(err.message || t.unexpected);
      setMessageType("error");
    }
  };

  /* Rendu JSX principal */
  return (
    <div className="profil-container">
      {/* Bouton retour */}
      <button className="btn-back" onClick={goHome}>
        {t.back}
      </button>

      {/* Titre principal */}
      <h2>{t.title}</h2>

      {/* Identifiant anonyme (commenté) */}
      {/* 
      <p className="profil-id">
        {t.anonId} <code>{clientId}</code>
      </p>
      */}

      {/* Formulaire de préférences */}
      <form className="profil-form" onSubmit={handleSubmit}>
        {/* Sélecteur de langue */}
        <label>
          {t.language}
          <select value={langue} onChange={(e) => setLangue(e.target.value)}>
            <option value="fr">{t.french}</option>
            <option value="en">{t.english}</option>
          </select>
        </label>

        {/* Sélecteur de programme */}
        <label>
          {t.program}
          <select
            value={programme}
            onChange={(e) => setProgramme(e.target.value)}
          >
            <option value="">{t.noProgram}</option>
            {programs.map((prog) => (
              <option key={prog} value={prog}>
                {prog}
              </option>
            ))}
          </select>
        </label>

        {/* Bouton de sauvegarde */}
        <button type="submit">{t.save}</button>
      </form>

      {/* Message de feedback */}
      {message && (
        <p
          className={`profil-message ${messageType}`}
          style={{
            marginTop: "16px",
            padding: "12px",
            borderRadius: "8px",
            textAlign: "center",
          }}
        >
          {message}
        </p>
      )}
    </div>
  );
}
