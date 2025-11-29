const api = import.meta.env.VITE_API_URL || "http://localhost:7070"; 

export async function fetchAllCourses() {
    const res = await fetch (`${api}/courses`);
    if (!res.ok) throw new Error("Erreur serveur");
    return await res.json();
}

 export async function fetchCourseById(id) {
     const res = await fetch ( `${api}/courses/${id}`);
     if (!res.ok) throw new Error("Cours introuvable");
     return await res.json();
}

