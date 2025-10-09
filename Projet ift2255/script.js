// Données simulées pour le prototype
const mockCourses = [
    {
        id: 1,
        code: "IFT2255",
        title: "Développement de logiciels",
        credits: 3,
        description: "Concepts et techniques de développement de logiciels, méthodes agiles, gestion de projet.",
        prerequisites: ["IFT1004", "IFT1025"],
        difficulty: 3.5,
        workload: 4,
        schedule: "Hiver 2024",
        program: "IFT",
        average: 3.2,
        enrolled: 120,
        failures: 8,
        reviews: [
            { rating: 4, comment: "Excellent cours, très pratique", difficulty: 3, workload: 4 },
            { rating: 5, comment: "Professeur excellent, projets intéressants", difficulty: 4, workload: 5 },
            { rating: 3, comment: "Beaucoup de travail mais formateur", difficulty: 3, workload: 4 }
        ]
    },
    {
        id: 2,
        code: "IFT2004",
        title: "Structures de données",
        credits: 3,
        description: "Étude des structures de données fondamentales et de leurs algorithmes.",
        prerequisites: ["IFT1004"],
        difficulty: 4.2,
        workload: 4.5,
        schedule: "Automne 2024",
        program: "IFT",
        average: 2.8,
        enrolled: 95,
        failures: 12,
        reviews: [
            { rating: 4, comment: "Cours difficile mais essentiel", difficulty: 5, workload: 5 },
            { rating: 3, comment: "Beaucoup de théorie, peu de pratique", difficulty: 4, workload: 4 }
        ]
    },
    {
        id: 3,
        code: "IFT3000",
        title: "Intelligence artificielle",
        credits: 3,
        description: "Introduction aux concepts et techniques de l'intelligence artificielle.",
        prerequisites: ["IFT2004", "MAT1600"],
        difficulty: 3.8,
        workload: 3.5,
        schedule: "Hiver 2024",
        program: "IFT",
        average: 3.5,
        enrolled: 80,
        failures: 5,
        reviews: [
            { rating: 5, comment: "Cours fascinant, très à jour", difficulty: 3, workload: 3 },
            { rating: 4, comment: "Projets intéressants en machine learning", difficulty: 4, workload: 4 }
        ]
    },
    {
        id: 4,
        code: "GLO2000",
        title: "Génie logiciel",
        credits: 3,
        description: "Méthodes et outils pour le développement de logiciels de qualité.",
        prerequisites: ["IFT2255"],
        difficulty: 3.2,
        workload: 3,
        schedule: "Automne 2024",
        program: "GLO",
        average: 3.4,
        enrolled: 60,
        failures: 3,
        reviews: [
            { rating: 4, comment: "Très utile pour la carrière", difficulty: 3, workload: 3 },
            { rating: 5, comment: "Professeur excellent, cours bien structuré", difficulty: 3, workload: 3 }
        ]
    }
];

let currentSearchResults = [];
let comparisonCourses = [];
let currentCourse = null;

// Fonction de recherche
function searchCourses() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const programFilter = document.getElementById('filter-program').value;
    
    currentSearchResults = mockCourses.filter(course => {
        const matchesSearch = course.code.toLowerCase().includes(searchTerm) ||
                            course.title.toLowerCase().includes(searchTerm) ||
                            course.description.toLowerCase().includes(searchTerm);
        const matchesProgram = !programFilter || course.program === programFilter;
        return matchesSearch && matchesProgram;
    });
    
    displaySearchResults();
}

// Affichage des résultats de recherche
function displaySearchResults() {
    const resultsContainer = document.getElementById('search-results');
    resultsContainer.innerHTML = '';
    
    if (currentSearchResults.length === 0) {
        resultsContainer.innerHTML = `
            <div class="col-12">
                <div class="alert alert-info">
                    <i class="fas fa-info-circle me-2"></i>
                    Aucun cours trouvé pour votre recherche.
                </div>
            </div>
        `;
        return;
    }
    
    currentSearchResults.forEach(course => {
        const courseCard = createCourseCard(course);
        resultsContainer.appendChild(courseCard);
    });
}

// Création d'une carte de cours
function createCourseCard(course) {
    const col = document.createElement('div');
    col.className = 'col-md-6 col-lg-4 mb-4';
    
    const avgRating = course.reviews.length > 0 ? 
        (course.reviews.reduce((sum, review) => sum + review.rating, 0) / course.reviews.length).toFixed(1) : 'N/A';
    
    col.innerHTML = `
        <div class="card course-card h-100" onclick="showCourseDetails(${course.id})">
            <div class="card-body">
                <h5 class="card-title">${course.code}</h5>
                <h6 class="card-subtitle mb-2 text-muted">${course.title}</h6>
                <p class="card-text">${course.description.substring(0, 100)}...</p>
                <div class="row text-center">
                    <div class="col-4">
                        <small class="text-muted">Crédits</small>
                        <div class="fw-bold">${course.credits}</div>
                    </div>
                    <div class="col-4">
                        <small class="text-muted">Difficulté</small>
                        <div class="fw-bold">${course.difficulty}/5</div>
                    </div>
                    <div class="col-4">
                        <small class="text-muted">Avis</small>
                        <div class="fw-bold">${avgRating}/5</div>
                    </div>
                </div>
            </div>
            <div class="card-footer">
                <button class="btn btn-sm btn-outline-primary" onclick="event.stopPropagation(); addToComparison(${course.id})">
                    <i class="fas fa-plus me-1"></i>Comparer
                </button>
                <span class="badge bg-secondary ms-2">${course.program}</span>
            </div>
        </div>
    `;
    
    return col;
}

// Affichage des détails d'un cours
function showCourseDetails(courseId) {
    currentCourse = mockCourses.find(c => c.id === courseId);
    if (!currentCourse) return;
    
    document.getElementById('courseModalTitle').textContent = `${currentCourse.code} - ${currentCourse.title}`;
    
    const avgRating = currentCourse.reviews.length > 0 ? 
        (currentCourse.reviews.reduce((sum, review) => sum + review.rating, 0) / currentCourse.reviews.length).toFixed(1) : 'N/A';
    
    const reviewsHtml = currentCourse.reviews.map(review => `
        <div class="border-bottom pb-2 mb-2">
            <div class="d-flex justify-content-between">
                <span class="fw-bold">${'★'.repeat(review.rating)}${'☆'.repeat(5-review.rating)}</span>
                <small class="text-muted">Difficulté: ${review.difficulty}/5 | Charge: ${review.workload}/5</small>
            </div>
            <p class="mb-0">${review.comment}</p>
        </div>
    `).join('');
    
    document.getElementById('courseModalBody').innerHTML = `
        <div class="row">
            <div class="col-md-6">
                <h6>Informations générales</h6>
                <p><strong>Crédits:</strong> ${currentCourse.credits}</p>
                <p><strong>Programme:</strong> ${currentCourse.program}</p>
                <p><strong>Session:</strong> ${currentCourse.schedule}</p>
                <p><strong>Prérequis:</strong> ${currentCourse.prerequisites.join(', ')}</p>
                
                <h6 class="mt-3">Statistiques académiques</h6>
                <div class="row text-center">
                    <div class="col-4">
                        <div class="stats-card p-2 rounded">
                            <div class="fw-bold">${currentCourse.average}</div>
                            <small>Moyenne</small>
                        </div>
                    </div>
                    <div class="col-4">
                        <div class="stats-card p-2 rounded">
                            <div class="fw-bold">${currentCourse.enrolled}</div>
                            <small>Inscrits</small>
                        </div>
                    </div>
                    <div class="col-4">
                        <div class="stats-card p-2 rounded">
                            <div class="fw-bold">${currentCourse.failures}</div>
                            <small>Échecs</small>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-6">
                <h6>Description</h6>
                <p>${currentCourse.description}</p>
                
                <h6 class="mt-3">Évaluation générale</h6>
                <div class="row text-center">
                    <div class="col-6">
                        <div class="p-2 border rounded">
                            <div class="fw-bold">${currentCourse.difficulty}/5</div>
                            <small>Difficulté</small>
                        </div>
                    </div>
                    <div class="col-6">
                        <div class="p-2 border rounded">
                            <div class="fw-bold">${currentCourse.workload}/5</div>
                            <small>Charge de travail</small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="mt-4">
            <h6>Avis étudiants (${currentCourse.reviews.length} avis)</h6>
            ${currentCourse.reviews.length > 0 ? reviewsHtml : '<p class="text-muted">Aucun avis disponible</p>'}
        </div>
    `;
    
    const modal = new bootstrap.Modal(document.getElementById('courseModal'));
    modal.show();
}

// Ajout à la comparaison
function addToComparison(courseId = null) {
    const course = courseId ? mockCourses.find(c => c.id === courseId) : currentCourse;
    if (!course) return;
    
    if (comparisonCourses.length >= 3) {
        alert('Vous ne pouvez comparer que 3 cours maximum.');
        return;
    }
    
    if (comparisonCourses.find(c => c.id === course.id)) {
        alert('Ce cours est déjà dans la comparaison.');
        return;
    }
    
    comparisonCourses.push(course);
    updateComparisonTable();
}

// Mise à jour du tableau de comparaison
function updateComparisonTable() {
    const comparisonSection = document.getElementById('comparison-section');
    const comparisonBody = document.getElementById('comparison-body');
    
    if (comparisonCourses.length === 0) {
        comparisonSection.style.display = 'none';
        return;
    }
    
    comparisonSection.style.display = 'block';
    
    // Mise à jour des en-têtes
    for (let i = 1; i <= 3; i++) {
        const header = document.getElementById(`course${i}-header`);
        if (i <= comparisonCourses.length) {
            header.textContent = comparisonCourses[i-1].code;
        } else {
            header.textContent = `Cours ${i}`;
        }
    }
    
    // Génération du contenu du tableau
    const criteria = [
        { name: 'Titre', getValue: course => course.title },
        { name: 'Crédits', getValue: course => course.credits },
        { name: 'Difficulté', getValue: course => `${course.difficulty}/5` },
        { name: 'Charge de travail', getValue: course => `${course.workload}/5` },
        { name: 'Moyenne', getValue: course => course.average },
        { name: 'Inscrits', getValue: course => course.enrolled },
        { name: 'Échecs', getValue: course => course.failures },
        { name: 'Prérequis', getValue: course => course.prerequisites.join(', ') }
    ];
    
    comparisonBody.innerHTML = criteria.map(criterion => {
        const cells = [criterion.name];
        for (let i = 0; i < 3; i++) {
            if (i < comparisonCourses.length) {
                cells.push(criterion.getValue(comparisonCourses[i]));
            } else {
                cells.push('-');
            }
        }
        return `<tr><td>${cells.join('</td><td>')}</td></tr>`;
    }).join('');
}

// Vider la comparaison
function clearComparison() {
    comparisonCourses = [];
    updateComparisonTable();
}

// Gestion du profil
function showProfile() {
    document.getElementById('profile-section').style.display = 'block';
}

function hideProfile() {
    document.getElementById('profile-section').style.display = 'none';
}

function saveProfile() {
    const theoryPractice = document.getElementById('theory-practice').value;
    const interests = [];
    
    if (document.getElementById('interest-ai').checked) interests.push('IA');
    if (document.getElementById('interest-web').checked) interests.push('Web');
    if (document.getElementById('interest-data').checked) interests.push('Données');
    
    alert(`Profil sauvegardé!\nPréférence: ${theoryPractice}\nIntérêts: ${interests.join(', ')}`);
    hideProfile();
}

// Recherche automatique au chargement
document.addEventListener('DOMContentLoaded', function() {
    // Afficher tous les cours par défaut
    currentSearchResults = mockCourses;
    displaySearchResults();
    
    // Recherche en temps réel
    document.getElementById('search-input').addEventListener('input', searchCourses);
    document.getElementById('filter-program').addEventListener('change', searchCourses);
});
