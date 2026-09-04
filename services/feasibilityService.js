const { GoogleGenAI } = require("@google/genai");

const Project = require("../models/Project");
const User = require("../models/User");

if (!process.env.GEMINI_API_KEY) {
    throw new Error(
        "GEMINI_API_KEY is missing from .env"
    );
}

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

/*
|--------------------------------------------------------------------------
| Gemini model
|--------------------------------------------------------------------------
| Use the model that is available to your Gemini account.
*/
const MODEL_NAME = "gemini-3.6-flash";

/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

const cleanArray = (items) => {
    if (!Array.isArray(items)) {
        return [];
    }

    return items
        .filter(Boolean)
        .map((item) => String(item).trim())
        .filter(Boolean);
};

const clampScore = (value) => {
    const number = Number(value);

    if (Number.isNaN(number)) {
        return 0;
    }

    return Math.max(
        0,
        Math.min(100, Math.round(number))
    );
};

const classificationFromScore = (score) => {
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

const normalizeProjectRequirements = (project) => {
    return cleanArray([
        ...(project.skillsRequired || []),
        ...(project.keyFeatures || [])
    ]);
};

const buildProjectContext = (project) => {
    return {
        title: project.title || "",
        description: project.description || "",
        domain: project.domain || "",
        projectType: project.projectType || "",
        problemStatement:
            project.problemStatement || "",
        objectives: cleanArray(project.objectives),
        keyFeatures: cleanArray(project.keyFeatures),
        category: project.category || "General",
        skillsRequired: cleanArray(
            project.skillsRequired
        ),
        recommendedTechnologies: cleanArray(
            project.recommendedTechnologies
        ),
        estimatedDays:
            Number(project.estimatedDays) || 0,
        estimatedBudget:
            Number(project.estimatedBudget) || 0,
        recommendedTeamSize:
            Number(project.recommendedTeamSize) || 1,
        difficulty:
            project.difficulty || "Beginner",
        status:
            project.status || "Open"
    };
};

const buildUserContext = (user) => {
    return {
        name: user.name || "",
        experienceLevel:
            user.experienceLevel || "Beginner",
        college:
            user.college || "",
        bio:
            user.bio || "",
        skills: cleanArray(user.skills),
        interests: cleanArray(user.interests),
        preferredTechnologies:
            cleanArray(
                user.preferredTechnologies
            ),
        previousProjects:
            Array.isArray(user.previousProjects)
                ? user.previousProjects.map(
                    (project) => ({
                        title:
                            project.title || "",
                        description:
                            project.description || "",
                        technologies:
                            cleanArray(
                                project.technologies
                            ),
                        role:
                            project.role || ""
                    })
                )
                : [],
        currentTeamSize:
            Number(
                user.currentTeamSize
            ) || 1,
        availableDevelopmentDays:
            Number(
                user.availableDevelopmentDays
            ) || 0,
        availableBudget:
            Number(user.availableBudget) || 0,
        availability:
            user.availability || "Available"
    };
};

/*
|--------------------------------------------------------------------------
| Structured Gemini schema
|--------------------------------------------------------------------------
*/

const feasibilitySchema = {
    type: "object",

    properties: {
        overallFeasibility: {
            type: "object",
            properties: {
                score: {
                    type: "integer"
                },

                classification: {
                    type: "string"
                },

                recommendation: {
                    type: "string"
                },

                reason: {
                    type: "string"
                }
            },

            required: [
                "score",
                "classification",
                "recommendation",
                "reason"
            ]
        },

        technicalFeasibility: {
            type: "object",
            properties: {
                score: {
                    type: "integer"
                },

                analysis: {
                    type: "string"
                },

                strengths: {
                    type: "array",
                    items: {
                        type: "string"
                    }
                },

                risks: {
                    type: "array",
                    items: {
                        type: "string"
                    }
                },

                recommendations: {
                    type: "array",
                    items: {
                        type: "string"
                    }
                }
            },

            required: [
                "score",
                "analysis",
                "strengths",
                "risks",
                "recommendations"
            ]
        },

        skillFeasibility: {
            type: "object",
            properties: {
                score: {
                    type: "integer"
                },

                analysis: {
                    type: "string"
                },

                skillMatches: {
                    type: "array",
                    items: {
                        type: "string"
                    }
                },

                skillGaps: {
                    type: "array",
                    items: {
                        type: "string"
                    }
                },

                recommendations: {
                    type: "array",
                    items: {
                        type: "string"
                    }
                }
            },

            required: [
                "score",
                "analysis",
                "skillMatches",
                "skillGaps",
                "recommendations"
            ]
        },

        timeFeasibility: {
            type: "object",
            properties: {
                score: {
                    type: "integer"
                },

                analysis: {
                    type: "string"
                },

                estimatedEffort: {
                    type: "string"
                },

                risks: {
                    type: "array",
                    items: {
                        type: "string"
                    }
                },

                recommendations: {
                    type: "array",
                    items: {
                        type: "string"
                    }
                }
            },

            required: [
                "score",
                "analysis",
                "estimatedEffort",
                "risks",
                "recommendations"
            ]
        },

        financialFeasibility: {
            type: "object",
            properties: {
                score: {
                    type: "integer"
                },

                analysis: {
                    type: "string"
                },

                estimatedCostRange: {
                    type: "string"
                },

                risks: {
                    type: "array",
                    items: {
                        type: "string"
                    }
                },

                recommendations: {
                    type: "array",
                    items: {
                        type: "string"
                    }
                }
            },

            required: [
                "score",
                "analysis",
                "estimatedCostRange",
                "risks",
                "recommendations"
            ]
        },

        dataFeasibility: {
            type: "object",
            properties: {
                score: {
                    type: "integer"
                },

                analysis: {
                    type: "string"
                },

                requiredData: {
                    type: "array",
                    items: {
                        type: "string"
                    }
                },

                risks: {
                    type: "array",
                    items: {
                        type: "string"
                    }
                },

                recommendations: {
                    type: "array",
                    items: {
                        type: "string"
                    }
                }
            },

            required: [
                "score",
                "analysis",
                "requiredData",
                "risks",
                "recommendations"
            ]
        },

        resourceFeasibility: {
            type: "object",
            properties: {
                score: {
                    type: "integer"
                },

                analysis: {
                    type: "string"
                },

                requiredResources: {
                    type: "array",
                    items: {
                        type: "string"
                    }
                },

                risks: {
                    type: "array",
                    items: {
                        type: "string"
                    }
                },

                recommendations: {
                    type: "array",
                    items: {
                        type: "string"
                    }
                }
            },

            required: [
                "score",
                "analysis",
                "requiredResources",
                "risks",
                "recommendations"
            ]
        },

        teamFeasibility: {
            type: "object",
            properties: {
                score: {
                    type: "integer"
                },

                analysis: {
                    type: "string"
                },

                teamStrengths: {
                    type: "array",
                    items: {
                        type: "string"
                    }
                },

                teamGaps: {
                    type: "array",
                    items: {
                        type: "string"
                    }
                },

                recommendations: {
                    type: "array",
                    items: {
                        type: "string"
                    }
                }
            },

            required: [
                "score",
                "analysis",
                "teamStrengths",
                "teamGaps",
                "recommendations"
            ]
        },

        scalabilityFeasibility: {
            type: "object",
            properties: {
                score: {
                    type: "integer"
                },

                analysis: {
                    type: "string"
                },

                risks: {
                    type: "array",
                    items: {
                        type: "string"
                    }
                },

                recommendations: {
                    type: "array",
                    items: {
                        type: "string"
                    }
                }
            },

            required: [
                "score",
                "analysis",
                "risks",
                "recommendations"
            ]
        },

        commercialFeasibility: {
            type: "object",
            properties: {
                score: {
                    type: "integer"
                },

                analysis: {
                    type: "string"
                },

                commercialOpportunities: {
                    type: "array",
                    items: {
                        type: "string"
                    }
                },

                risks: {
                    type: "array",
                    items: {
                        type: "string"
                    }
                },

                recommendations: {
                    type: "array",
                    items: {
                        type: "string"
                    }
                }
            },

            required: [
                "score",
                "analysis",
                "commercialOpportunities",
                "risks",
                "recommendations"
            ]
        },

        skillGaps: {
            type: "array",
            items: {
                type: "string"
            }
        },

        majorRisks: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    risk: {
                        type: "string"
                    },

                    severity: {
                        type: "string"
                    },

                    impact: {
                        type: "string"
                    },

                    mitigation: {
                        type: "string"
                    }
                },

                required: [
                    "risk",
                    "severity",
                    "impact",
                    "mitigation"
                ]
            }
        },

        mvpRecommendation: {
            type: "object",
            properties: {
                mvpFeatures: {
                    type: "array",
                    items: {
                        type: "string"
                    }
                },

                futureFeatures: {
                    type: "array",
                    items: {
                        type: "string"
                    }
                }
            },

            required: [
                "mvpFeatures",
                "futureFeatures"
            ]
        },

        personalizedRecommendations: {
            type: "array",
            items: {
                type: "string"
            }
        }
    },

    required: [
        "overallFeasibility",
        "technicalFeasibility",
        "skillFeasibility",
        "timeFeasibility",
        "financialFeasibility",
        "dataFeasibility",
        "resourceFeasibility",
        "teamFeasibility",
        "scalabilityFeasibility",
        "commercialFeasibility",
        "skillGaps",
        "majorRisks",
        "mvpRecommendation",
        "personalizedRecommendations"
    ]
};

/*
|--------------------------------------------------------------------------
| Main Gemini Feasibility Analysis
|--------------------------------------------------------------------------
*/

const analyzeFeasibility = async (
    userId,
    projectId,
    userOverrides = {}
) => {
    const project = await Project.findById(
        projectId
    )
        .populate(
            "owner",
            "name email college"
        )
        .populate(
            "members",
            "name email college skills interests experienceLevel preferredTechnologies previousProjects"
        );

    if (!project) {
        throw new Error(
            "Project not found"
        );
    }

    const user = await User.findById(
        userId
    ).select("-password");

    if (!user) {
        throw new Error(
            "User not found"
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Build context
    |--------------------------------------------------------------------------
    */

    const projectContext =
        buildProjectContext(project);

    const userContext =
        buildUserContext(user);

    const teamMembers =
        Array.isArray(project.members)
            ? project.members.map(
                (member) => ({
                    name:
                        member.name || "",

                    experienceLevel:
                        member.experienceLevel ||
                        "Beginner",

                    skills:
                        cleanArray(
                            member.skills
                        ),

                    interests:
                        cleanArray(
                            member.interests
                        ),

                    preferredTechnologies:
                        cleanArray(
                            member.preferredTechnologies
                        )
                })
            )
            : [];

    const availableDays =
        Number(
            userOverrides.availableDays ??
            user.availableDevelopmentDays ??
            0
        );

    const availableBudget =
        Number(
            userOverrides.availableBudget ??
            user.availableBudget ??
            0
        );

    const currentTeamSize =
        Number(
            userOverrides.currentTeamSize ??
            user.currentTeamSize ??
            Math.max(
                1,
                teamMembers.length
            )
        );

    /*
    |--------------------------------------------------------------------------
    | Gemini prompt
    |--------------------------------------------------------------------------
    */

    const prompt = `
You are MENTORX, an expert software project feasibility advisor.

Your job is to determine whether THIS USER or TEAM can realistically
build THIS PROJECT.

Do NOT just analyze the project in isolation.

You must compare:

USER CAPABILITIES
against
PROJECT REQUIREMENTS

Consider:

- Technical skills
- Experience level
- Preferred technologies
- Previous project experience
- Team size
- Team skill coverage
- Available development time
- Available budget
- Project complexity
- Technology requirements
- Data requirements
- Infrastructure/resources
- Scalability
- Commercial/industry potential

==================================================
USER PROFILE
==================================================

${JSON.stringify(
    userContext,
    null,
    2
)}

==================================================
PROJECT
==================================================

${JSON.stringify(
    projectContext,
    null,
    2
)}

==================================================
CURRENT TEAM
==================================================

${JSON.stringify(
    teamMembers,
    null,
    2
)}

==================================================
CURRENT RESOURCE INPUT
==================================================

Available development days:
${availableDays}

Available budget:
₹${availableBudget}

Current team size:
${currentTeamSize}

==================================================
IMPORTANT
==================================================

Generate a realistic personalized feasibility assessment.

Do NOT give the same score to every project.

Do NOT give the same score to every user.

A user with strong matching skills and previous experience should
generally score higher than a beginner with no relevant experience.

A project with many features should generally be more difficult
than a simple project.

Consider the actual project description, objectives, features,
skills, technologies and constraints.

TIMELINE:
Estimate realistic development effort for the stated scope.

BUDGET:
Estimate approximate project cost in Indian Rupees.
This is an estimate, NOT a guaranteed quotation.

SKILLS:
Explicitly identify matching skills and missing skills.

TEAM:
Consider whether the current team size and skill mix are adequate.

MVP:
Suggest the smallest useful version that could reasonably be completed.

RISKS:
Identify practical risks and explain mitigation.

FINAL RECOMMENDATION:
Use one of:

- Proceed
- Proceed with Modifications
- Reduce Project Scope
- Not Recommended

OVERALL CLASSIFICATION:
Use:

90-100 = Highly Feasible
75-89 = Feasible
60-74 = Moderately Feasible
40-59 = Difficult
0-39 = Not Feasible

Return ONLY valid JSON matching the required schema.
`;

    /*
    |--------------------------------------------------------------------------
    | Call Gemini
    |--------------------------------------------------------------------------
    */

    const response =
        await ai.models.generateContent({
            model: MODEL_NAME,

            contents: prompt,

            config: {
                responseMimeType:
                    "application/json",

                responseSchema:
                    feasibilitySchema,

                temperature: 0.2
            }
        });

    const text =
        typeof response.text === "function"
            ? response.text()
            : response.text;

    if (!text) {
        throw new Error(
            "Gemini returned an empty feasibility response"
        );
    }

    let result;

    try {
        result = JSON.parse(text);
    } catch (error) {
        console.error(
            "Gemini feasibility JSON:",
            text
        );

        throw new Error(
            "Gemini returned invalid feasibility JSON"
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Normalize Gemini result
    |--------------------------------------------------------------------------
    */

    const overallScore =
        clampScore(
            result
                ?.overallFeasibility
                ?.score
        );

    const skillScore =
        clampScore(
            result
                ?.skillFeasibility
                ?.score
        );

    const technicalScore =
        clampScore(
            result
                ?.technicalFeasibility
                ?.score
        );

    const timeScore =
        clampScore(
            result
                ?.timeFeasibility
                ?.score
        );

    const financialScore =
        clampScore(
            result
                ?.financialFeasibility
                ?.score
        );

    const dataScore =
        clampScore(
            result
                ?.dataFeasibility
                ?.score
        );

    const resourceScore =
        clampScore(
            result
                ?.resourceFeasibility
                ?.score
        );

    const teamScore =
        clampScore(
            result
                ?.teamFeasibility
                ?.score
        );

    const scalabilityScore =
        clampScore(
            result
                ?.scalabilityFeasibility
                ?.score
        );

    const commercialScore =
        clampScore(
            result
                ?.commercialFeasibility
                ?.score
        );

    /*
    |--------------------------------------------------------------------------
    | Keep score internally consistent
    |--------------------------------------------------------------------------
    */

    const calculatedOverallScore =
        Math.round(
            technicalScore * 0.15 +
            skillScore * 0.15 +
            timeScore * 0.15 +
            financialScore * 0.12 +
            dataScore * 0.08 +
            resourceScore * 0.08 +
            teamScore * 0.12 +
            scalabilityScore * 0.08 +
            commercialScore * 0.07
        );

    const finalScore =
        overallScore > 0
            ? overallScore
            : calculatedOverallScore;

    const skillGaps =
        cleanArray(
            result.skillGaps
        );

    const finalClassification =
        classificationFromScore(
            finalScore
        );

    const recommendation =
        result
            ?.overallFeasibility
            ?.recommendation ||
        "Proceed with Modifications";

    const finalRecommendation =
        [
            "Proceed",
            "Proceed with Modifications",
            "Reduce Project Scope",
            "Not Recommended"
        ].includes(
            recommendation
        )
            ? recommendation
            : "Proceed with Modifications";

    /*
    |--------------------------------------------------------------------------
    | Personalized result
    |--------------------------------------------------------------------------
    */

    const personalizedRecommendations =
        cleanArray(
            result.personalizedRecommendations
        );

    return {
        projectTitle:
            project.title,

        overallFeasibility: {
            score: finalScore,

            classification:
                finalClassification,

            recommendation:
                finalRecommendation,

            reason:
                result
                    ?.overallFeasibility
                    ?.reason ||
                "Gemini analyzed the project against the current user profile."
        },

        technicalFeasibility: {
            score:
                technicalScore,

            analysis:
                result
                    ?.technicalFeasibility
                    ?.analysis ||
                "",

            strengths:
                cleanArray(
                    result
                        ?.technicalFeasibility
                        ?.strengths
                ),

            risks:
                cleanArray(
                    result
                        ?.technicalFeasibility
                        ?.risks
                ),

            recommendations:
                cleanArray(
                    result
                        ?.technicalFeasibility
                        ?.recommendations
                )
        },

        skillFeasibility: {
            score:
                skillScore,

            analysis:
                result
                    ?.skillFeasibility
                    ?.analysis ||
                "",

            skillMatches:
                cleanArray(
                    result
                        ?.skillFeasibility
                        ?.skillMatches
                ),

            skillGaps,

            recommendations:
                cleanArray(
                    result
                        ?.skillFeasibility
                        ?.recommendations
                )
        },

        timeFeasibility: {
            score:
                timeScore,

            analysis:
                result
                    ?.timeFeasibility
                    ?.analysis ||
                "",

            estimatedEffort:
                result
                    ?.timeFeasibility
                    ?.estimatedEffort ||
                `${projectContext.estimatedDays || 0} development days estimated.`,

            risks:
                cleanArray(
                    result
                        ?.timeFeasibility
                        ?.risks
                ),

            recommendations:
                cleanArray(
                    result
                        ?.timeFeasibility
                        ?.recommendations
                )
        },

        financialFeasibility: {
            score:
                financialScore,

            analysis:
                result
                    ?.financialFeasibility
                    ?.analysis ||
                "",

            estimatedCostRange:
                result
                    ?.financialFeasibility
                    ?.estimatedCostRange ||
                `Approximately ₹${projectContext.estimatedBudget.toLocaleString(
                    "en-IN"
                )}`,

            risks:
                cleanArray(
                    result
                        ?.financialFeasibility
                        ?.risks
                ),

            recommendations:
                cleanArray(
                    result
                        ?.financialFeasibility
                        ?.recommendations
                )
        },

        dataFeasibility: {
            score:
                dataScore,

            analysis:
                result
                    ?.dataFeasibility
                    ?.analysis ||
                "",

            requiredData:
                cleanArray(
                    result
                        ?.dataFeasibility
                        ?.requiredData
                ),

            risks:
                cleanArray(
                    result
                        ?.dataFeasibility
                        ?.risks
                ),

            recommendations:
                cleanArray(
                    result
                        ?.dataFeasibility
                        ?.recommendations
                )
        },

        resourceFeasibility: {
            score:
                resourceScore,

            analysis:
                result
                    ?.resourceFeasibility
                    ?.analysis ||
                "",

            requiredResources:
                cleanArray(
                    result
                        ?.resourceFeasibility
                        ?.requiredResources
                ),

            risks:
                cleanArray(
                    result
                        ?.resourceFeasibility
                        ?.risks
                ),

            recommendations:
                cleanArray(
                    result
                        ?.resourceFeasibility
                        ?.recommendations
                )
        },

        teamFeasibility: {
            score:
                teamScore,

            analysis:
                result
                    ?.teamFeasibility
                    ?.analysis ||
                "",

            teamStrengths:
                cleanArray(
                    result
                        ?.teamFeasibility
                        ?.teamStrengths
                ),

            teamGaps:
                cleanArray(
                    result
                        ?.teamFeasibility
                        ?.teamGaps
                ),

            recommendations:
                cleanArray(
                    result
                        ?.teamFeasibility
                        ?.recommendations
                )
        },

        scalabilityFeasibility: {
            score:
                scalabilityScore,

            analysis:
                result
                    ?.scalabilityFeasibility
                    ?.analysis ||
                "",

            risks:
                cleanArray(
                    result
                        ?.scalabilityFeasibility
                        ?.risks
                ),

            recommendations:
                cleanArray(
                    result
                        ?.scalabilityFeasibility
                        ?.recommendations
                )
        },

        commercialFeasibility: {
            score:
                commercialScore,

            analysis:
                result
                    ?.commercialFeasibility
                    ?.analysis ||
                "",

            commercialOpportunities:
                cleanArray(
                    result
                        ?.commercialFeasibility
                        ?.commercialOpportunities
                ),

            risks:
                cleanArray(
                    result
                        ?.commercialFeasibility
                        ?.risks
                ),

            recommendations:
                cleanArray(
                    result
                        ?.commercialFeasibility
                        ?.recommendations
                )
        },

        skillGaps,

        majorRisks:
            Array.isArray(
                result.majorRisks
            )
                ? result.majorRisks.map(
                    (risk) => ({
                        risk:
                            risk.risk ||
                            "Unspecified risk",

                        severity:
                            risk.severity ||
                            "Medium",

                        impact:
                            risk.impact ||
                            "May affect project execution.",

                        mitigation:
                            risk.mitigation ||
                            "Review the risk before implementation."
                    })
                )
                : [],

        mvpRecommendation: {
            mvpFeatures:
                cleanArray(
                    result
                        ?.mvpRecommendation
                        ?.mvpFeatures
                ),

            futureFeatures:
                cleanArray(
                    result
                        ?.mvpRecommendation
                        ?.futureFeatures
                )
        },

        personalizedRecommendations,

        context: {
            user: userContext,

            project: projectContext,

            team: teamMembers,

            estimatedDays:
                projectContext.estimatedDays,

            estimatedBudget:
                projectContext.estimatedBudget,

            availableDays,

            availableBudget,

            currentTeamSize,

            recommendedTeamSize:
                projectContext.recommendedTeamSize,

            calculatedOverallScore
        }
    };
};

module.exports = {
    analyzeFeasibility
};