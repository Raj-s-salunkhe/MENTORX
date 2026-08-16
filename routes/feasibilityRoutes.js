const express = require("express");

const {
    createFeasibilityAnalysis,
    saveFeasibilityAnalysis,
    getFeasibilityAnalyses,
    getFeasibilityAnalysisById,
    deleteFeasibilityAnalysis
} = require("../controllers/feasibilityController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
    "/analyze",
    protect,
    createFeasibilityAnalysis
);

router.post(
    "/save",
    protect,
    saveFeasibilityAnalysis
);

router.get(
    "/",
    protect,
    getFeasibilityAnalyses
);

router.get(
    "/:id",
    protect,
    getFeasibilityAnalysisById
);

router.delete(
    "/:id",
    protect,
    deleteFeasibilityAnalysis
);

module.exports = router;
