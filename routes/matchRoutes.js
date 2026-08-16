const express = require("express");

const { getMatchingUsers } = require("../controllers/matchController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/:projectId", protect, getMatchingUsers);

module.exports = router;