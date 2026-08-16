const { analyzeFeasibility } = require("../services/feasibilityService");
const FeasibilityAnalysis = require("../models/FeasibilityAnalysis");

const createFeasibilityAnalysis = async (req, res) => {
    try {
        const { projectId, save = false, ...userOverrides } = req.body;

        if (!projectId) {
            return res.status(400).json({
                message: "projectId is required"
            });
        }

        const analysis = await analyzeFeasibility(
            req.userId,
            projectId,
            userOverrides
        );

        let savedAnalysis = null;

        if (save) {
            savedAnalysis = await FeasibilityAnalysis.create({
                userId: req.userId,
                projectId,
                projectTitle: analysis.projectTitle,
                ...analysis
            });
        }

        res.json({
            message: "Project feasibility analyzed successfully 🤖",
            saved: Boolean(savedAnalysis),
            analysis,
            analysisId: savedAnalysis?._id || null
        });

    } catch (error) {
        console.error("Feasibility analysis error:", error);

        res.status(500).json({
            message: "Feasibility analysis failed",
            error: error.message
        });
    }
};

const saveFeasibilityAnalysis = async (req, res) => {
    try {
        const { projectId, ...userOverrides } = req.body;

        if (!projectId) {
            return res.status(400).json({
                message: "projectId is required"
            });
        }

        const analysis = await analyzeFeasibility(
            req.userId,
            projectId,
            userOverrides
        );

        const saved = await FeasibilityAnalysis.create({
            userId: req.userId,
            projectId,
            projectTitle: analysis.projectTitle,
            ...analysis
        });

        res.status(201).json({
            message: "Feasibility analysis saved successfully ✅",
            analysisId: saved._id,
            analysis
        });

    } catch (error) {
        console.error("Save feasibility error:", error);

        res.status(500).json({
            message: "Failed to save feasibility analysis",
            error: error.message
        });
    }
};

const getFeasibilityAnalyses = async (req, res) => {
    try {
        const analyses = await FeasibilityAnalysis.find({
            userId: req.userId
        })
            .sort({ createdAt: -1 })
            .select("-__v");

        res.json({
            message: "Feasibility analyses loaded successfully",
            count: analyses.length,
            analyses
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to load feasibility analyses",
            error: error.message
        });
    }
};

const getFeasibilityAnalysisById = async (req, res) => {
    try {
        const analysis = await FeasibilityAnalysis.findOne({
            _id: req.params.id,
            userId: req.userId
        }).select("-__v");

        if (!analysis) {
            return res.status(404).json({
                message: "Feasibility analysis not found"
            });
        }

        res.json({
            message: "Feasibility analysis loaded successfully",
            analysis
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to load feasibility analysis",
            error: error.message
        });
    }
};

const deleteFeasibilityAnalysis = async (req, res) => {
    try {
        const analysis = await FeasibilityAnalysis.findOneAndDelete({
            _id: req.params.id,
            userId: req.userId
        });

        if (!analysis) {
            return res.status(404).json({
                message: "Feasibility analysis not found"
            });
        }

        res.json({
            message: "Feasibility analysis deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to delete feasibility analysis",
            error: error.message
        });
    }
};

module.exports = {
    createFeasibilityAnalysis,
    saveFeasibilityAnalysis,
    getFeasibilityAnalyses,
    getFeasibilityAnalysisById,
    deleteFeasibilityAnalysis
};