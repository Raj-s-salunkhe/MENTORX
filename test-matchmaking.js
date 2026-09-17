/* Test script for Matchmaker 2.0 scoring logic.
   Run with: node test-matchmaking.js
   No external dependencies — tests calculateCompatibility directly. */

const {
    calculateCompatibility
} = require("./services/matchingService");

const SKILLS = [
    { name: "python", proficiency: 82, verified: true, key: "python" },
    { name: "react", proficiency: 74, verified: true, key: "react" },
    { name: "nodejs", proficiency: 68, verified: true, key: "nodejs" },
    { name: "mongodb", proficiency: 91, verified: true, key: "mongodb" }
];

// Helper to build assessment objects matching DB shape
const assess = (key, proficiency) => ({
    skill: key,
    proficiency,
    verified: true,
    assessmentScore: Math.round(proficiency / 10),
    totalQuestions: 10
});

function makeUser({
    skills = [],
    interests = [],
    experienceLevel = "Beginner",
    availability = "Available",
    hasProjects = false
}) {
    return {
        skills,
        interests,
        experienceLevel,
        availability,
        projects: hasProjects ? [{ title: "Past Project" }] : []
    };
}

let passed = 0;
let failed = 0;

function assert(name, actual, expected, tolerance = 0) {
    const diff = Math.abs(actual - expected);
    if (diff <= tolerance) {
        console.log(`  ✅ ${name}: got ${actual}, expected ${expected}`);
        passed++;
    } else {
        console.log(`  ❌ ${name}: got ${actual}, expected ${expected}`);
        failed++;
    }
}

function assertTrue(name, cond) {
    if (cond) {
        console.log(`  ✅ ${name}`);
        passed++;
    } else {
        console.log(`  ❌ ${name}`);
        failed++;
    }
}

console.log("\n========================================");
console.log("Matchmaker 2.0 — Test Suite");
console.log("========================================\n");

// ─── Scenario 1: User with verified skills ───
console.log("Scenario 1: User with verified skills");
const projectMulti = {
    skillsRequired: ["Python", "React", "MongoDB"],
    recommendedTechnologies: ["Node.js", "Express"],
    interestsRequired: ["Full-stack development"],
    difficulty: "Advanced"
};

const user1 = makeUser({
    skills: ["Python", "React", "Node.js"],
    interests: ["Full-stack development"],
    experienceLevel: "Advanced",
    availability: "Available"
});
const assessments1 = [
    assess("python", 82),
    assess("react", 74)
];
const result1 = calculateCompatibility(projectMulti, user1, assessments1);

assert("skillCompatibility uses verified proficiency avg",
    result1.skillCompatibility, 52, 0); // (82+74+0)/3 = 52 (MongoDB not covered)
assertTrue("selfReportedSkills excludes verified skills",
    !result1.selfReportedSkills.includes("Python") &&
    !result1.selfReportedSkills.includes("React") &&
    result1.selfReportedSkills.includes("Node.js"));
assertTrue("skillAssessments have skillName",
    result1.skillAssessments.some(a => a.skillName === "Python") &&
    result1.skillAssessments.some(a => a.skillName === "React"));
assertTrue("teamMatch computed", result1.teamMatch > 0);
assertTrue("teamMatch is integer", Number.isInteger(result1.teamMatch));

console.log("\nScenario 2: User without assessments (self-reported)");
const user2 = makeUser({
    skills: ["Python", "Node.js"],
    interests: ["Full-stack development"],
    experienceLevel: "Intermediate",
    availability: "Part-time"
});
const result2 = calculateCompatibility(projectMulti, user2, []);

assertTrue("skillAssessments empty for no assessments",
    result2.skillAssessments.length === 0);
assertTrue("selfReportedSkills contains all user skills",
    result2.selfReportedSkills.includes("Python") &&
    result2.selfReportedSkills.includes("Node.js"));
assertTrue("skillCompatibility uses 50 fallback for self-reported",
    result2.skillCompatibility === 17); // (50+0+0)/3 = 17
assertTrue("teamMatch computed without assessments", result2.teamMatch > 0);

console.log("\nScenario 3: Users with different skill profiles");
const userA = makeUser({
    skills: ["Python", "React"],
    interests: ["Full-stack development"],
    experienceLevel: "Advanced",
    availability: "Available"
});
const userB = makeUser({
    skills: ["Python", "React", "MongoDB", "Node.js"],
    interests: ["Full-stack development"],
    experienceLevel: "Advanced",
    availability: "Available"
});
const assessmentsB = [
    assess("python", 65),
    assess("react", 92),
    assess("mongodb", 85)
];
const resultA = calculateCompatibility(projectMulti, userA, [
    assess("python", 85),
    assess("react", 60)
]);
const resultB = calculateCompatibility(projectMulti, userB, assessmentsB);

assertTrue("User B has higher Team Compatibility than User A (complementary)",
    resultB.teamCompatibility > resultA.teamCompatibility);
assertTrue("User B has MongoDB verified (complementary)",
    resultB.skillAssessments.some(a => a.skill === "mongodb"));

console.log("\nScenario 4: Project requiring multiple skills");
const complexProject = {
    skillsRequired: ["Python", "React", "MongoDB", "Node.js", "JavaScript"],
    recommendedTechnologies: ["Docker", "AWS"],
    interestsRequired: ["AI", "Web Dev"],
    difficulty: "Advanced"
};

const user4 = makeUser({
    skills: ["Python", "JavaScript", "Docker"],
    interests: ["Web Dev"],
    experienceLevel: "Intermediate",
    availability: "Available"
});
const assessments4 = [
    assess("python", 90),
    assess("javascript", 75)
];
const result4 = calculateCompatibility(complexProject, user4, assessments4);

assert("skillCompatibility averages across multiple required skills",
    result4.skillCompatibility, 33, 0); // (90+0+0+0+75)/5 = 33
assertTrue("projectCompatibility from interests",
    result4.projectCompatibility === 50); // "Web Dev" matches 1/2 interests
assertTrue("experienceCompatibility penalized for level gap",
    result4.experienceCompatibility === 75);
assertTrue("result includes backward-compatible fields",
    result4.totalScore !== undefined &&
    result4.skillScore !== undefined &&
    result4.experienceScore !== undefined &&
    result4.interestScore !== undefined);

console.log("\nScenario 5: Project with no required skills");
const emptyProject = {
    skillsRequired: [],
    recommendedTechnologies: [],
    interestsRequired: [],
    difficulty: "Beginner"
};
const user5 = makeUser({
    skills: ["Python"],
    interests: [],
    experienceLevel: "Beginner",
    availability: "Available"
});
const result5 = calculateCompatibility(emptyProject, user5, []);
assert("skillCompatibility is 100 with no required skills",
    result5.skillCompatibility, 100);

console.log("\nScenario 6: Experience level gap scoring");
const expProject = { difficulty: "Advanced", skillsRequired: [], interestsRequired: [] };
assert("Advanced user on Advanced project = 100",
    calculateExperienceCompatibilityHelper(expProject, makeUser({ experienceLevel: "Advanced" })),
    100);

function calculateExperienceCompatibilityHelper(project, user) {
    // Access internal function via calculateCompatibility's result
    const r = calculateCompatibility(project, user, []);
    return r.experienceCompatibility;
}

assert("Intermediate user on Advanced project = 75",
    calculateExperienceCompatibilityHelper(expProject, makeUser({ experienceLevel: "Intermediate" })),
    75);
assert("Beginner user on Advanced project = 50",
    calculateExperienceCompatibilityHelper(expProject, makeUser({ experienceLevel: "Beginner" })),
    50);

console.log("\n========================================");
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log("========================================");
process.exit(failed > 0 ? 1 : 0);
