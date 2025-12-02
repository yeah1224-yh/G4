import { createContext, useContext, useState, useRef } from "react";
import { fetchAllCourses } from "../api/coursesApi";

const CoursesCacheContext = createContext();

export function CoursesCacheProvider({ children }) {
    const [courses, setCourses] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    const loadingPromiseRef = useRef(null);
    const cacheRef = useRef(null);

    const loadCourses = async (queryParams = {}) => {
        // Si déjà en cache, retourne immédiatement
        if (cacheRef.current) {
            return Promise.resolve(cacheRef.current);
        }

        // Si une requête est déjà en cours, retourne la même promesse
        if (loadingPromiseRef.current) {
            return loadingPromiseRef.current;
        }

        setLoading(true);
        setError(null);

        loadingPromiseRef.current = fetchAllCourses(queryParams)
            .then(data => {
                cacheRef.current = data;
                setCourses(data);
                return data;
            })
            .catch(err => {
                setError(err);
                throw err;
            })
            .finally(() => {
                setLoading(false);
                loadingPromiseRef.current = null;
            });

        return loadingPromiseRef.current;
    };

    const clearCache = () => {
        cacheRef.current = null;
        setCourses(null);
        setError(null);
    };

    return (
        <CoursesCacheContext.Provider 
            value={{ courses, loadCourses, clearCache, loading, error }}
        >
            {children}
        </CoursesCacheContext.Provider>
    );
}

export function useCoursesCache() {
    const context = useContext(CoursesCacheContext);
    if (!context) {
        throw new Error("useCoursesCache must be used within a CoursesCacheProvider");
    }
    return context;
}
