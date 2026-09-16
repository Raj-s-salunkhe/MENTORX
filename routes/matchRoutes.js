const express = require("express");

const {
    getMatchingUsers,
    getVerificationStatus
} = require("../controllers/matchController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
    "/verification-status",
    protect,
    getVerificationStatus
);
router.get("/:projectId", protect, getMatchingUsers);

module.exports = router;