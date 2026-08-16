const express = require("express");

const {
    createProject,
    getProjects,
    getProjectById,
    joinProject,
    getProjectMembers,
    leaveProject,
    removeMember
} = require("../controllers/projectController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createProject);
router.get("/", protect, getProjects);
router.get("/:id", protect, getProjectById);
router.post("/:id/join", protect, joinProject);
router.get("/:id/members", protect, getProjectMembers);
router.post("/:id/leave", protect, leaveProject);
router.delete("/:id/members/:userId", protect, removeMember);

module.exports = router;