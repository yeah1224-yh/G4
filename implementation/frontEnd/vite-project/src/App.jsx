import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomeController from "./controllers/HomeController.jsx";
import { CoursesCacheProvider } from "./controllers/CoursesCache.jsx"; 

function App() {
    return (
        <CoursesCacheProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<HomeController />} />
                </Routes>
            </BrowserRouter>
        </CoursesCacheProvider>
    );
}

export default App;

