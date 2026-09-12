const express = require("express");

const {
    getMySkills,
    getSkillQuestions,
    submitAssessment
} = require("../controllers/skillController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/my", protect, getMySkills);
router.get(
    "/:skill/questions",
    protect,
    getSkillQuestions
);
router.post(
    "/:skill/submit",
    protect,
    submitAssessment
);

module.exports = router;