const {
    analyzeProject,
    getTechnologyRecommendations,
    extractRequirements
} = require("../services/aiService");

const analyzeProjectIdea = async (req, res) => {
    try {
        const {
            title,
            description,
            category,
            difficulty
        } = req.body;

        if (!title || !description) {
            return res.status(400).json({
                message: "Title and description are required"
            });
        }

        const analysis = await analyzeProject(
            title.trim(),
            description.trim(),
            category || "General",
            difficulty || "Beginner"
        );

        console.log(
            "Gemini analysis:",
            analysis
        );

        if (!analysis || typeof analysis !== "object") {
            return res.status(500).json({
                message: "Gemini returned an invalid analysis"
            });
        }

        return res.json({
            message: "Project analyzed successfully 🤖",
            analysis
        });

    } catch (error) {
        console.error(
            "AI analysis error:",
            error
        );

        return res.status(500).json({
            message: "AI analysis failed",
            error: error.message
        });
    }
};

const getTechnologies = async (req, res) => {
    try {
        const category =
            req.query.category || "General";

        const technologies =
            await getTechnologyRecommendations(
                category
            );

        return res.json({
            message:
                "Technology recommendations generated successfully",
            category,
            technologies
        });

    } catch (error) {
        console.error(
            "Technology recommendation error:",
            error
        );

        return res.status(500).json({
            message:
                "Failed to get technologies",
            error: error.message
        });
    }
};

const getRoadmap = async (req, res) => {
    try {
        const {
            title = "Student Project",
            description = "Software project",
            category = "General",
            difficulty = "Beginner"
        } = req.query;

        const analysis =
            await analyzeProject(
                title,
                description,
                category,
                difficulty
            );

        return res.json({
            message:
                "Project roadmap generated successfully",
            roadmap:
                analysis.roadmap || [],
            estimatedDays:
                analysis.estimatedDays || 0
        });

    } catch (error) {
        console.error(
            "Roadmap error:",
            error
        );

        return res.status(500).json({
            message:
                "Failed to generate roadmap",
            error: error.message
        });
    }
};

const getBudget = async (req, res) => {
    try {
        const {
            title = "Student Project",
            description = "Software project",
            category = "General",
            difficulty = "Beginner"
        } = req.query;

        const analysis =
            await analyzeProject(
                title,
                description,
                category,
                difficulty
            );

        return res.json({
            message:
                "Project budget estimated successfully 💰",
            estimatedDays:
                analysis.estimatedDays || 0,
            estimatedBudget:
                analysis.estimatedBudget || 0,
            complexity:
                analysis.complexity || "Unknown"
        });

    } catch (error) {
        console.error(
            "Budget error:",
            error
        );

        return res.status(500).json({
            message:
                "Failed to estimate budget",
            error: error.message
        });
    }
};

module.exports = {
    analyzeProjectIdea,
    getTechnologies,
    getRoadmap,
    getBudget
};