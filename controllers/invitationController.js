const Invitation = require("../models/Invitation");
const Project = require("../models/Project");
const User = require("../models/User");

/*
=========================================================
SEND INVITATION
=========================================================
*/

const sendInvitation = async (req, res) => {
    try {
        const {
            projectId,
            receiverId
        } = req.body;

        if (!projectId || !receiverId) {
            return res.status(400).json({
                message:
                    "projectId and receiverId are required"
            });
        }

        if (
            String(req.userId) ===
            String(receiverId)
        ) {
            return res.status(400).json({
                message:
                    "You cannot invite yourself"
            });
        }

        const project =
            await Project.findById(projectId);

        if (!project) {
            return res.status(404).json({
                message:
                    "Project not found"
            });
        }

        /*
        Only the project owner can invite users.
        */

        if (
            String(project.owner) !==
            String(req.userId)
        ) {
            return res.status(403).json({
                message:
                    "Only the project owner can send invitations"
            });
        }

        /*
        Check receiver exists.
        */

        const receiver =
            await User.findById(receiverId);

        if (!receiver) {
            return res.status(404).json({
                message:
                    "User not found"
            });
        }

        /*
        Check if receiver is already a member.
        */

        const alreadyMember =
            project.members.some(
                (memberId) =>
                    String(memberId) ===
                    String(receiverId)
            );

        if (alreadyMember) {
            return res.status(400).json({
                message:
                    "User is already a member of this project"
            });
        }

        /*
        Check pending invitation.
        */

        const existingInvitation =
            await Invitation.findOne({
                project: projectId,
                sender: req.userId,
                receiver: receiverId,
                status: "Pending"
            });

        if (existingInvitation) {
            return res.status(400).json({
                message:
                    "Invitation already sent"
            });
        }

        const invitation =
            await Invitation.create({
                project: projectId,
                sender: req.userId,
                receiver: receiverId,
                status: "Pending"
            });

        const populatedInvitation =
            await Invitation.findById(
                invitation._id
            )
                .populate(
                    "project",
                    "title description category difficulty"
                )
                .populate(
                    "sender",
                    "name email college"
                )
                .populate(
                    "receiver",
                    "name email college"
                );

        res.status(201).json({
            message:
                "Invitation sent successfully 📩",
            invitation:
                populatedInvitation
        });

    } catch (error) {
        console.error(
            "Send invitation error:",
            error
        );

        res.status(500).json({
            message:
                "Failed to send invitation",
            error: error.message
        });
    }
};

/*
=========================================================
GET RECEIVED INVITATIONS
=========================================================
*/

const getReceivedInvitations = async (
    req,
    res
) => {
    try {
        const invitations =
            await Invitation.find({
                receiver: req.userId
            })
                .populate(
                    "project",
                    "title description category difficulty owner"
                )
                .populate(
                    "sender",
                    "name email college skills experienceLevel"
                )
                .sort({
                    createdAt: -1
                });

        res.json({
            message:
                "Received invitations loaded successfully",
            invitations
        });

    } catch (error) {
        console.error(
            "Get received invitations error:",
            error
        );

        res.status(500).json({
            message:
                "Failed to load received invitations",
            error: error.message
        });
    }
};

/*
=========================================================
GET SENT INVITATIONS
=========================================================
*/

const getSentInvitations = async (
    req,
    res
) => {
    try {
        const invitations =
            await Invitation.find({
                sender: req.userId
            })
                .populate(
                    "project",
                    "title description category difficulty"
                )
                .populate(
                    "receiver",
                    "name email college skills experienceLevel"
                )
                .sort({
                    createdAt: -1
                });

        res.json({
            message:
                "Sent invitations loaded successfully",
            invitations
        });

    } catch (error) {
        console.error(
            "Get sent invitations error:",
            error
        );

        res.status(500).json({
            message:
                "Failed to load sent invitations",
            error: error.message
        });
    }
};

/*
=========================================================
ACCEPT INVITATION
=========================================================
*/

const acceptInvitation = async (
    req,
    res
) => {
    try {
        const invitation =
            await Invitation.findOne({
                _id: req.params.id,
                receiver: req.userId,
                status: "Pending"
            });

        if (!invitation) {
            return res.status(404).json({
                message:
                    "Pending invitation not found"
            });
        }

        const project =
            await Project.findById(
                invitation.project
            );

        if (!project) {
            return res.status(404).json({
                message:
                    "Project not found"
            });
        }

        /*
        Don't add duplicate members.
        */

        const alreadyMember =
            project.members.some(
                (memberId) =>
                    String(memberId) ===
                    String(req.userId)
            );

        if (!alreadyMember) {
            project.members.push(
                req.userId
            );

            await project.save();
        }

        invitation.status =
            "Accepted";

        await invitation.save();

        const updatedInvitation =
            await Invitation.findById(
                invitation._id
            )
                .populate(
                    "project",
                    "title description category difficulty"
                )
                .populate(
                    "sender",
                    "name email"
                )
                .populate(
                    "receiver",
                    "name email"
                );

        res.json({
            message:
                "Invitation accepted successfully 🎉",
            invitation:
                updatedInvitation,
            project
        });

    } catch (error) {
        console.error(
            "Accept invitation error:",
            error
        );

        res.status(500).json({
            message:
                "Failed to accept invitation",
            error: error.message
        });
    }
};

/*
=========================================================
REJECT INVITATION
=========================================================
*/

const rejectInvitation = async (
    req,
    res
) => {
    try {
        const invitation =
            await Invitation.findOne({
                _id: req.params.id,
                receiver: req.userId,
                status: "Pending"
            });

        if (!invitation) {
            return res.status(404).json({
                message:
                    "Pending invitation not found"
            });
        }

        invitation.status =
            "Rejected";

        await invitation.save();

        res.json({
            message:
                "Invitation rejected"
        });

    } catch (error) {
        console.error(
            "Reject invitation error:",
            error
        );

        res.status(500).json({
            message:
                "Failed to reject invitation",
            error: error.message
        });
    }
};

/*
=========================================================
CANCEL SENT INVITATION
=========================================================
*/

const cancelInvitation = async (
    req,
    res
) => {
    try {
        const invitation =
            await Invitation.findOne({
                _id: req.params.id,
                sender: req.userId,
                status: "Pending"
            });

        if (!invitation) {
            return res.status(404).json({
                message:
                    "Pending invitation not found"
            });
        }

        await Invitation.findByIdAndDelete(
            invitation._id
        );

        res.json({
            message:
                "Invitation cancelled successfully"
        });

    } catch (error) {
        console.error(
            "Cancel invitation error:",
            error
        );

        res.status(500).json({
            message:
                "Failed to cancel invitation",
            error: error.message
        });
    }
};

module.exports = {
    sendInvitation,
    getReceivedInvitations,
    getSentInvitations,
    acceptInvitation,
    rejectInvitation,
    cancelInvitation
};