const { analyzeFeasibility } = require("../services/feasibilityService");

const FeasibilityAnalysis = require("../models/FeasibilityAnalysis");


/* =====================================================
   ANALYZE FEASIBILITY
===================================================== */

const createFeasibilityAnalysis = async (req, res) => {
    try {
        const {
            projectId
        } = req.body;

        if (!projectId) {
            return res.status(400).json({
                message: "projectId is required"
            });
        }

        const analysis =
            await analyzeFeasibility(
                req.userId,
                projectId
            );

        res.status(200).json({
            message:
                "Feasibility analysis completed successfully 🤖",

            analysis
        });

    } catch (error) {

        console.error(
            "Feasibility analysis error:",
            error
        );

        res.status(500).json({
            message:
                "Feasibility analysis failed",

            error:
                error.message
        });
    }
};


/* =====================================================
   SAVE FEASIBILITY
===================================================== */

const saveFeasibilityAnalysis = async (req, res) => {
    try {

        const {
            projectId
        } = req.body;

        if (!projectId) {
            return res.status(400).json({
                message: "projectId is required"
            });
        }


        /* Run AI analysis */

        const analysis =
            await analyzeFeasibility(
                req.userId,
                projectId
            );


        /* Save result */

        const savedAnalysis =
            await FeasibilityAnalysis.create({

                userId:
                    req.userId,

                projectId:

                    projectId,

                projectTitle:
                    analysis.projectTitle ||
                    "Untitled Project",

                overallFeasibility:
                    analysis.overallFeasibility,

                technicalFeasibility:
                    analysis.technicalFeasibility,

                skillFeasibility:
                    analysis.skillFeasibility,

                timeFeasibility:
                    analysis.timeFeasibility,

                financialFeasibility:
                    analysis.financialFeasibility,

                dataFeasibility:
                    analysis.dataFeasibility,

                resourceFeasibility:
                    analysis.resourceFeasibility,

                teamFeasibility:
                    analysis.teamFeasibility,

                scalabilityFeasibility:
                    analysis.scalabilityFeasibility,

                commercialFeasibility:
                    analysis.commercialFeasibility,

                skillGaps:
                    analysis.skillGaps || [],

                majorRisks:
                    analysis.majorRisks || [],

                mvpRecommendation:
                    analysis.mvpRecommendation || {
                        mvpFeatures: [],
                        futureFeatures: []
                    },

                personalizedRecommendations:
                    analysis.personalizedRecommendations || []
            });


        res.status(201).json({

            message:
                "Analysis saved successfully ✅",

            analysisId:
                savedAnalysis._id,

            analysis
        });


    } catch (error) {

        console.error(
            "Save feasibility error:",
            error
        );

        res.status(500).json({

            message:
                "Failed to save analysis",

            error:
                error.message
        });
    }
};


/* =====================================================
   GET ALL ANALYSES
===================================================== */

const getFeasibilityAnalyses = async (req, res) => {

    try {

        const analyses =
            await FeasibilityAnalysis.find({
                userId:
                    req.userId
            })
            .sort({
                createdAt: -1
            })
            .select("-__v");


        res.status(200).json({
            analyses
        });


    } catch (error) {

        console.error(
            "Get analyses error:",
            error
        );

        res.status(500).json({

            message:
                "Failed to fetch analyses",

            error:
                error.message
        });
    }
};


/* =====================================================
   GET SINGLE ANALYSIS
===================================================== */

const getFeasibilityAnalysisById =
    async (req, res) => {

        try {

            const analysis =
                await FeasibilityAnalysis.findOne({

                    _id:
                        req.params.id,

                    userId:
                        req.userId

                })
                .select("-__v");


            if (!analysis) {

                return res.status(404).json({

                    message:
                        "Analysis not found"
                });
            }


            res.status(200).json({
                analysis
            });


        } catch (error) {

            console.error(
                "Get single analysis error:",
                error
            );

            res.status(500).json({

                message:
                    "Failed to fetch analysis",

                error:
                    error.message
            });
        }
    };


/* =====================================================
   DELETE ANALYSIS
===================================================== */

const deleteFeasibilityAnalysis =
    async (req, res) => {

        try {

            const deleted =
                await FeasibilityAnalysis.findOneAndDelete({

                    _id:
                        req.params.id,

                    userId:
                        req.userId
                });


            if (!deleted) {

                return res.status(404).json({

                    message:
                        "Analysis not found"
                });
            }


            res.status(200).json({

                message:
                    "Analysis deleted successfully ✅"
            });


        } catch (error) {

            console.error(
                "Delete analysis error:",
                error
            );

            res.status(500).json({

                message:
                    "Failed to delete analysis",

                error:
                    error.message
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