const Project = require("../models/Project");
const User = require("../models/User");

const createProject = async (req, res) => {
    try {
        const {
            title,
            description,
            domain,
            projectType,
            problemStatement,
            objectives,
            keyFeatures,
            category,
            skillsRequired,
            interestsRequired,
            recommendedTechnologies,
            estimatedDays,
            estimatedBudget,
            recommendedTeamSize,
            difficulty
        } = req.body;

        if (!title || !description) {
            return res.status(400).json({
                message: "Title and description are required"
            });
        }

        const project = await Project.create({
            title: title.trim(),
            description: description.trim(),

            domain: domain || "",
            projectType: projectType || "",
            problemStatement: problemStatement || "",

            objectives: Array.isArray(objectives)
                ? objectives
                : [],

            keyFeatures: Array.isArray(keyFeatures)
                ? keyFeatures
                : [],

            category: category || "General",

            skillsRequired: Array.isArray(skillsRequired)
                ? skillsRequired
                : [],

            interestsRequired: Array.isArray(interestsRequired)
                ? interestsRequired
                : [],

            recommendedTechnologies:
                Array.isArray(recommendedTechnologies)
                    ? recommendedTechnologies
                    : [],

            estimatedDays:
                Number(estimatedDays) || 0,

            estimatedBudget:
                Number(estimatedBudget) || 0,

            recommendedTeamSize:
                Number(recommendedTeamSize) || 1,

            difficulty:
                difficulty || "Beginner",

            owner: req.userId,

            members: [req.userId]
        });

        const populatedProject =
            await Project.findById(project._id)
                .populate(
                    "owner",
                    "name email college"
                )
                .populate(
                    "members",
                    "name email college skills experienceLevel"
                );

        res.status(201).json({
            message: "Project created successfully 🎉",
            project: populatedProject
        });

    } catch (error) {
        console.error(
            "Create project error:",
            error
        );

        res.status(500).json({
            message: "Failed to create project",
            error: error.message
        });
    }
};

const getProjects = async (req, res) => {
    try {
        const projects = await Project.find()
            .populate(
                "owner",
                "name email college"
            )
            .populate(
                "members",
                "name email college skills experienceLevel"
            )
            .sort({
                createdAt: -1
            });

        res.json({
            message: "Projects loaded successfully",
            projects
        });

    } catch (error) {
        console.error(
            "Get projects error:",
            error
        );

        res.status(500).json({
            message: "Failed to load projects",
            error: error.message
        });
    }
};

const getProjectById = async (req, res) => {
    try {
        const project =
            await Project.findById(
                req.params.id
            )
                .populate(
                    "owner",
                    "name email college skills experienceLevel"
                )
                .populate(
                    "members",
                    "name email college skills experienceLevel"
                );

        if (!project) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

        res.json({
            message:
                "Project loaded successfully",
            project
        });

    } catch (error) {
        console.error(
            "Get project error:",
            error
        );

        res.status(500).json({
            message: "Failed to load project",
            error: error.message
        });
    }
};

const updateProject = async (req, res) => {
    try {
        const project =
            await Project.findById(
                req.params.id
            );

        if (!project) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

        if (
            String(project.owner) !==
            String(req.userId)
        ) {
            return res.status(403).json({
                message:
                    "Only the project owner can update this project"
            });
        }

        const {
            title,
            description,
            domain,
            projectType,
            problemStatement,
            objectives,
            keyFeatures,
            category,
            skillsRequired,
            interestsRequired,
            recommendedTechnologies,
            estimatedDays,
            estimatedBudget,
            recommendedTeamSize,
            difficulty,
            status
        } = req.body;

        const updates = {
            title,
            description,
            domain,
            projectType,
            problemStatement,
            objectives,
            keyFeatures,
            category,
            skillsRequired,
            interestsRequired,
            recommendedTechnologies,
            estimatedDays:
                estimatedDays !== undefined
                    ? Number(estimatedDays)
                    : undefined,
            estimatedBudget:
                estimatedBudget !== undefined
                    ? Number(estimatedBudget)
                    : undefined,
            recommendedTeamSize:
                recommendedTeamSize !== undefined
                    ? Number(recommendedTeamSize)
                    : undefined,
            difficulty,
            status
        };

        Object.keys(updates).forEach(
            (key) => {
                if (
                    updates[key] === undefined
                ) {
                    delete updates[key];
                }
            }
        );

        const updatedProject =
            await Project.findByIdAndUpdate(
                req.params.id,
                updates,
                {
                    new: true,
                    runValidators: true
                }
            )
                .populate(
                    "owner",
                    "name email college"
                )
                .populate(
                    "members",
                    "name email college skills experienceLevel"
                );

        res.json({
            message:
                "Project updated successfully ✅",
            project: updatedProject
        });

    } catch (error) {
        console.error(
            "Update project error:",
            error
        );

        res.status(500).json({
            message: "Failed to update project",
            error: error.message
        });
    }
};

const deleteProject = async (req, res) => {
    try {
        const project =
            await Project.findById(
                req.params.id
            );

        if (!project) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

        if (
            String(project.owner) !==
            String(req.userId)
        ) {
            return res.status(403).json({
                message:
                    "Only the project owner can delete this project"
            });
        }

        await Project.findByIdAndDelete(
            req.params.id
        );

        res.json({
            message:
                "Project deleted successfully ✅"
        });

    } catch (error) {
        console.error(
            "Delete project error:",
            error
        );

        res.status(500).json({
            message: "Failed to delete project",
            error: error.message
        });
    }
};

const joinProject = async (req, res) => {
    try {
        const project =
            await Project.findById(
                req.params.id
            );

        if (!project) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

        const alreadyMember =
            project.members.some(
                (memberId) =>
                    String(memberId) ===
                    String(req.userId)
            );

        if (alreadyMember) {
            return res.status(400).json({
                message:
                    "You are already a member of this project"
            });
        }

        if (
            project.status ===
            "Completed"
        ) {
            return res.status(400).json({
                message:
                    "This project is already completed"
            });
        }

        project.members.push(
            req.userId
        );

        await project.save();

        const updatedProject =
            await Project.findById(
                project._id
            )
                .populate(
                    "owner",
                    "name email college"
                )
                .populate(
                    "members",
                    "name email college skills experienceLevel"
                );

        res.json({
            message:
                "Joined project successfully 🎉",
            project: updatedProject
        });

    } catch (error) {
        console.error(
            "Join project error:",
            error
        );

        res.status(500).json({
            message: "Failed to join project",
            error: error.message
        });
    }
};

const leaveProject = async (req, res) => {
    try {
        const project =
            await Project.findById(
                req.params.id
            );

        if (!project) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

        if (
            String(project.owner) ===
            String(req.userId)
        ) {
            return res.status(400).json({
                message:
                    "Project owner cannot leave the project"
            });
        }

        const isMember =
            project.members.some(
                (memberId) =>
                    String(memberId) ===
                    String(req.userId)
            );

        if (!isMember) {
            return res.status(400).json({
                message:
                    "You are not a member of this project"
            });
        }

        project.members =
            project.members.filter(
                (memberId) =>
                    String(memberId) !==
                    String(req.userId)
            );

        await project.save();

        res.json({
            message:
                "Left project successfully",
            project
        });

    } catch (error) {
        console.error(
            "Leave project error:",
            error
        );

        res.status(500).json({
            message: "Failed to leave project",
            error: error.message
        });
    }
};

const removeMember = async (req, res) => {
    try {
        const project =
            await Project.findById(
                req.params.id
            );

        if (!project) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

        if (
            String(project.owner) !==
            String(req.userId)
        ) {
            return res.status(403).json({
                message:
                    "Only the project owner can remove members"
            });
        }

        const memberId =
            req.params.memberId;

        const isMember =
            project.members.some(
                (id) =>
                    String(id) ===
                    String(memberId)
            );

        if (!isMember) {
            return res.status(400).json({
                message:
                    "User is not a member of this project"
            });
        }

        project.members =
            project.members.filter(
                (id) =>
                    String(id) !==
                    String(memberId)
            );

        await project.save();

        res.json({
            message:
                "Member removed successfully",
            project
        });

    } catch (error) {
        console.error(
            "Remove member error:",
            error
        );

        res.status(500).json({
            message:
                "Failed to remove member",
            error: error.message
        });
    }
};

module.exports = {
    createProject,
    getProjects,
    getProjectById,
    updateProject,
    deleteProject,
    joinProject,
    leaveProject,
    removeMember
};
