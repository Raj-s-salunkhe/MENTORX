const express = require("express");

const {
    analyzeProjectIdea,
    getTechnologies,
    getRoadmap,
    getBudget
} = require("../controllers/aiController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/analyze-project", protect, analyzeProjectIdea);
router.get("/technologies", protect, getTechnologies);
router.get("/roadmap", protect, getRoadmap);
router.get("/budget", protect, getBudget);

module.exports = router;