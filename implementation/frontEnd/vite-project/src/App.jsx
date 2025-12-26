// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomeController from "./controllers/HomeController.jsx";
import { CoursesCacheProvider } from "./controllers/CoursesCache.jsx"; 

/* Composant racine de l'application */
function App() {
  return (
    /* Provider du cache des cours (gère le chargement et le cache global) */
    <CoursesCacheProvider>
      <BrowserRouter>
        <Routes>
          {/* Route principale : HomeController (accueil + navigation) */}
          <Route path="/" element={<HomeController />} />
        </Routes>
      </BrowserRouter>
    </CoursesCacheProvider>
  );
}

export default App;
