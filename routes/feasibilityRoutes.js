const express = require("express");

const router = express.Router();

const {
    createFeasibilityAnalysis,
    saveFeasibilityAnalysis,
    getFeasibilityAnalyses,
    getFeasibilityAnalysisById,
    deleteFeasibilityAnalysis
} = require("../controllers/feasibilityController");

const protect = require("../middleware/authMiddleware");


/* Analyze feasibility */
router.post(
    "/analyze",
    protect,
    createFeasibilityAnalysis
);


/* Save feasibility analysis */
router.post(
    "/save",
    protect,
    saveFeasibilityAnalysis
);


/* Get all saved analyses */
router.get(
    "/",
    protect,
    getFeasibilityAnalyses
);


/* Get one saved analysis */
router.get(
    "/:id",
    protect,
    getFeasibilityAnalysisById
);


/* Delete analysis */
router.delete(
    "/:id",
    protect,
    deleteFeasibilityAnalysis
);


module.exports = router;