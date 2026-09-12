const SkillAssessment = require(
    "../models/SkillAssessment"
);
const skillQuestions = require(
    "../data/skillQuestions"
);

const SKILL_NAMES = {
    python: "Python",
    javascript: "JavaScript",
    react: "React",
    cpp: "C++",
    java: "Java",
    nodejs: "Node.js",
    mongodb: "MongoDB"
};

const normalizeSkill = (skill) =>
    String(skill || "").toLowerCase().trim();

const getQuestions = (skill) => {
    const key = normalizeSkill(skill);
    const questions = skillQuestions[key];

    return questions
        ? questions.map((question, index) => ({
              id: index + 1,
              question: question.question,
              options: question.options
          }))
        : null;
};

const getMySkills = async (req, res) => {
    try {
        const assessments =
            await SkillAssessment.find({
                user: req.userId
            }).sort({
                assessedAt: -1
            });

        const skills = assessments.map(
            (assessment) => ({
                skill:
                    SKILL_NAMES[normalizeSkill(
                        assessment.skill
                    )] ||
                    assessment.skill,
                proficiency: assessment.proficiency,
                assessmentScore:
                    assessment.assessmentScore,
                totalQuestions:
                    assessment.totalQuestions,
                verified: assessment.verified,
                assessedAt: assessment.assessedAt
            })
        );

        return res.json({
            message:
                "Skill assessments retrieved successfully",
            skills
        });
    } catch (error) {
        console.error(
            "Skill assessments retrieval error:",
            error
        );
        return res.status(500).json({
            message:
                "Failed to retrieve skill assessments",
            error: error.message
        });
    }
};

const submitAssessment = async (req, res) => {
    try {
        const key = normalizeSkill(req.params.skill);
        const questions = skillQuestions[key];

        if (!questions) {
            return res.status(404).json({
                message: "Skill not found"
            });
        }

        const answers = req.body.answers;

        if (
            !Array.isArray(answers) ||
            answers.length !== questions.length
        ) {
            return res.status(400).json({
                message:
                    "Please answer all questions before submitting"
            });
        }

        const invalidAnswer = answers.some(
            (answer) =>
                typeof answer !== "number" ||
                answer < 0 ||
                answer >= 4
        );

        if (invalidAnswer) {
            return res.status(400).json({
                message:
                    "Invalid answer format"
            });
        }

        let correct = 0;
        questions.forEach((question, index) => {
            if (answers[index] === question.correctAnswer) {
                correct++;
            }
        });

        const proficiency = Math.round(
            (correct / questions.length) * 100
        );

        const existing =
            await SkillAssessment.findOne({
                user: req.userId,
                skill: key
            });

        if (existing) {
            existing.proficiency = proficiency;
            existing.assessmentScore = correct;
            existing.totalQuestions = questions.length;
            existing.verified = true;
            existing.assessedAt = new Date();
            await existing.save();
        } else {
            const created = await SkillAssessment.create({
                user: req.userId,
                skill: key,
                proficiency,
                assessmentScore: correct,
                totalQuestions: questions.length,
                verified: true
            });
            var assessedAt = created.assessedAt;
        }

        return res.json({
            message: "Skill assessment completed successfully",
            skill: SKILL_NAMES[key] || req.params.skill,
            assessmentScore: correct,
            totalQuestions: questions.length,
            proficiency,
            verified: true,
            assessedAt: assessedAt || new Date()
        });
    } catch (error) {
        console.error(
            "Skill assessment submission error:",
            error
        );
        return res.status(500).json({
            message:
                "Failed to complete skill assessment",
            error: error.message
        });
    }
};

const getSkillQuestions = async (req, res) => {
    try {
        const key = normalizeSkill(req.params.skill);
        const questions = getQuestions(key);

        if (!questions) {
            return res.status(404).json({
                message: "Skill not found"
            });
        }

        return res.json({
            questions
        });
    } catch (error) {
        console.error(
            "Skill questions retrieval error:",
            error
        );
        return res.status(500).json({
            message:
                "Failed to retrieve skill questions",
            error: error.message
        });
    }
};

module.exports = {
    getMySkills,
    getSkillQuestions,
    submitAssessment
};