// Global state
let displayedCourses = [...coursesData];
let compareList = JSON.parse(localStorage.getItem('compareList') || '[]');

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    updateCompareCount();
    renderCourses(displayedCourses);
    
    // Enable search on Enter key
    document.getElementById('searchInput')?.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchCourses();
        }
    });
    
    // Load compare page if needed
    if (window.location.pathname.includes('comparaison.html')) {
        renderComparisonTable();
    }
    
    // Load course details if needed
    const urlParams = new URLSearchParams(window.location.search);
    const courseCode = urlParams.get('code');
    if (courseCode && window.location.pathname.includes('cours-details.html')) {
        loadCourseDetails(courseCode);
    }
});

// Search courses
function searchCourses() {
    const query = document.getElementById('searchInput').value.toLowerCase().trim();
    
    if (!query) {
        displayedCourses = [...coursesData];
    } else {
        displayedCourses = coursesData.filter(course => 
            course.code.toLowerCase().includes(query) ||
            course.title.toLowerCase().includes(query) ||
            course.description.toLowerCase().includes(query) ||
            course.tags.some(tag => tag.toLowerCase().includes(query))
        );
    }
    
    document.getElementById('resultsTitle').textContent = 
        query ? `Résultats pour "${query}"` : 'Tous les cours disponibles';
    
    renderCourses(displayedCourses);
}

// Filter by level
function filterByLevel(level) {
    displayedCourses = coursesData.filter(course => course.code.startsWith('IFT' + level.charAt(0)));
    document.getElementById('resultsTitle').textContent = `Cours de niveau ${level}`;
    document.getElementById('searchInput').value = '';
    renderCourses(displayedCourses);
}

// Show all courses
function showAllCourses() {
    displayedCourses = [...coursesData];
    document.getElementById('resultsTitle').textContent = 'Tous les cours disponibles';
    document.getElementById('searchInput').value = '';
    renderCourses(displayedCourses);
}

// Sort results
function sortResults() {
    const sortBy = document.getElementById('sortSelect').value;
    
    switch(sortBy) {
        case 'code':
            displayedCourses.sort((a, b) => a.code.localeCompare(b.code));
            break;
        case 'difficulty':
            displayedCourses.sort((a, b) => b.difficulty - a.difficulty);
            break;
        case 'workload':
            displayedCourses.sort((a, b) => b.workload - a.workload);
            break;
    }
    
    renderCourses(displayedCourses);
}

// Render course cards
function renderCourses(courses) {
    const container = document.getElementById('courseResults');
    const noResults = document.getElementById('noResults');
    
    if (!container) return;
    
    document.getElementById('resultsCount').textContent = `${courses.length} cours trouvé${courses.length > 1 ? 's' : ''}`;
    
    if (courses.length === 0) {
        container.style.display = 'none';
        noResults.style.display = 'block';
        return;
    }
    
    container.style.display = 'flex';
    noResults.style.display = 'none';
    
    container.innerHTML = courses.map(course => `
        <div class="col-md-6 col-lg-4">
            <div class="card course-card h-100 shadow-sm">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <h5 class="card-title mb-0">
                            <a href="cours-details.html?code=${course.code}" class="text-decoration-none">
                                ${course.code}
                            </a>
                        </h5>
                        <span class="badge bg-secondary">${course.credits} crédits</span>
                    </div>
                    <h6 class="card-subtitle mb-3 text-muted">${course.title}</h6>
                    
                    <p class="card-text small text-truncate-3">${course.description}</p>
                    
                    <div class="course-stats mt-3">
                        <div class="stat-item">
                            <i class="bi bi-bar-chart-fill text-primary"></i>
                            <span class="small">Difficulté: ${renderStars(course.difficulty)}</span>
                        </div>
                        <div class="stat-item">
                            <i class="bi bi-clock-fill text-warning"></i>
                            <span class="small">Charge: ${course.workload}h/sem</span>
                        </div>
                        <div class="stat-item">
                            <i class="bi bi-chat-dots-fill text-success"></i>
                            <span class="small">${course.reviewCount} avis</span>
                        </div>
                    </div>
                    
                    <div class="d-flex gap-2 mt-3">
                        <a href="cours-details.html?code=${course.code}" class="btn btn-sm btn-primary flex-grow-1">
                            <i class="bi bi-eye"></i> Détails
                        </a>
                        <button class="btn btn-sm btn-outline-primary" 
                                onclick="toggleCompare('${course.code}')"
                                id="compare-btn-${course.code}">
                            <i class="bi bi-plus-circle"></i>
                        </button>
                    </div>
                </div>
                ${course.prerequisites.length > 0 ? `
                <div class="card-footer bg-light small">
                    <i class="bi bi-diagram-3"></i> Prérequis: ${course.prerequisites.join(', ')}
                </div>
                ` : ''}
            </div>
        </div>
    `).join('');
    
    // Update compare buttons
    updateCompareButtons();
}

// Render stars for difficulty
function renderStars(rating) {
    const fullStars = Math.floor(rating);
    let html = '';
    for (let i = 0; i < 5; i++) {
        html += i < fullStars 
            ? '<i class="bi bi-star-fill text-warning"></i>' 
            : '<i class="bi bi-star text-warning"></i>';
    }
    return html;
}

// Toggle course in compare list
function toggleCompare(courseCode) {
    const index = compareList.indexOf(courseCode);
    
    if (index > -1) {
        compareList.splice(index, 1);
    } else {
        if (compareList.length >= 5) {
            alert('Maximum 5 cours peuvent être comparés à la fois');
            return;
        }
        compareList.push(courseCode);
    }
    
    localStorage.setItem('compareList', JSON.stringify(compareList));
    updateCompareCount();
    updateCompareButtons();
}

// Update compare count badge
function updateCompareCount() {
    const countElement = document.getElementById('compareCount');
    if (countElement) {
        countElement.textContent = compareList.length;
    }
}

// Update compare buttons state
function updateCompareButtons() {
    compareList.forEach(code => {
        const btn = document.getElementById(`compare-btn-${code}`);
        if (btn) {
            btn.innerHTML = '<i class="bi bi-check-circle-fill"></i>';
            btn.classList.remove('btn-outline-primary');
            btn.classList.add('btn-success');
        }
    });
}

// Load course details page
function loadCourseDetails(courseCode) {
    const course = coursesData.find(c => c.code === courseCode);
    
    if (!course) {
        document.getElementById('courseDetailsContent').innerHTML = `
            <div class="alert alert-danger">
                <h4>Cours introuvable</h4>
                <p>Le cours ${courseCode} n'existe pas dans notre base de données.</p>
                <a href="index.html" class="btn btn-primary">Retour à la recherche</a>
            </div>
        `;
        return;
    }
    
    // Update page title
    document.title = `${course.code} - ${course.title}`;
    
    // Render course details
    const container = document.getElementById('courseDetailsContent');
    const reviews = reviewsData[courseCode] || [];
    
    container.innerHTML = `
        <div class="row">
            <div class="col-lg-8">
                <!-- Course Header -->
                <div class="course-header mb-4">
                    <div class="d-flex justify-content-between align-items-start">
                        <div>
                            <h1 class="display-5">${course.code}</h1>
                            <h2 class="h4 text-muted">${course.title}</h2>
                        </div>
                        <span class="badge bg-primary fs-5">${course.credits} crédits</span>
                    </div>
                    <div class="mt-3">
                        ${course.tags.map(tag => `<span class="badge bg-secondary me-1">${tag}</span>`).join('')}
                    </div>
                </div>
                
                <!-- Description -->
                <div class="card mb-4">
                    <div class="card-body">
                        <h3 class="h5 card-title"><i class="bi bi-file-text"></i> Description</h3>
                        <p class="card-text">${course.description}</p>
                    </div>
                </div>
                
                <!-- Prerequisites -->
                ${course.prerequisites.length > 0 ? `
                <div class="card mb-4">
                    <div class="card-body">
                        <h3 class="h5 card-title"><i class="bi bi-diagram-3"></i> Prérequis</h3>
                        <div class="d-flex gap-2">
                            ${course.prerequisites.map(pre => `
                                <a href="cours-details.html?code=${pre}" class="btn btn-outline-primary btn-sm">
                                    ${pre}
                                </a>
                            `).join('')}
                        </div>
                    </div>
                </div>
                ` : ''}
                
                <!-- Reviews Section -->
                <div class="card mb-4">
                    <div class="card-header bg-white">
                        <h3 class="h5 mb-0"><i class="bi bi-chat-dots"></i> Avis Étudiants (${reviews.length})</h3>
                    </div>
                    <div class="card-body">
                        ${reviews.length >= 5 ? `
                            ${reviews.slice(0, 3).map(review => `
                                <div class="review-item p-3 mb-3 bg-light rounded">
                                    <div class="d-flex justify-content-between mb-2">
                                        <span class="badge bg-info">${review.session}</span>
                                        <small class="text-muted">${new Date(review.date).toLocaleDateString('fr-CA')}</small>
                                    </div>
                                    <div class="mb-2">
                                        <span class="me-3">
                                            <i class="bi bi-bar-chart-fill text-primary"></i>
                                            Difficulté: ${renderStars(review.difficulty)}
                                        </span>
                                        <span>
                                            <i class="bi bi-clock-fill text-warning"></i>
                                            ${review.workload}h/sem
                                        </span>
                                    </div>
                                    <p class="mb-0">${review.comment}</p>
                                </div>
                            `).join('')}
                        ` : `
                            <div class="alert alert-warning">
                                <i class="bi bi-exclamation-triangle"></i>
                                Pas assez d'avis pour afficher des statistiques fiables (minimum: 5).
                                <br><small>Actuellement: ${reviews.length} avis</small>
                            </div>
                        `}
                    </div>
                </div>
            </div>
            
            <!-- Sidebar -->
            <div class="col-lg-4">
                <!-- Quick Stats -->
                <div class="card mb-4 sticky-top" style="top: 20px;">
                    <div class="card-header bg-primary text-white">
                        <h3 class="h6 mb-0">Statistiques</h3>
                    </div>
                    <div class="card-body">
                        <div class="stat-row mb-3">
                            <div class="d-flex justify-content-between">
                                <span>Difficulté moyenne</span>
                                <strong>${renderStars(course.difficulty)}</strong>
                            </div>
                        </div>
                        <div class="stat-row mb-3">
                            <div class="d-flex justify-content-between">
                                <span>Charge de travail</span>
                                <strong>${course.workload}h/sem</strong>
                            </div>
                        </div>
                        <div class="stat-row mb-3">
                            <div class="d-flex justify-content-between">
                                <span>Moyenne de classe</span>
                                <strong>${course.avgGrade}/4.3</strong>
                            </div>
                        </div>
                        <div class="stat-row mb-3">
                            <div class="d-flex justify-content-between">
                                <span>Taux d'échec</span>
                                <strong class="text-danger">${course.failRate}%</strong>
                            </div>
                        </div>
                        <div class="stat-row">
                            <div class="d-flex justify-content-between">
                                <span>Sessions offertes</span>
                                <strong>${course.session.join(', ')}</strong>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Actions -->
                <div class="card">
                    <div class="card-body">
                        <button class="btn btn-primary w-100 mb-2" onclick="toggleCompare('${course.code}')">
                            <i class="bi bi-plus-circle"></i> Ajouter à la comparaison
                        </button>
                        <a href="index.html" class="btn btn-outline-secondary w-100">
                            <i class="bi bi-arrow-left"></i> Retour à la recherche
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Render comparison table
function renderComparisonTable() {
    const container = document.getElementById('comparisonTable');
    
    if (!container) return;
    
    if (compareList.length < 2) {
        container.innerHTML = `
            <div class="alert alert-info text-center py-5">
                <i class="bi bi-clipboard-x display-1"></i>
                <h4 class="mt-3">Aucune comparaison en cours</h4>
                <p class="text-muted">Sélectionnez au moins 2 cours pour les comparer</p>
                <a href="index.html" class="btn btn-primary">Rechercher des cours</a>
            </div>
        `;
        return;
    }
    
    const courses = compareList.map(code => coursesData.find(c => c.code === code)).filter(Boolean);
    
    // Calculate totals
    const totalCredits = courses.reduce((sum, c) => sum + c.credits, 0);
    const totalWorkload = courses.reduce((sum, c) => sum + c.workload, 0);
    const avgDifficulty = (courses.reduce((sum, c) => sum + c.difficulty, 0) / courses.length).toFixed(1);
    
    container.innerHTML = `
        <div class="table-responsive">
            <table class="table table-bordered table-hover comparison-table">
                <thead class="table-light">
                    <tr>
                        <th width="200">Critère</th>
                        ${courses.map(c => `
                            <th class="text-center">
                                <div class="d-flex justify-content-between align-items-center">
                                    <span>${c.code}</span>
                                    <button class="btn btn-sm btn-outline-danger" onclick="removeFromCompare('${c.code}')">
                                        <i class="bi bi-x"></i>
                                    </button>
                                </div>
                                <div class="small text-muted mt-1">${c.title}</div>
                            </th>
                        `).join('')}
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>Crédits</strong></td>
                        ${courses.map(c => `<td class="text-center">${c.credits}</td>`).join('')}
                    </tr>
                    <tr>
                        <td><strong>Difficulté</strong></td>
                        ${courses.map(c => `
                            <td class="text-center">
                                ${renderStars(c.difficulty)}
                                <div class="small text-muted">${c.difficulty}/5</div>
                            </td>
                        `).join('')}
                    </tr>
                    <tr>
                        <td><strong>Charge de travail</strong></td>
                        ${courses.map(c => `<td class="text-center">${c.workload}h/sem</td>`).join('')}
                    </tr>
                    <tr>
                        <td><strong>Moyenne de classe</strong></td>
                        ${courses.map(c => `<td class="text-center">${c.avgGrade}/4.3</td>`).join('')}
                    </tr>
                    <tr>
                        <td><strong>Taux d'échec</strong></td>
                        ${courses.map(c => `<td class="text-center text-danger">${c.failRate}%</td>`).join('')}
                    </tr>
                    <tr>
                        <td><strong>Avis étudiants</strong></td>
                        ${courses.map(c => `<td class="text-center">${c.reviewCount} avis</td>`).join('')}
                    </tr>
                    <tr>
                        <td><strong>Prérequis</strong></td>
                        ${courses.map(c => `
                            <td class="text-center">
                                ${c.prerequisites.length > 0 
                                    ? c.prerequisites.join(', ') 
                                    : '<span class="text-success">Aucun</span>'}
                            </td>
                        `).join('')}
                    </tr>
                    <tr>
                        <td><strong>Sessions</strong></td>
                        ${courses.map(c => `<td class="text-center">${c.session.join(', ')}</td>`).join('')}
                    </tr>
                    <tr class="table-primary">
                        <td><strong>Actions</strong></td>
                        ${courses.map(c => `
                            <td class="text-center">
                                <a href="cours-details.html?code=${c.code}" class="btn btn-sm btn-primary">
                                    Voir détails
                                </a>
                            </td>
                        `).join('')}
                    </tr>
                </tbody>
                <tfoot class="table-light">
                    <tr>
                        <td><strong>TOTAL</strong></td>
                        <td colspan="${courses.length}" class="text-center">
                            <strong>${totalCredits} crédits</strong> · 
                            <strong>${totalWorkload}h/sem</strong> · 
                            Difficulté moyenne: <strong>${avgDifficulty}/5</strong>
                        </td>
                    </tr>
                </tfoot>
            </table>
        </div>
        
        ${totalWorkload > 40 ? `
            <div class="alert alert-warning mt-3">
                <i class="bi bi-exclamation-triangle-fill"></i>
                <strong>Attention!</strong> La charge de travail totale (${totalWorkload}h/sem) est très élevée.
                Considérez réduire le nombre de cours ou choisir des cours moins exigeants.
            </div>
        ` : ''}
        
        ${avgDifficulty >= 4 ? `
            <div class="alert alert-info mt-3">
                <i class="bi bi-info-circle-fill"></i>
                La combinaison de cours est très exigeante (difficulté moyenne: ${avgDifficulty}/5).
                Assurez-vous d'avoir le temps nécessaire pour réussir.
            </div>
        ` : ''}
    `;
}

// Remove course from compare
function removeFromCompare(courseCode) {
    const index = compareList.indexOf(courseCode);
    if (index > -1) {
        compareList.splice(index, 1);
        localStorage.setItem('compareList', JSON.stringify(compareList));
        updateCompareCount();
        renderComparisonTable();
    }
}

// Clear all comparisons
function clearComparison() {
    if (confirm('Voulez-vous vraiment vider la liste de comparaison?')) {
        compareList = [];
        localStorage.setItem('compareList', JSON.stringify(compareList));
        updateCompareCount();
        renderComparisonTable();
    }
}






