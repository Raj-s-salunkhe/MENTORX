const { GoogleGenAI } = require("@google/genai");

if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is missing from .env");
}

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

// Your API error specifically says to use this model.
const MODEL_NAME = "gemini-3.6-flash";

/* =========================================================
   STRUCTURED OUTPUT SCHEMA
========================================================= */

const projectAnalysisSchema = {
    type: "object",

    properties: {
        projectSummary: {
            type: "string"
        },

        extractedRequirements: {
            type: "array",
            items: {
                type: "string"
            }
        },

        technologies: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    name: {
                        type: "string"
                    },
                    purpose: {
                        type: "string"
                    }
                },
                required: [
                    "name",
                    "purpose"
                ]
            }
        },

        requiredSkills: {
            type: "array",
            items: {
                type: "string"
            }
        },

        roadmap: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    phase: {
                        type: "string"
                    },
                    duration: {
                        type: "string"
                    },
                    tasks: {
                        type: "array",
                        items: {
                            type: "string"
                        }
                    }
                },
                required: [
                    "phase",
                    "duration",
                    "tasks"
                ]
            }
        },

        estimatedDays: {
            type: "integer"
        },

        estimatedBudget: {
            type: "number"
        },

        complexity: {
            type: "string"
        },

        suggestions: {
            type: "array",
            items: {
                type: "string"
            }
        }
    },

    required: [
        "projectSummary",
        "extractedRequirements",
        "technologies",
        "requiredSkills",
        "roadmap",
        "estimatedDays",
        "estimatedBudget",
        "complexity",
        "suggestions"
    ]
};

/* =========================================================
   MAIN PROJECT ANALYSIS
========================================================= */

const analyzeProject = async (
    title,
    description,
    category = "General",
    difficulty = "Beginner"
) => {
    const prompt = `
You are MENTORX, an expert software project mentor.

Analyze the following student project carefully.

PROJECT TITLE:
${title}

PROJECT DESCRIPTION:
${description}

CATEGORY:
${category}

DIFFICULTY:
${difficulty}

Your responsibilities:

1. Understand the real purpose of the project.
2. Extract the actual functional requirements.
3. Recommend technologies that fit the project.
4. Identify the skills required.
5. Build a realistic development roadmap.
6. Estimate development time.
7. Estimate approximate development cost.
8. Determine project complexity.
9. Give practical suggestions.

IMPORTANT ESTIMATION RULES:

- Do NOT give the same estimated days to every project.
- Do NOT give the same budget to every project.
- Estimate based on the actual scope and features.
- A simple portfolio should be much smaller than a complex AI platform.
- Consider authentication, database, APIs, dashboards, AI/ML,
  payments, mobile apps, notifications, real-time features,
  integrations, search, security, and other features ONLY when
  the project actually requires them.
- More features should generally increase effort.
- Advanced architecture should generally increase effort.
- Estimate for a realistic student/team implementation.
- Timeline is approximate, not guaranteed.
- Budget is approximate, not an exact quotation.
- Do not invent unnecessary requirements.
`;

    try {
        const response =
            await ai.models.generateContent({
                model: MODEL_NAME,

                contents: prompt,

                config: {
                    responseMimeType:
                        "application/json",

                    responseSchema:
                        projectAnalysisSchema
                }
            });

        if (!response) {
            throw new Error(
                "Gemini returned no response"
            );
        }

        const text =
            typeof response.text === "function"
                ? response.text()
                : response.text;

        if (!text) {
            throw new Error(
                "Gemini returned empty text"
            );
        }

        let result;

        try {
            result = JSON.parse(text);
        } catch (parseError) {
            console.error(
                "Gemini JSON parsing failed:",
                text
            );

            throw new Error(
                "Gemini returned invalid JSON"
            );
        }

        // Basic safety/default normalization
        return {
            projectSummary:
                result.projectSummary || "",

            extractedRequirements:
                Array.isArray(
                    result.extractedRequirements
                )
                    ? result.extractedRequirements
                    : [],

            technologies:
                Array.isArray(
                    result.technologies
                )
                    ? result.technologies
                    : [],

            requiredSkills:
                Array.isArray(
                    result.requiredSkills
                )
                    ? result.requiredSkills
                    : [],

            roadmap:
                Array.isArray(
                    result.roadmap
                )
                    ? result.roadmap
                    : [],

            estimatedDays:
                Number(
                    result.estimatedDays
                ) || 0,

            estimatedBudget:
                Number(
                    result.estimatedBudget
                ) || 0,

            complexity:
                result.complexity ||
                "Unknown",

            suggestions:
                Array.isArray(
                    result.suggestions
                )
                    ? result.suggestions
                    : []
        };

    } catch (error) {
        console.error(
            "Gemini project analysis error:",
            error
        );

        throw new Error(
            error.message ||
            "Gemini analysis failed"
        );
    }
};

/* =========================================================
   TECHNOLOGY RECOMMENDATIONS
========================================================= */

const getTechnologyRecommendations = async (
    category = "General"
) => {
    const prompt = `
You are a software architect.

Recommend a practical technology stack for:

Category:
${category}

Give recommendations suitable for a student project.

Include:
- Frontend
- Backend
- Database
- Important libraries/services

Do not over-engineer the solution.
`;

    const response =
        await ai.models.generateContent({
            model: MODEL_NAME,
            contents: prompt
        });

    const text =
        typeof response.text === "function"
            ? response.text()
            : response.text;

    return text || "";
};

/* =========================================================
   REQUIREMENT EXTRACTION
========================================================= */

const extractRequirements = async (
    description = ""
) => {
    const prompt = `
Extract the most important functional and technical
requirements from this project description:

${description}

Return a concise list.
`;

    const response =
        await ai.models.generateContent({
            model: MODEL_NAME,
            contents: prompt
        });

    const text =
        typeof response.text === "function"
            ? response.text()
            : response.text;

    return text || "";
};

/* =========================================================
   COMPATIBILITY FUNCTION
========================================================= */

const calculateProjectEstimate = () => {
    throw new Error(
        "Project estimates are now generated by Gemini AI."
    );
};

module.exports = {
    analyzeProject,
    getTechnologyRecommendations,
    extractRequirements,
    calculateProjectEstimate
};