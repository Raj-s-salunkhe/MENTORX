const Project = require("../models/Project");
const User = require("../models/User");

const normalize = (value) => {
    if (!value) return "";

    return String(value)
        .toLowerCase()
        .trim();
};

const normalizeArray = (items = []) => {
    return items
        .filter(Boolean)
        .map((item) => normalize(item));
};

const unique = (items = []) => {
    return [...new Set(items)];
};

/*
 * Extract project requirements from the project description.
 */
const extractRequirements = (description = "") => {
    const text = normalize(description);
    const requirements = [];

    const rules = [
        {
            keywords: [
                "login",
                "user",
                "authentication",
                "signup",
                "register"
            ],
            requirement: "User Authentication"
        },
        {
            keywords: [
                "database",
                "store data",
                "save data",
                "records"
            ],
            requirement: "Database Management"
        },
        {
            keywords: [
                "ai",
                "artificial intelligence",
                "machine learning",
                "ml"
            ],
            requirement: "AI / Machine Learning"
        },
        {
            keywords: [
                "dashboard",
                "admin panel",
                "analytics"
            ],
            requirement: "Dashboard / Analytics"
        },
        {
            keywords: [
                "api",
                "integration",
                "third party"
            ],
            requirement: "API Integration"
        },
        {
            keywords: [
                "mobile",
                "android",
                "ios",
                "phone"
            ],
            requirement: "Mobile Application"
        },
        {
            keywords: [
                "chat",
                "messaging",
                "real time",
                "realtime"
            ],
            requirement: "Real-time Communication"
        },
        {
            keywords: [
                "payment",
                "stripe",
                "razorpay",
                "checkout"
            ],
            requirement: "Payment Integration"
        },
        {
            keywords: [
                "notification",
                "email",
                "sms"
            ],
            requirement: "Notification System"
        },
        {
            keywords: [
                "search",
                "filter",
                "recommendation"
            ],
            requirement: "Search / Recommendation System"
        },
        {
            keywords: [
                "upload",
                "file",
                "image",
                "document"
            ],
            requirement: "File Management"
        },
        {
            keywords: [
                "map",
                "location",
                "gps"
            ],
            requirement: "Location Services"
        }
    ];

    for (const rule of rules) {
        if (
            rule.keywords.some((keyword) =>
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

/*
 * Compare user skills against project skills.
 */
const calculateSkillFeasibility = (
    userSkills = [],
    requiredSkills = []
) => {
    const skills = normalizeArray(userSkills);
    const required = normalizeArray(requiredSkills);

    if (required.length === 0) {
        return {
            score: 100,
            skillMatches: [],
            skillGaps: [],
            analysis:
                "No specific technical skills were defined for this project.",
            recommendations: [
                "Define the core technical skills required for the project."
            ]
        };
    }

    const skillMatches = required.filter((skill) =>
        skills.includes(skill)
    );

    const skillGaps = required.filter(
        (skill) => !skills.includes(skill)
    );

    const score = Math.round(
        (skillMatches.length / required.length) * 100
    );

    const recommendations = [];

    if (skillGaps.length > 0) {
        recommendations.push(
            `Learn or add support for: ${skillGaps.join(", ")}.`
        );
    }

    if (score < 60) {
        recommendations.push(
            "Consider adding teammates with complementary technical skills."
        );
    } else if (score < 80) {
        recommendations.push(
            "Close the remaining skill gaps before starting advanced features."
        );
    } else {
        recommendations.push(
            "Your technical skills cover most of the required project skills."
        );
    }

    return {
        score,
        skillMatches,
        skillGaps,
        analysis:
            score >= 80
                ? "The user's skills strongly match the project's requirements."
                : score >= 60
                    ? "The user has a reasonable skill match but some gaps remain."
                    : "The project has significant skill gaps for the current user profile.",
        recommendations
    };
};

/*
 * Technical feasibility.
 */
const calculateTechnicalFeasibility = (
    project,
    requirements,
    technologies
) => {
    let score = 80;

    const risks = [];
    const strengths = [];
    const recommendations = [];

    if (requirements.length <= 4) {
        strengths.push(
            "Project scope is relatively manageable."
        );
    } else {
        score -= 10;

        risks.push(
            "The project contains many functional requirements."
        );
    }

    if (technologies.length <= 4) {
        strengths.push(
            "Technology stack is reasonably focused."
        );
    } else {
        score -= 8;

        risks.push(
            "The project may require managing many technologies."
        );
    }

    if (
        requirements.includes(
            "AI / Machine Learning"
        )
    ) {
        score -= 5;

        risks.push(
            "AI/ML introduces additional implementation complexity."
        );

        recommendations.push(
            "Start with a simple AI workflow before advanced AI features."
        );
    }

    if (
        requirements.includes(
            "Real-time Communication"
        )
    ) {
        score -= 5;

        risks.push(
            "Real-time functionality requires additional backend complexity."
        );
    }

    if (
        requirements.includes(
            "Payment Integration"
        )
    ) {
        score -= 4;

        risks.push(
            "Payment functionality introduces security and testing requirements."
        );
    }

    if (
        requirements.includes(
            "Database Management"
        )
    ) {
        strengths.push(
            "A database-backed architecture is clearly identified."
        );
    }

    if (
        requirements.includes(
            "User Authentication"
        )
    ) {
        strengths.push(
            "Authentication can be isolated into protected APIs."
        );
    }

    if (project.difficulty === "Advanced") {
        score -= 8;
    }

    if (score < 60) {
        recommendations.push(
            "Reduce technical scope and build an MVP first."
        );
    }

    score = Math.max(
        0,
        Math.min(100, score)
    );

    return {
        score,
        analysis:
            score >= 80
                ? "The project's technical architecture appears manageable for the stated scope."
                : score >= 60
                    ? "The architecture is possible, but some technical risks should be controlled."
                    : "The current technical scope is challenging and should be reduced for the MVP.",
        strengths,
        risks,
        recommendations
    };
};

/*
 * Time feasibility.
 */
const calculateTimeFeasibility = (
    estimatedDays,
    availableDays,
    teamSize
) => {
    const safeAvailableDays =
        Number(availableDays) || 0;

    const safeTeamSize =
        Math.max(
            1,
            Number(teamSize) || 1
        );

    const totalEffort =
        Math.max(
            1,
            Number(estimatedDays) || 1
        );

    const effectiveCapacity =
        safeAvailableDays * safeTeamSize;

    let score = 50;

    if (
        effectiveCapacity >=
        totalEffort * 1.5
    ) {
        score = 95;
    } else if (
        effectiveCapacity >=
        totalEffort * 1.2
    ) {
        score = 85;
    } else if (
        effectiveCapacity >=
        totalEffort
    ) {
        score = 75;
    } else if (
        effectiveCapacity >=
        totalEffort * 0.75
    ) {
        score = 55;
    } else {
        score = 35;
    }

    const risks = [];
    const recommendations = [];

    if (safeAvailableDays <= 0) {
        risks.push(
            "Available development time has not been provided."
        );

        recommendations.push(
            "Enter the number of available development days."
        );
    }

    if (
        effectiveCapacity <
        totalEffort
    ) {
        risks.push(
            "Available team capacity may not cover the estimated development effort."
        );

        recommendations.push(
            "Reduce project scope or increase development capacity."
        );
    } else {
        recommendations.push(
            "Maintain milestones and prioritize MVP functionality."
        );
    }

    return {
        score,
        estimatedEffort:
            `${totalEffort} development days estimated for the current scope.`,
        analysis:
            effectiveCapacity >= totalEffort
                ? "The available team capacity appears sufficient for the estimated effort."
                : "The current project scope appears too large for the available capacity.",
        risks,
        recommendations
    };
};

/*
 * Financial feasibility.
 */
const calculateFinancialFeasibility = (
    estimatedBudget,
    availableBudget
) => {
    const cost =
        Number(estimatedBudget) || 0;

    const budget =
        Number(availableBudget) || 0;

    let score = 60;

    const risks = [];
    const recommendations = [];

    if (budget <= 0) {
        score = 50;

        risks.push(
            "Available budget has not been provided."
        );

        recommendations.push(
            "Define an approximate project budget."
        );
    } else if (budget >= cost * 1.5) {
        score = 95;
    } else if (budget >= cost * 1.2) {
        score = 88;
    } else if (budget >= cost) {
        score = 75;
    } else if (budget >= cost * 0.75) {
        score = 55;

        risks.push(
            "Available budget may be insufficient for the estimated project scope."
        );

        recommendations.push(
            "Reduce paid services or defer non-essential features."
        );
    } else {
        score = 35;

        risks.push(
            "Available budget is significantly below the estimated requirement."
        );

        recommendations.push(
            "Reduce scope or identify lower-cost infrastructure."
        );
    }

    const low =
        Math.round(cost * 0.8);

    const high =
        Math.round(cost * 1.2);

    return {
        score,
        estimatedCostRange:
            `Approximately ₹${low.toLocaleString(
                "en-IN"
            )} - ₹${high.toLocaleString(
                "en-IN"
            )}`,
        analysis:
            budget > 0 && budget >= cost
                ? "The available budget is broadly aligned with the estimated project cost."
                : "The project may require budget adjustments before development.",
        risks,
        recommendations
    };
};

/*
 * Data feasibility.
 */
const calculateDataFeasibility = (
    requirements,
    description
) => {
    const text = normalize(description);

    const requiredData = [];
    const risks = [];
    const recommendations = [];

    let score = 80;

    if (
        requirements.includes(
            "AI / Machine Learning"
        ) ||
        text.includes("dataset") ||
        text.includes("training data")
    ) {
        requiredData.push(
            "Training or evaluation data"
        );

        score -= 10;

        risks.push(
            "AI features may depend on data availability and quality."
        );

        recommendations.push(
            "Validate data availability and quality early."
        );
    }

    if (
        requirements.includes(
            "User Authentication"
        )
    ) {
        requiredData.push(
            "User account data"
        );
    }

    if (
        requirements.includes(
            "Database Management"
        )
    ) {
        requiredData.push(
            "Structured application records"
        );
    }

    if (
        requiredData.length === 0
    ) {
        requiredData.push(
            "Basic application data"
        );
    }

    if (
        text.includes("health") ||
        text.includes("medical") ||
        text.includes("financial")
    ) {
        score -= 10;

        risks.push(
            "Sensitive data may require stronger privacy controls."
        );

        recommendations.push(
            "Minimize sensitive data collection and protect stored records."
        );
    }

    return {
        score: Math.max(
            0,
            Math.min(100, score)
        ),
        analysis:
            score >= 80
                ? "The project appears to have manageable data requirements."
                : "Data availability, quality, or privacy should be reviewed before development.",
        requiredData:
            unique(requiredData),
        risks,
        recommendations
    };
};

/*
 * Resource feasibility.
 */
const calculateResourceFeasibility = (
    requirements,
    technologies,
    difficulty
) => {
    const resources = [
        "Development computer",
        "Source control",
        "Development environment"
    ];

    const risks = [];
    const recommendations = [];

    let score = 85;

    if (technologies.length > 0) {
        resources.push(
            `Technology stack: ${technologies.join(", ")}`
        );
    }

    if (
        requirements.includes(
            "AI / Machine Learning"
        )
    ) {
        resources.push(
            "AI/ML development environment"
        );

        score -= 5;
    }

    if (difficulty === "Advanced") {
        score -= 5;

        risks.push(
            "Advanced projects may require stronger hardware or cloud infrastructure."
        );
    }

    if (
        requirements.includes(
            "Real-time Communication"
        )
    ) {
        resources.push(
            "Real-time server infrastructure"
        );
    }

    if (
        requirements.includes(
            "Payment Integration"
        )
    ) {
        resources.push(
            "Payment provider test environment"
        );
    }

    recommendations.push(
        "Start development locally and add cloud infrastructure when needed."
    );

    return {
        score: Math.max(
            0,
            Math.min(100, score)
        ),
        analysis:
            score >= 80
                ? "The required development resources appear manageable."
                : "Additional infrastructure or development resources may be needed.",
        requiredResources:
            unique(resources),
        risks,
        recommendations
    };
};

/*
 * Team feasibility.
 */
const calculateTeamFeasibility = (
    requiredSkills,
    userSkills,
    currentTeamSize,
    recommendedTeamSize
) => {
    const skillResult =
        calculateSkillFeasibility(
            userSkills,
            requiredSkills
        );

    const teamSize =
        Math.max(
            1,
            Number(currentTeamSize) || 1
        );

    const recommendedSize =
        Math.max(
            1,
            Number(recommendedTeamSize) || 1
        );

    let score =
        skillResult.score;

    const teamStrengths = [];
    const teamGaps = [];
    const recommendations = [];

    if (teamSize >= recommendedSize) {
        score =
            Math.min(
                100,
                Math.round(
                    score * 0.7 + 30
                )
            );

        teamStrengths.push(
            "Current team size is sufficient for the recommended scope."
        );
    } else {
        score =
            Math.round(
                score * 0.8
            );

        teamGaps.push(
            `Recommended team size is approximately ${recommendedSize}, while the current team size is ${teamSize}.`
        );

        recommendations.push(
            "Add teammates or reduce project scope."
        );
    }

    if (
        skillResult.skillGaps.length > 0
    ) {
        teamGaps.push(
            `Skill gaps: ${skillResult.skillGaps.join(", ")}`
        );
    }

    if (
        recommendations.length === 0
    ) {
        recommendations.push(
            "Distribute work across frontend, backend, AI/data, testing, and deployment."
        );
    }

    return {
        score,
        analysis:
            score >= 80
                ? "The current team appears reasonably aligned with the project's size and skill requirements."
                : "The team may need additional skills or a smaller project scope.",
        teamStrengths,
        teamGaps,
        recommendations
    };
};

/*
 * Scalability feasibility.
 */
const calculateScalabilityFeasibility = (
    requirements,
    description
) => {
    const text =
        normalize(description);

    let score = 80;

    const risks = [];
    const recommendations = [];

    if (
        text.includes("large number of users") ||
        text.includes("million users") ||
        text.includes("large scale")
    ) {
        score -= 15;

        risks.push(
            "Large expected user volume may require scalable infrastructure."
        );

        recommendations.push(
            "Design APIs and database access with future scaling in mind."
        );
    }

    if (
        requirements.includes(
            "Real-time Communication"
        )
    ) {
        score -= 5;

        risks.push(
            "Real-time communication can increase server load."
        );
    }

    if (
        requirements.includes(
            "AI / Machine Learning"
        )
    ) {
        score -= 5;

        risks.push(
            "AI workloads may require additional compute capacity at scale."
        );
    }

    if (
        requirements.includes(
            "Database Management"
        )
    ) {
        recommendations.push(
            "Use indexed queries and clear data models for future growth."
        );
    }

    recommendations.push(
        "Keep frontend, backend, and data layers loosely coupled."
    );

    return {
        score: Math.max(
            0,
            Math.min(100, score)
        ),
        analysis:
            score >= 80
                ? "The current architecture can support moderate future expansion."
                : "The project may require additional scalability planning.",
        risks,
        recommendations:
            unique(recommendations)
    };
};

/*
 * Commercial feasibility.
 */
const calculateCommercialFeasibility = (
    project,
    description
) => {
    const text =
        normalize(description);

    let score = 60;

    const commercialOpportunities = [];
    const risks = [];
    const recommendations = [];

    if (
        text.includes("student") ||
        text.includes("college") ||
        text.includes("business") ||
        text.includes("customer")
    ) {
        score += 10;
    }

    if (
        text.includes("payment") ||
        text.includes("subscription") ||
        text.includes("marketplace")
    ) {
        score += 15;

        commercialOpportunities.push(
            "Potential paid or transaction-based model."
        );
    }

    commercialOpportunities.push(
        "Potential to expand functionality based on real user feedback."
    );

    risks.push(
        "Commercial success depends on real user adoption and differentiation."
    );

    recommendations.push(
        "Validate the target user problem with real users before investing heavily."
    );

    return {
        score: Math.max(
            0,
            Math.min(100, score)
        ),
        analysis:
            "Commercial feasibility should be validated through real user research.",
        commercialOpportunities,
        risks,
        recommendations
    };
};

/*
 * Classification.
 */
const getClassification = (score) => {
    if (score >= 90) {
        return "Highly Feasible";
    }

    if (score >= 75) {
        return "Feasible";
    }

    if (score >= 60) {
        return "Moderately Feasible";
    }

    if (score >= 40) {
        return "Difficult";
    }

    return "Not Feasible";
};

/*
 * Final recommendation.
 */
const getRecommendation = (
    score,
    skillGaps,
    majorRisks
) => {
    if (
        score >= 75 &&
        skillGaps.length === 0
    ) {
        return "Proceed";
    }

    if (score >= 60) {
        return "Proceed with Modifications";
    }

    if (
        majorRisks.length > 0 ||
        skillGaps.length > 0
    ) {
        return "Reduce Project Scope";
    }

    return "Not Recommended";
};

/*
 * Weighted overall score.
 */
const calculateOverallScore = ({
    technical,
    skill,
    time,
    financial,
    data,
    resource,
    team,
    scalability,
    commercial
}) => {
    const score = Math.round(
        technical * 0.15 +
        skill * 0.15 +
        time * 0.15 +
        financial * 0.12 +
        data * 0.08 +
        resource * 0.08 +
        team * 0.12 +
        scalability * 0.08 +
        commercial * 0.07
    );

    return Math.max(
        0,
        Math.min(100, score)
    );
};

/*
 * MVP recommendation.
 */
const buildMvpRecommendation = (
    requirements,
    score
) => {
    const allFeatures = [];

    if (
        requirements.includes(
            "User Authentication"
        )
    ) {
        allFeatures.push(
            "User registration and login"
        );
    }

    if (
        requirements.includes(
            "Database Management"
        )
    ) {
        allFeatures.push(
            "Core database functionality"
        );
    }

    if (
        requirements.includes(
            "AI / Machine Learning"
        )
    ) {
        allFeatures.push(
            "Basic AI functionality"
        );
    }

    if (
        requirements.includes(
            "Dashboard / Analytics"
        )
    ) {
        allFeatures.push(
            "Basic dashboard"
        );
    }

    if (
        allFeatures.length === 0
    ) {
        allFeatures.push(
            "Core project workflow",
            "Basic user interface",
            "Essential data management"
        );
    }

    const futureFeatures = [
        "Advanced analytics",
        "Scalability improvements"
    ];

    if (
        requirements.includes(
            "AI / Machine Learning"
        )
    ) {
        futureFeatures.push(
            "Advanced AI capabilities"
        );
    }

    if (
        requirements.includes(
            "Payment Integration"
        )
    ) {
        futureFeatures.push(
            "Advanced payment features"
        );
    }

    if (
        requirements.includes(
            "Real-time Communication"
        )
    ) {
        futureFeatures.push(
            "Advanced communication tools"
        );
    }

    return {
        mvpFeatures:
            score < 75
                ? allFeatures.slice(0, 3)
                : allFeatures,

        futureFeatures
    };
};

/*
 * Main feasibility analysis.
 */
const analyzeFeasibility = async (
    userId,
    projectId,
    userOverrides = {}
) => {
    const project =
        await Project.findById(projectId)
            .populate(
                "owner",
                "name email college"
            );

    if (!project) {
        throw new Error(
            "Project not found"
        );
    }

    const user =
        await User.findById(userId)
            .select("-password");

    if (!user) {
        throw new Error(
            "User not found"
        );
    }

    const projectRequiredSkills = [
        ...(project.skillsRequired || [])
    ];

    const descriptionRequirements =
        extractRequirements(
            project.description || ""
        );

    const requirements =
        unique([
            ...projectRequiredSkills,
            ...descriptionRequirements
        ]);

    const technologies = [];

    const skillResult =
        calculateSkillFeasibility(
            user.skills || [],
            projectRequiredSkills.length > 0
                ? projectRequiredSkills
                : requirements
        );

    const technicalResult =
        calculateTechnicalFeasibility(
            project,
            requirements,
            technologies
        );

    const availableDays =
        userOverrides.availableDays ??
        user.availableDevelopmentDays ??
        0;

    const availableBudget =
        userOverrides.availableBudget ??
        user.availableBudget ??
        0;

    const currentTeamSize =
        userOverrides.currentTeamSize ??
        (
            Array.isArray(project.members)
                ? project.members.length
                : 1
        );

    const recommendedTeamSize =
        project.recommendedTeamSize ||
        (
            project.difficulty === "Advanced"
                ? 4
                : project.difficulty === "Intermediate"
                    ? 3
                    : 2
        );

    const estimatedDays =
        project.estimatedDuration ||
        project.estimatedDays ||
        30;

    const estimatedBudget =
        project.estimatedBudget ||
        0;

    const timeResult =
        calculateTimeFeasibility(
            estimatedDays,
            availableDays,
            currentTeamSize
        );

    const financialResult =
        calculateFinancialFeasibility(
            estimatedBudget,
            availableBudget
        );

    const dataResult =
        calculateDataFeasibility(
            requirements,
            project.description || ""
        );

    const resourceResult =
        calculateResourceFeasibility(
            requirements,
            technologies,
            project.difficulty
        );

    const teamResult =
        calculateTeamFeasibility(
            projectRequiredSkills,
            user.skills || [],
            currentTeamSize,
            recommendedTeamSize
        );

    const scalabilityResult =
        calculateScalabilityFeasibility(
            requirements,
            project.description || ""
        );

    const commercialResult =
        calculateCommercialFeasibility(
            project,
            project.description || ""
        );

    const overallScore =
        calculateOverallScore({
            technical:
                technicalResult.score,

            skill:
                skillResult.score,

            time:
                timeResult.score,

            financial:
                financialResult.score,

            data:
                dataResult.score,

            resource:
                resourceResult.score,

            team:
                teamResult.score,

            scalability:
                scalabilityResult.score,

            commercial:
                commercialResult.score
        });

    const classification =
        getClassification(
            overallScore
        );

    const majorRisks = [
        ...technicalResult.risks.map(
            (risk) => ({
                risk,
                severity: "Medium",
                impact:
                    "May increase project effort or implementation difficulty.",
                mitigation:
                    "Reduce scope, improve planning, or add required expertise."
            })
        ),

        ...timeResult.risks.map(
            (risk) => ({
                risk,
                severity: "High",
                impact:
                    "The team may not complete the project within the available time.",
                mitigation:
                    "Reduce scope or increase development capacity."
            })
        ),

        ...financialResult.risks.map(
            (risk) => ({
                risk,
                severity: "Medium",
                impact:
                    "Project expenses may exceed available resources.",
                mitigation:
                    "Reduce paid dependencies and prioritize the MVP."
            })
        ),

        ...dataResult.risks.map(
            (risk) => ({
                risk,
                severity: "Medium",
                impact:
                    "Data limitations may affect implementation quality.",
                mitigation:
                    "Validate data sources and privacy requirements early."
            })
        ),

        ...teamResult.teamGaps.map(
            (gap) => ({
                risk: gap,
                severity: "High",
                impact:
                    "Missing skills or insufficient team capacity may delay development.",
                mitigation:
                    "Add complementary teammates or reduce scope."
            })
        )
    ];

    const finalRecommendation =
        getRecommendation(
            overallScore,
            skillResult.skillGaps,
            majorRisks
        );

    const mvpRecommendation =
        buildMvpRecommendation(
            requirements,
            overallScore
        );

    const personalizedRecommendations = [];

    if (
        skillResult.skillGaps.length > 0
    ) {
        personalizedRecommendations.push(
            `Your current profile is missing: ${skillResult.skillGaps.join(", ")}.`
        );
    }

    if (
        availableDays > 0 &&
        timeResult.score < 75
    ) {
        personalizedRecommendations.push(
            "Your available development time is tight for the current scope."
        );
    }

    if (
        availableBudget > 0 &&
        financialResult.score < 75
    ) {
        personalizedRecommendations.push(
            "Your available budget is below the estimated project requirement."
        );
    }

    if (
        teamResult.score >= 75
    ) {
        personalizedRecommendations.push(
            "Your current team structure is reasonably aligned with the project."
        );
    }

    if (
        personalizedRecommendations.length === 0
    ) {
        personalizedRecommendations.push(
            "Your current profile appears reasonably aligned with the project's requirements."
        );
    }

    return {
        projectTitle: project.title,

        overallFeasibility: {
            score: overallScore,
            classification,
            recommendation:
                finalRecommendation,
            reason:
                overallScore >= 75
                    ? "The project appears achievable with the current profile and reasonable planning."
                    : "The current scope contains important gaps that should be addressed before full development."
        },

        technicalFeasibility:
            technicalResult,

        skillFeasibility:
            skillResult,

        timeFeasibility:
            timeResult,

        financialFeasibility:
            financialResult,

        dataFeasibility:
            dataResult,

        resourceFeasibility:
            resourceResult,

        teamFeasibility:
            teamResult,

        scalabilityFeasibility:
            scalabilityResult,

        commercialFeasibility:
            commercialResult,

        skillGaps:
            skillResult.skillGaps,

        majorRisks,

        mvpRecommendation,

        personalizedRecommendations,

        context: {
            user: {
                id: user._id,
                name: user.name,
                experienceLevel:
                    user.experienceLevel,
                skills:
                    user.skills || [],
                interests:
                    user.interests || []
            },

            project: {
                id: project._id,
                title: project.title,
                difficulty:
                    project.difficulty,
                category:
                    project.category
            },

            estimatedDays,

            estimatedBudget,

            availableDays,

            availableBudget,

            currentTeamSize,

            recommendedTeamSize
        }
    };
};

module.exports = {
    analyzeFeasibility,
    extractRequirements
};