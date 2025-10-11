// Mock data for courses
const coursesData = [
    {
        code: "IFT1015",
        title: "Programmation 1",
        credits: 3,
        description: "Introduction à la programmation orientée objet avec Java. Concepts fondamentaux : classes, objets, héritage, polymorphisme.",
        level: "1er cycle",
        session: ["A", "H"],
        difficulty: 2,
        workload: 10,
        reviewCount: 45,
        avgGrade: 3.1,
        failRate: 15,
        prerequisites: [],
        professor: "Prof. Martin",
        tags: ["Programmation", "Java", "POO"]
    },
    {
        code: "IFT1025",
        title: "Programmation 2",
        credits: 3,
        description: "Structures de données et algorithmes. Arbres, graphes, algorithmes de tri et de recherche. Complexité algorithmique.",
        level: "1er cycle",
        session: ["A", "H"],
        difficulty: 3,
        workload: 12,
        reviewCount: 38,
        avgGrade: 2.9,
        failRate: 18,
        prerequisites: ["IFT1015"],
        professor: "Prof. Dubois",
        tags: ["Algorithmes", "Structures de données"]
    },
    {
        code: "IFT2255",
        title: "Génie Logiciel",
        credits: 3,
        description: "Méthodologies de développement logiciel. UML, patrons de conception, tests, gestion de projet agile (Scrum).",
        level: "1er cycle",
        session: ["A", "H"],
        difficulty: 4,
        workload: 15,
        reviewCount: 52,
        avgGrade: 3.2,
        failRate: 12,
        prerequisites: ["IFT1015", "IFT1025"],
        professor: "Prof. Lavoie",
        tags: ["Génie logiciel", "UML", "Agile"]
    },
    {
        code: "IFT2035",
        title: "Concepts des langages de programmation",
        credits: 3,
        description: "Paradigmes de programmation : fonctionnel, logique, orienté objet. Lambda calcul, Haskell, Prolog.",
        level: "1er cycle",
        session: ["A"],
        difficulty: 5,
        workload: 18,
        reviewCount: 28,
        avgGrade: 2.7,
        failRate: 25,
        prerequisites: ["IFT1025"],
        professor: "Prof. Tremblay",
        tags: ["Langages", "Haskell", "Théorie"]
    },
    {
        code: "IFT2245",
        title: "Systèmes d'exploitation",
        credits: 3,
        description: "Concepts des systèmes d'exploitation : processus, threads, synchronisation, mémoire virtuelle, systèmes de fichiers.",
        level: "1er cycle",
        session: ["A", "H"],
        difficulty: 4,
        workload: 14,
        reviewCount: 41,
        avgGrade: 3.0,
        failRate: 20,
        prerequisites: ["IFT1025"],
        professor: "Prof. Roy",
        tags: ["OS", "Système", "C"]
    },
    {
        code: "IFT3000",
        title: "Langages de script",
        credits: 3,
        description: "Programmation avec langages de script : Python, JavaScript, Shell. Automatisation, traitement de données.",
        level: "1er cycle",
        session: ["A", "H"],
        difficulty: 2,
        workload: 8,
        reviewCount: 35,
        avgGrade: 3.5,
        failRate: 8,
        prerequisites: ["IFT1015"],
        professor: "Prof. Gagnon",
        tags: ["Python", "JavaScript", "Scripting"]
    },
    {
        code: "IFT3100",
        title: "Infographie",
        credits: 3,
        description: "Introduction à l'infographie 3D. OpenGL, transformations géométriques, illumination, textures, ray tracing.",
        level: "1er cycle",
        session: ["A"],
        difficulty: 4,
        workload: 16,
        reviewCount: 23,
        avgGrade: 3.1,
        failRate: 15,
        prerequisites: ["IFT1025", "MAT1978"],
        professor: "Prof. Leduc",
        tags: ["Graphique", "OpenGL", "3D"]
    },
    {
        code: "IFT3150",
        title: "Projet de développement",
        credits: 6,
        description: "Projet d'envergure en équipe. Développement d'une application complète suivant les méthodologies agiles.",
        level: "1er cycle",
        session: ["A", "H"],
        difficulty: 3,
        workload: 20,
        reviewCount: 31,
        avgGrade: 3.4,
        failRate: 5,
        prerequisites: ["IFT2255"],
        professor: "Prof. Multiple",
        tags: ["Projet", "Équipe", "Agile"]
    },
    {
        code: "IFT3245",
        title: "Simulation et modèles stochastiques",
        credits: 3,
        description: "Simulation d'événements discrets. Générateurs aléatoires, files d'attente, chaînes de Markov.",
        level: "1er cycle",
        session: ["H"],
        difficulty: 4,
        workload: 13,
        reviewCount: 19,
        avgGrade: 2.9,
        failRate: 22,
        prerequisites: ["IFT1025", "MAT2715"],
        professor: "Prof. Bergeron",
        tags: ["Simulation", "Probabilités", "Modélisation"]
    },
    {
        code: "IFT3295",
        title: "Sécurité informatique",
        credits: 3,
        description: "Principes de sécurité : cryptographie, authentification, autorisation, attaques, vulnérabilités courantes.",
        level: "1er cycle",
        session: ["A"],
        difficulty: 3,
        workload: 12,
        reviewCount: 27,
        avgGrade: 3.3,
        failRate: 10,
        prerequisites: ["IFT2245"],
        professor: "Prof. Hébert",
        tags: ["Sécurité", "Cryptographie", "Réseau"]
    },
    {
        code: "IFT3710",
        title: "Bases de données",
        credits: 3,
        description: "Conception et utilisation de bases de données relationnelles. SQL, normalisation, transactions, indexation.",
        level: "1er cycle",
        session: ["A", "H"],
        difficulty: 3,
        workload: 11,
        reviewCount: 44,
        avgGrade: 3.2,
        failRate: 13,
        prerequisites: ["IFT1025"],
        professor: "Prof. Côté",
        tags: ["Base de données", "SQL", "Relationnel"]
    },
    {
        code: "IFT3913",
        title: "Qualité logicielle et métriques",
        credits: 3,
        description: "Métriques de qualité logicielle, tests, refactoring, dette technique, analyse statique de code.",
        level: "1er cycle",
        session: ["H"],
        difficulty: 3,
        workload: 12,
        reviewCount: 21,
        avgGrade: 3.1,
        failRate: 14,
        prerequisites: ["IFT2255"],
        professor: "Prof. Morin",
        tags: ["Qualité", "Tests", "Métriques"]
    },
    {
        code: "IFT3911",
        title: "Apprentissage automatique",
        credits: 3,
        description: "Introduction au machine learning : régression, classification, réseaux de neurones, apprentissage profond.",
        level: "1er cycle",
        session: ["A", "H"],
        difficulty: 4,
        workload: 15,
        reviewCount: 38,
        avgGrade: 3.0,
        failRate: 18,
        prerequisites: ["IFT1025", "MAT1978"],
        professor: "Prof. Bouchard",
        tags: ["IA", "Machine Learning", "Python"]
    },
    {
        code: "IFT2125",
        title: "Informatique théorique",
        credits: 3,
        description: "Théorie de la calculabilité, complexité, automates, langages formels, machines de Turing.",
        level: "1er cycle",
        session: ["A"],
        difficulty: 5,
        workload: 16,
        reviewCount: 25,
        avgGrade: 2.6,
        failRate: 28,
        prerequisites: ["IFT1025", "MAT1978"],
        professor: "Prof. Lefebvre",
        tags: ["Théorie", "Complexité", "Automates"]
    },
    {
        code: "IFT2105",
        title: "Réseaux informatiques",
        credits: 3,
        description: "Architecture réseau, protocoles TCP/IP, HTTP, sockets, programmation réseau, sécurité réseau.",
        level: "1er cycle",
        session: ["H"],
        difficulty: 3,
        workload: 13,
        reviewCount: 33,
        avgGrade: 3.1,
        failRate: 16,
        prerequisites: ["IFT1025"],
        professor: "Prof. Laporte",
        tags: ["Réseau", "TCP/IP", "Socket"]
    }
];

// Mock reviews data
const reviewsData = {
    "IFT2255": [
        {
            session: "A2024",
            difficulty: 4,
            workload: 15,
            comment: "Excellent cours, très pratique. Les projets d'équipe sont enrichissants mais demandent beaucoup de temps.",
            date: "2024-12-15"
        },
        {
            session: "H2024",
            difficulty: 3,
            workload: 14,
            comment: "Bonne introduction au génie logiciel. UML peut être complexe au début mais ça devient clair.",
            date: "2024-04-20"
        },
        {
            session: "A2023",
            difficulty: 5,
            workload: 18,
            comment: "Cours très exigeant mais utile pour la suite. Beaucoup de travail mais ça en vaut la peine.",
            date: "2023-12-10"
        }
    ],
    "IFT1015": [
        {
            session: "A2024",
            difficulty: 2,
            workload: 10,
            comment: "Parfait pour débuter en programmation. Le prof explique bien les concepts de base.",
            date: "2024-12-01"
        },
        {
            session: "H2024",
            difficulty: 2,
            workload: 9,
            comment: "Cours accessible, bien structuré. Les TPs progressent graduellement en difficulté.",
            date: "2024-04-15"
        }
    ],
    "IFT3911": [
        {
            session: "A2024",
            difficulty: 4,
            workload: 16,
            comment: "Fascinant mais dense. Beaucoup de mathématiques. Les projets Python sont super intéressants.",
            date: "2024-12-20"
        },
        {
            session: "H2024",
            difficulty: 5,
            workload: 17,
            comment: "Très théorique, nécessite bonnes bases en maths. Le contenu est passionnant.",
            date: "2024-04-25"
        }
    ]
};






