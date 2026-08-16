const {
    analyzeProject,
    getTechnologyRecommendations
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

        const analysis = analyzeProject(
            title,
            description,
            category || "General",
            difficulty || "Beginner"
        );

        res.json({
            message: "Project analyzed successfully 🤖",
            analysis
        });

    } catch (error) {
        res.status(500).json({
            message: "Project analysis failed",
            error: error.message
        });
    }
};

const getTechnologies = async (req, res) => {
    try {
        const { category } = req.query;

        const technologies = getTechnologyRecommendations(
            category || "General"
        );

        res.json({
            message: "Technology recommendations generated successfully",
            category: category || "General",
            technologies
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to get technologies",
            error: error.message
        });
    }
};

const getRoadmap = async (req, res) => {
    try {
        const {
            category,
            difficulty
        } = req.query;

        const analysis = analyzeProject(
            "Project",
            "Project roadmap generation",
            category || "General",
            difficulty || "Beginner"
        );

        res.json({
            message: "Project roadmap generated successfully",
            category: category || "General",
            difficulty: difficulty || "Beginner",
            roadmap: analysis.roadmap,
            estimatedDays: analysis.estimatedDays
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to generate roadmap",
            error: error.message
        });
    }
};

const getBudget = async (req, res) => {
    try {
        const { difficulty } = req.query;

        const analysis = analyzeProject(
            "Project",
            "Project budget estimation",
            "General",
            difficulty || "Beginner"
        );

        res.json({
            message: "Project budget estimated successfully 💰",
            difficulty: difficulty || "Beginner",
            estimatedDays: analysis.estimatedDays,
            estimatedBudget: analysis.estimatedBudget
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to estimate budget",
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