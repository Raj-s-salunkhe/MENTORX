const Project = require("../models/Project");

const createProject = async (req, res) => {
    try {
        const {
            title,
            description,
            skillsRequired,
            interestsRequired,
            category,
            difficulty
        } = req.body;

        if (!title || !description) {
            return res.status(400).json({
                message: "Title and description are required"
            });
        }

        const project = await Project.create({
            title,
            description,
            skillsRequired: skillsRequired || [],
            interestsRequired: interestsRequired || [],
            category,
            difficulty,
            owner: req.userId,
            members: [req.userId]
        });

        res.status(201).json({
            message: "Project created successfully 🚀",
            project
        });

    } catch (error) {
        res.status(500).json({
            message: "Project creation failed",
            error: error.message
        });
    }
};

const getProjects = async (req, res) => {
    try {
        const projects = await Project.find({ status: "Open" })
            .populate("owner", "name email college")
            .populate("members", "name email");

        res.json({
            message: "Projects loaded successfully",
            count: projects.length,
            projects
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to load projects",
            error: error.message
        });
    }
};

const getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id)
            .populate("owner", "name email college")
            .populate("members", "name email");

        if (!project) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

        res.json({
            message: "Project loaded successfully",
            project
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to load project",
            error: error.message
        });
    }
};

const joinProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

        if (project.status !== "Open") {
            return res.status(400).json({
                message: "This project is not open for joining"
            });
        }

        const alreadyMember = project.members.some(
            member => member.toString() === req.userId
        );

        if (alreadyMember) {
            return res.status(400).json({
                message: "You are already a member of this project"
            });
        }

        project.members.push(req.userId);
        await project.save();

        res.json({
            message: "Joined project successfully 🎉",
            project
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to join project",
            error: error.message
        });
    }
};

const getProjectMembers = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id)
            .populate("members", "name email college skills interests");

        if (!project) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

        res.json({
            message: "Team members loaded successfully",
            count: project.members.length,
            members: project.members
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to load team members",
            error: error.message
        });
    }
};

const leaveProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

        const isMember = project.members.some(
            member => member.toString() === req.userId
        );

        if (!isMember) {
            return res.status(400).json({
                message: "You are not a member of this project"
            });
        }

        if (project.owner.toString() === req.userId) {
            return res.status(400).json({
                message: "Project owner cannot leave the project"
            });
        }

        project.members = project.members.filter(
            member => member.toString() !== req.userId
        );

        await project.save();

        res.json({
            message: "You left the project successfully",
            project
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to leave project",
            error: error.message
        });
    }
};

const removeMember = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

        if (project.owner.toString() !== req.userId) {
            return res.status(403).json({
                message: "Only the project owner can remove members"
            });
        }

        if (project.owner.toString() === req.params.userId) {
            return res.status(400).json({
                message: "Project owner cannot be removed"
            });
        }

        const isMember = project.members.some(
            member => member.toString() === req.params.userId
        );

        if (!isMember) {
            return res.status(404).json({
                message: "User is not a member of this project"
            });
        }

        project.members = project.members.filter(
            member => member.toString() !== req.params.userId
        );

        await project.save();

        res.json({
            message: "Member removed successfully",
            project
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to remove member",
            error: error.message
        });
    }
};

module.exports = {
    createProject,
    getProjects,
    getProjectById,
    joinProject,
    getProjectMembers,
    leaveProject,
    removeMember
};