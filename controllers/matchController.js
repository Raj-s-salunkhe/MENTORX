const {
    findMatchingUsers
} = require("../services/matchingService");
const SkillAssessment = require("../models/SkillAssessment");

const REQUIRED_VERIFIED_SKILLS = 2;

const getVerifiedSkillCount = async (userId) => {
    const assessments = await SkillAssessment.find({
        user: userId,
        verified: true
    });
    return assessments.length;
};

const getMatchingUsers = async (req, res) => {
    try {
        const { projectId } = req.params;

        if (!projectId) {
            return res.status(400).json({
                message: "Project ID is required"
            });
        }

        const verifiedSkillCount = await getVerifiedSkillCount(
            req.userId
        );

        if (verifiedSkillCount < REQUIRED_VERIFIED_SKILLS) {
            return res.status(403).json({
                requiresVerification: true,
                verifiedSkillCount,
                required: REQUIRED_VERIFIED_SKILLS,
                message:
                    `Matchmaker requires at least ${REQUIRED_VERIFIED_SKILLS} verified skills. ` +
                    `You have ${verifiedSkillCount}. Please verify your skills to continue.`
            });
        }

        const matches = await findMatchingUsers(
            projectId,
            req.userId
        );

        res.json({
            message: "Matching users found successfully 🤖",
            count: matches.length,
            matches
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to find matching users",
            error: error.message
        });
    }
};

const getVerificationStatus = async (req, res) => {
    try {
        const verifiedSkillCount = await getVerifiedSkillCount(
            req.userId
        );
        const allowed =
            verifiedSkillCount >= REQUIRED_VERIFIED_SKILLS;

        return res.json({
            verifiedSkillCount,
            required: REQUIRED_VERIFIED_SKILLS,
            allowed,
            message: allowed
                ? "You have enough verified skills to use Matchmaker"
                : "Complete skill assessments to unlock Matchmaker"
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to check verification status",
            error: error.message
        });
    }
};

module.exports = {
    getMatchingUsers,
    getVerificationStatus
};