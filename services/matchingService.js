const User = require("../models/User");
const Project = require("../models/Project");

const normalize = (items = []) =>
    items.map(item => item.toLowerCase().trim());

const calculateSkillScore = (required, userSkills) => {
    const req = normalize(required);
    const skills = normalize(userSkills);

    if (req.length === 0) return 100;

    const matched = req.filter(skill => skills.includes(skill));

    return Math.round((matched.length / req.length) * 100);
};

const calculateInterestScore = (required, userInterests) => {
    const req = normalize(required);
    const interests = normalize(userInterests);

    if (req.length === 0) return 100;

    const matched = req.filter(interest =>
        interests.includes(interest)
    );

    return Math.round((matched.length / req.length) * 100);
};

const calculateExperienceScore = (difficulty, experience) => {
    const levels = {
        Beginner: 1,
        Intermediate: 2,
        Advanced: 3
    };

    const required = levels[difficulty] || 1;
    const user = levels[experience] || 1;

    if (user >= required) return 100;

    return Math.round((user / required) * 100);
};

const calculateAvailabilityScore = availability => {
    if (!availability) return 50;

    const value = availability.toLowerCase();

    if (value.includes("available")) return 100;
    if (value.includes("part")) return 70;
    if (value.includes("busy")) return 40;

    return 50;
};

const calculateCompatibility = (project, user) => {
    const skillScore = calculateSkillScore(
        project.skillsRequired,
        user.skills
    );

    const experienceScore = calculateExperienceScore(
        project.difficulty,
        user.experienceLevel
    );

    const interestScore = calculateInterestScore(
        project.interestsRequired,
        user.interests
    );

    const availabilityScore = calculateAvailabilityScore(
        user.availability
    );

    const projectExperienceScore =
        user.projects && user.projects.length > 0 ? 100 : 50;

    const totalScore = Math.round(
        skillScore * 0.40 +
        experienceScore * 0.20 +
        interestScore * 0.20 +
        projectExperienceScore * 0.10 +
        availabilityScore * 0.10
    );

    return {
        skillScore,
        experienceScore,
        interestScore,
        projectExperienceScore,
        availabilityScore,
        totalScore
    };
};

const findMatchingUsers = async (projectId, currentUserId) => {
    const project = await Project.findById(projectId);

    if (!project) {
        throw new Error("Project not found");
    }

    const users = await User.find({
        _id: { $ne: currentUserId }
    }).select("-password");

    const results = users.map(user => {
        const scores = calculateCompatibility(project, user);

        return {
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                college: user.college,
                experienceLevel: user.experienceLevel,
                skills: user.skills,
                interests: user.interests,
                availability: user.availability
            },
            ...scores
        };
    });

    return results.sort(
        (a, b) => b.totalScore - a.totalScore
    );
};

module.exports = {
    calculateCompatibility,
    findMatchingUsers
};