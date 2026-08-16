const {
    findMatchingUsers
} = require("../services/matchingService");

const getMatchingUsers = async (req, res) => {
    try {
        const { projectId } = req.params;

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

module.exports = {
    getMatchingUsers
};