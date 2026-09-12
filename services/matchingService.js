const User = require("../models/User");
const Project = require("../models/Project");
const SkillAssessment = require("../models/SkillAssessment");

const SKILL_NAMES = {
    python: "Python",
    javascript: "JavaScript",
    react: "React",
    cpp: "C++",
    java: "Java",
    nodejs: "Node.js",
    mongodb: "MongoDB"
};

const normalize = (items = []) =>
    items.map(item => item.toLowerCase().trim());

const normalizeSkill = (skill) =>
    String(skill || "").toLowerCase().trim();

const displaySkillName = (skill) =>
    SKILL_NAMES[normalizeSkill(skill)] || skill;

const calculateSkillCompatibility = (required, userSkills, assessments) => {
    const req = normalize(required);

    if (req.length === 0) return 100;

    let totalScore = 0;
    let matchedCount = 0;

    for (const requiredSkill of req) {
        const assessment = assessments.find(
            (a) => normalizeSkill(a.skill) === requiredSkill
        );

        if (assessment && assessment.verified) {
            totalScore += assessment.proficiency;
            matchedCount++;
        } else if (assessment) {
            // Unverified assessment - lower trust
            totalScore += assessment.proficiency * 0.7;
            matchedCount++;
        } else if (
            userSkills &&
            userSkills.some((s) =>
                normalizeSkill(s) === requiredSkill
            )
        ) {
            // Self-reported without verification - lower confidence
            totalScore += 50;
            matchedCount++;
        }
    }

    return matchedCount > 0
        ? Math.round(totalScore / req.length)
        : 0;
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

const calculateExperienceCompatibility = (difficulty, experience) => {
    const levels = {
        Beginner: 1,
        Intermediate: 2,
        Advanced: 3
    };

    const required = levels[difficulty] || 1;
    const user = levels[experience] || 1;

    if (user >= required) return 100;

    const difference = required - user;
    if (difference === 1) return 75;
    if (difference === 2) return 50;
    return 25;
};

const calculateAvailabilityScore = availability => {
    if (!availability) return 50;

    const value = availability.toLowerCase();

    if (value.includes("available")) return 100;
    if (value.includes("part")) return 70;
    if (value.includes("busy")) return 40;

    return 50;
};

const calculateProjectCompatibility = (project, user) => {
    return calculateInterestScore(
        project.interestsRequired,
        user.interests
    );
};

const calculateTeamCompatibility = (project, user, assessments) => {
    const required = normalize(project.skillsRequired);
    const recommended = normalize(project.recommendedTechnologies);

    const userSkills = new Map();

    // Verified assessments first (highest trust)
    for (const assessment of assessments) {
        if (assessment.verified) {
            userSkills.set(
                normalizeSkill(assessment.skill),
                assessment.proficiency
            );
        }
    }

    // Self-reported fallback (lower confidence)
    for (const skill of user.skills || []) {
        const normalized = normalizeSkill(skill);
        if (!userSkills.has(normalized)) {
            userSkills.set(normalized, 50);
        }
    }

    if (required.length === 0) return 100;

    // Coverage of required skills (up to 70 points)
    const coveredCount = required.filter((skill) =>
        userSkills.has(skill)
    ).length;
    const coverageScore = (coveredCount / required.length) * 70;

    // Complementary skills from recommended technologies (up to 30 points)
    const complementary = Array.from(userSkills.entries()).filter(
        ([skill]) => !required.includes(skill) && recommended.includes(skill)
    );

    const complementScore = complementary.length > 0
        ? Math.min(
            complementary.reduce((sum, [, proficiency]) =>
                sum + proficiency, 0) / complementary.length,
            30
        )
        : 0;

    // Gap filling bonus (10 points if any required skill covered)
    const gapBonus = coveredCount > 0 ? 10 : 0;

    return Math.round(
        Math.min(coverageScore + complementScore + gapBonus, 100)
    );
};

const calculateCompatibility = (project, user, userAssessments = []) => {
    const skillCompatibility = calculateSkillCompatibility(
        project.skillsRequired,
        user.skills,
        userAssessments
    );

    const teamCompatibility = calculateTeamCompatibility(
        project,
        user,
        userAssessments
    );

    const projectCompatibility = calculateProjectCompatibility(
        project,
        user
    );

    const experienceCompatibility = calculateExperienceCompatibility(
        project.difficulty,
        user.experienceLevel
    );

    const availabilityScore = calculateAvailabilityScore(
        user.availability
    );

    const totalScore = Math.round(
        skillCompatibility * 0.30 +
        teamCompatibility * 0.25 +
        projectCompatibility * 0.15 +
        experienceCompatibility * 0.15 +
        availabilityScore * 0.15
    );

    // Determine which self-reported skills have no assessment at all
    const assessedSkillKeys = new Set(
        userAssessments.map((a) => normalizeSkill(a.skill))
    );
    const selfReportedSkills = (user.skills || []).filter(
        (skill) => !assessedSkillKeys.has(normalizeSkill(skill))
    );

    // Format assessments with display names and confidence labels
    const skillAssessments = userAssessments.map((assessment) => ({
        ...assessment,
        skillName: displaySkillName(assessment.skill),
        confidence: assessment.verified
            ? "verified"
            : "unverified"
    }));

    return {
        teamMatch: totalScore,
        skillCompatibility,
        teamCompatibility,
        projectCompatibility,
        experienceCompatibility,
        availabilityScore,
        skillAssessments,
        selfReportedSkills,
        totalScore,
        skillScore: skillCompatibility,
        experienceScore: experienceCompatibility,
        interestScore: projectCompatibility,
        projectExperienceScore: teamCompatibility
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

    // Batch load all assessments for candidate users
    const userIds = users.map(user => user._id);
    const assessments = await SkillAssessment.find({
        user: { $in: userIds }
    });

    // Group assessments by user ID
    const assessmentsByUser = new Map();
    for (const assessment of assessments) {
        const userId = assessment.user.toString();
        if (!assessmentsByUser.has(userId)) {
            assessmentsByUser.set(userId, []);
        }
        assessmentsByUser.get(userId).push(assessment);
    }

    const results = users.map(user => {
        const userAssessments =
            assessmentsByUser.get(user._id.toString()) || [];
        const scores = calculateCompatibility(
            project,
            user,
            userAssessments
        );

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
        (a, b) => b.teamMatch - a.teamMatch
    );
};

module.exports = {
    calculateCompatibility,
    findMatchingUsers
};