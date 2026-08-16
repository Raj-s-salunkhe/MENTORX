const normalizeText = (text = "") => {
    return text.toLowerCase().trim();
};

const unique = (items) => {
    return [...new Set(items)];
};

const extractRequirements = (description) => {
    const text = normalizeText(description);
    const requirements = [];

    const rules = [
        {
            keywords: ["login", "user", "authentication", "signup", "register"],
            requirement: "User Authentication"
        },
        {
            keywords: ["database", "store data", "save data", "records"],
            requirement: "Database Management"
        },
        {
            keywords: ["ai", "artificial intelligence", "machine learning", "ml"],
            requirement: "AI / Machine Learning"
        },
        {
            keywords: ["dashboard", "admin panel", "analytics"],
            requirement: "Dashboard / Analytics"
        },
        {
            keywords: ["api", "integration", "third party"],
            requirement: "API Integration"
        },
        {
            keywords: ["mobile", "android", "ios", "phone"],
            requirement: "Mobile Application"
        },
        {
            keywords: ["chat", "messaging", "real time", "realtime"],
            requirement: "Real-time Communication"
        },
        {
            keywords: ["payment", "stripe", "razorpay", "checkout"],
            requirement: "Payment Integration"
        },
        {
            keywords: ["notification", "email", "sms"],
            requirement: "Notification System"
        },
        {
            keywords: ["search", "filter", "recommendation"],
            requirement: "Search / Recommendation System"
        },
        {
            keywords: ["upload", "file", "image", "document"],
            requirement: "File Management"
        },
        {
            keywords: ["map", "location", "gps"],
            requirement: "Location Services"
        }
    ];

    for (const rule of rules) {
        if (
            rule.keywords.some(keyword =>
                text.includes(keyword)
            )
        ) {
            requirements.push(rule.requirement);
        }
    }

    if (requirements.length === 0) {
        requirements.push(
            "User Interface",
            "Application Logic",
            "Data Management"
        );
    }

    return unique(requirements);
};

const getTechnologyRecommendations = (
    category,
    requirements = []
) => {
    const technologies = [];

    if (category === "Artificial Intelligence") {
        technologies.push(
            {
                name: "Python",
                purpose: "AI and machine learning logic"
            },
            {
                name: "FastAPI",
                purpose: "Backend APIs"
            },
            {
                name: "React",
                purpose: "Frontend interface"
            }
        );
    } else if (category === "Web Development") {
        technologies.push(
            {
                name: "React",
                purpose: "Frontend interface"
            },
            {
                name: "Node.js",
                purpose: "Backend runtime"
            },
            {
                name: "Express.js",
                purpose: "REST APIs"
            }
        );
    } else if (category === "Mobile Development") {
        technologies.push(
            {
                name: "React Native",
                purpose: "Cross-platform mobile application"
            },
            {
                name: "Node.js",
                purpose: "Backend"
            }
        );
    } else if (category === "Cybersecurity") {
        technologies.push(
            {
                name: "Python",
                purpose: "Security automation"
            },
            {
                name: "Linux",
                purpose: "Security environment"
            }
        );
    } else {
        technologies.push(
            {
                name: "JavaScript",
                purpose: "Application development"
            },
            {
                name: "Node.js",
                purpose: "Backend"
            }
        );
    }

    const requirementTechnologyMap = [
        {
            requirement: "Database Management",
            technology: {
                name: "MongoDB",
                purpose: "Application database"
            }
        },
        {
            requirement: "User Authentication",
            technology: {
                name: "JWT",
                purpose: "User authentication"
            }
        },
        {
            requirement: "Dashboard / Analytics",
            technology: {
                name: "Chart.js",
                purpose: "Charts and analytics"
            }
        },
        {
            requirement: "Real-time Communication",
            technology: {
                name: "Socket.IO",
                purpose: "Real-time communication"
            }
        },
        {
            requirement: "Payment Integration",
            technology: {
                name: "Razorpay",
                purpose: "Payment processing"
            }
        },
        {
            requirement: "File Management",
            technology: {
                name: "Cloud Storage",
                purpose: "File and image storage"
            }
        },
        {
            requirement: "Location Services",
            technology: {
                name: "Map API",
                purpose: "Maps and location features"
            }
        }
    ];

    for (const item of requirementTechnologyMap) {
        if (requirements.includes(item.requirement)) {
            technologies.push(item.technology);
        }
    }

    return unique(
        technologies.map(technology =>
            JSON.stringify(technology)
        )
    ).map(value =>
        JSON.parse(value)
    );
};

const getRequiredSkills = (category, requirements) => {
    const skills = [];

    if (category === "Artificial Intelligence") {
        skills.push(
            "Python",
            "Machine Learning"
        );
    }

    if (category === "Web Development") {
        skills.push(
            "JavaScript",
            "React",
            "Node.js"
        );
    }

    if (category === "Mobile Development") {
        skills.push(
            "React Native",
            "JavaScript"
        );
    }

    if (category === "Cybersecurity") {
        skills.push(
            "Python",
            "Cybersecurity",
            "Linux"
        );
    }

    if (requirements.includes("Database Management")) {
        skills.push("Database Management");
    }

    if (requirements.includes("User Authentication")) {
        skills.push("Authentication");
    }

    if (requirements.includes("API Integration")) {
        skills.push("API Development");
    }

    if (requirements.includes("Real-time Communication")) {
        skills.push("Socket Programming");
    }

    if (requirements.includes("Payment Integration")) {
        skills.push("Payment Integration");
    }

    if (requirements.includes("Dashboard / Analytics")) {
        skills.push("Data Visualization");
    }

    if (requirements.includes("File Management")) {
        skills.push("File Handling");
    }

    if (skills.length === 0) {
        skills.push(
            "Programming",
            "Problem Solving",
            "Application Development"
        );
    }

    return unique(skills);
};

const calculateComplexityScore = (
    text,
    requirements,
    technologies,
    difficulty
) => {
    let score = 0;

    score += requirements.length * 5;
    score += Math.max(0, technologies.length - 2) * 3;

    const complexityKeywords = [
        "ai",
        "machine learning",
        "real time",
        "realtime",
        "chat",
        "payment",
        "multiple users",
        "recommendation",
        "analytics",
        "dashboard",
        "mobile",
        "api",
        "integration",
        "security"
    ];

    for (const keyword of complexityKeywords) {
        if (text.includes(keyword)) {
            score += 4;
        }
    }

    if (difficulty === "Beginner") {
        score -= 5;
    }

    if (difficulty === "Intermediate") {
        score += 8;
    }

    if (difficulty === "Advanced") {
        score += 18;
    }

    return Math.max(5, score);
};

const calculateProjectEstimate = ({
    description,
    requirements,
    technologies,
    difficulty
}) => {
    const text = normalizeText(description);

    const complexityScore = calculateComplexityScore(
        text,
        requirements,
        technologies,
        difficulty
    );

    let estimatedDays = 7 + complexityScore;

    if (requirements.includes("AI / Machine Learning")) {
        estimatedDays += 5;
    }

    if (requirements.includes("Real-time Communication")) {
        estimatedDays += 4;
    }

    if (requirements.includes("Payment Integration")) {
        estimatedDays += 3;
    }

    if (requirements.includes("Mobile Application")) {
        estimatedDays += 5;
    }

    if (requirements.includes("Dashboard / Analytics")) {
        estimatedDays += 3;
    }

    if (requirements.includes("File Management")) {
        estimatedDays += 2;
    }

    if (requirements.includes("Location Services")) {
        estimatedDays += 2;
    }

    if (difficulty === "Beginner") {
        estimatedDays *= 0.85;
    }

    if (difficulty === "Intermediate") {
        estimatedDays *= 1.05;
    }

    if (difficulty === "Advanced") {
        estimatedDays *= 1.3;
    }

    estimatedDays = Math.round(
        Math.max(5, estimatedDays)
    );

    let dailyRate = 600;

    if (difficulty === "Intermediate") {
        dailyRate = 900;
    }

    if (difficulty === "Advanced") {
        dailyRate = 1300;
    }

    let estimatedBudget =
        estimatedDays * dailyRate;

    if (requirements.includes("AI / Machine Learning")) {
        estimatedBudget += 5000;
    }

    if (requirements.includes("Payment Integration")) {
        estimatedBudget += 3000;
    }

    if (requirements.includes("Real-time Communication")) {
        estimatedBudget += 2500;
    }

    if (requirements.includes("Mobile Application")) {
        estimatedBudget += 4000;
    }

    if (requirements.includes("Dashboard / Analytics")) {
        estimatedBudget += 2000;
    }

    return {
        estimatedDays,
        estimatedBudget: Math.round(
            estimatedBudget / 500
        ) * 500
    };
};

const buildRoadmap = (
    requirements,
    category,
    difficulty
) => {
    const roadmap = [];

    roadmap.push({
        phase: "Planning",
        duration: "1-2 days",
        tasks: [
            "Define project scope",
            "Identify users and requirements",
            "Plan system architecture"
        ]
    });

    roadmap.push({
        phase: "UI / UX Design",
        duration: "2-3 days",
        tasks: [
            "Design screens",
            "Create user flow",
            "Prepare responsive layout"
        ]
    });

    roadmap.push({
        phase: "Backend Development",
        duration:
            difficulty === "Advanced"
                ? "5-8 days"
                : "3-6 days",
        tasks: [
            "Build APIs",
            "Design data models",
            "Implement business logic"
        ]
    });

    if (requirements.includes("Database Management")) {
        roadmap.push({
            phase: "Database",
            duration: "2-3 days",
            tasks: [
                "Design database schema",
                "Create models",
                "Connect application to database"
            ]
        });
    }

    if (requirements.includes("User Authentication")) {
        roadmap.push({
            phase: "Authentication",
            duration: "1-2 days",
            tasks: [
                "Implement registration",
                "Implement login",
                "Protect private routes"
            ]
        });
    }

    if (requirements.includes("AI / Machine Learning")) {
        roadmap.push({
            phase: "AI Development",
            duration: "4-7 days",
            tasks: [
                "Prepare AI logic",
                "Integrate model or AI service",
                "Test AI responses"
            ]
        });
    }

    if (requirements.includes("Real-time Communication")) {
        roadmap.push({
            phase: "Real-time Features",
            duration: "3-4 days",
            tasks: [
                "Build real-time connection",
                "Implement messaging",
                "Test concurrent users"
            ]
        });
    }

    if (requirements.includes("Payment Integration")) {
        roadmap.push({
            phase: "Payments",
            duration: "2-3 days",
            tasks: [
                "Configure payment provider",
                "Implement checkout",
                "Test transactions"
            ]
        });
    }

    roadmap.push({
        phase: "Testing",
        duration: "2-4 days",
        tasks: [
            "Test core functionality",
            "Fix bugs",
            "Test responsive behavior"
        ]
    });

    roadmap.push({
        phase: "Deployment",
        duration: "1-2 days",
        tasks: [
            "Prepare production environment",
            "Deploy application",
            "Perform final verification"
        ]
    });

    return roadmap;
};

const getSuggestions = (
    requirements,
    difficulty
) => {
    const suggestions = [
        "Build the smallest working version first.",
        "Keep frontend and backend responsibilities separate.",
        "Test important APIs before connecting the full UI."
    ];

    if (requirements.includes("AI / Machine Learning")) {
        suggestions.push(
            "Start with a simple AI workflow before adding advanced intelligence."
        );
    }

    if (requirements.includes("Real-time Communication")) {
        suggestions.push(
            "Test multiple simultaneous users early."
        );
    }

    if (requirements.includes("Payment Integration")) {
        suggestions.push(
            "Use a sandbox/test payment environment during development."
        );
    }

    if (difficulty === "Advanced") {
        suggestions.push(
            "Break the project into independent modules before development."
        );
    }

    return suggestions;
};

const analyzeProject = (
    title,
    description,
    category,
    difficulty
) => {
    const requirements =
        extractRequirements(description);

    const technologies =
        getTechnologyRecommendations(
            category,
            requirements
        );

    const requiredSkills =
        getRequiredSkills(
            category,
            requirements
        );

    const roadmap =
        buildRoadmap(
            requirements,
            category,
            difficulty
        );

    const estimate =
        calculateProjectEstimate({
            description,
            requirements,
            technologies,
            difficulty
        });

    const complexityScore =
        calculateComplexityScore(
            normalizeText(description),
            requirements,
            technologies,
            difficulty
        );

    let complexity = "Low";

    if (complexityScore >= 25) {
        complexity = "Medium";
    }

    if (complexityScore >= 45) {
        complexity = "High";
    }

    if (complexityScore >= 65) {
        complexity = "Very High";
    }

    return {
        projectSummary:
            `${title} is a ${difficulty.toLowerCase()} ${category} project. The plan is based on the actual features described in the project idea.`,

        extractedRequirements:
            requirements,

        technologies,

        requiredSkills,

        roadmap,

        estimatedDays:
            estimate.estimatedDays,

        estimatedBudget:
            estimate.estimatedBudget,

        complexity,

        suggestions:
            getSuggestions(
                requirements,
                difficulty
            )
    };
};

const getTechnologyRecommendationsForCategory = (
    category
) => {
    return getTechnologyRecommendations(
        category,
        []
    );
};

const getTechnologyRecommendationsExport = (
    category
) => {
    return getTechnologyRecommendationsForCategory(
        category
    );
};

module.exports = {
    analyzeProject,
    extractRequirements,
    getTechnologyRecommendations:
        getTechnologyRecommendationsExport,
    calculateProjectEstimate
};