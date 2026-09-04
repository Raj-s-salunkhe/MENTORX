const express = require("express");

const {
    createProject,
    getProjects,
    getProjectById,
    updateProject,
    deleteProject,
    joinProject,
    leaveProject,
    removeMember
} = require("../controllers/projectController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

/* =========================
   CREATE PROJECT
========================= */

router.post(
    "/",
    protect,
    createProject
);

/* =========================
   GET ALL PROJECTS
========================= */

router.get(
    "/",
    protect,
    getProjects
);

/* =========================
   GET SINGLE PROJECT
========================= */

router.get(
    "/:id",
    protect,
    getProjectById
);

/* =========================
   UPDATE PROJECT
========================= */

router.put(
    "/:id",
    protect,
    updateProject
);

/* =========================
   DELETE PROJECT
========================= */

router.delete(
    "/:id",
    protect,
    deleteProject
);

/* =========================
   JOIN PROJECT
========================= */

router.post(
    "/:id/join",
    protect,
    joinProject
);

/* =========================
   LEAVE PROJECT
========================= */

router.post(
    "/:id/leave",
    protect,
    leaveProject
);

/* =========================
   REMOVE MEMBER
========================= */

router.delete(
    "/:id/members/:memberId",
    protect,
    removeMember
);

module.exports = router;