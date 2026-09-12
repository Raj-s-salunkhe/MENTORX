import { useState, useEffect } from "react";
import { apiUrl } from "./api";

const SKILLS = [
    { key: "python", name: "Python", icon: "🐍" },
    { key: "javascript", name: "JavaScript", icon: "🟨" },
    { key: "react", name: "React", icon: "⚛️" },
    { key: "cpp", name: "C++", icon: "⚙️" },
    { key: "java", name: "Java", icon: "☕" },
    { key: "nodejs", name: "Node.js", icon: "🟢" },
    { key: "mongodb", name: "MongoDB", icon: "🍃" }
];

function SkillVerification({ onBack }) {
    const [mode, setMode] = useState("select");
    const [selectedSkill, setSelectedSkill] = useState("");
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [result, setResult] = useState(null);
    const [mySkills, setMySkills] = useState([]);
    const [verifiedSkills, setVerifiedSkills] = useState([]);

    const token = localStorage.getItem("token");

    const authHeaders = {
        Authorization: `Bearer ${token}`
    };

    const fetchQuestions = async (skill) => {
        try {
            setLoading(true);
            setError("");
            const response = await fetch(
                apiUrl(`/api/skills/${skill}/questions`),
                { headers: authHeaders }
            );
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "Failed to load questions");
            }
            setQuestions(data.questions);
            setAnswers(new Array(data.questions.length).fill(null));
            setCurrentQuestion(0);
        } catch (err) {
            setError(err.message || "Failed to load questions");
        } finally {
            setLoading(false);
        }
    };

    const loadMySkills = async () => {
        try {
            const response = await fetch(
                apiUrl("/api/skills/my"),
                { headers: authHeaders }
            );
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "Failed to load skills");
            }
            setMySkills(data.skills || []);
            setVerifiedSkills(
                (data.skills || []).filter((s) => s.verified)
            );
        } catch {}
    };

    useEffect(() => {
        loadMySkills();
    }, []);

    const handleSkillSelect = (skillKey) => {
        setSelectedSkill(skillKey);
        setMode("questions");
        fetchQuestions(skillKey);
    };

    const handleAnswer = (questionIndex, answerIndex) => {
        const newAnswers = [...answers];
        newAnswers[questionIndex] = answerIndex;
        setAnswers(newAnswers);
    };

    const handleNext = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion((prev) => prev + 1);
        }
    };

    const handlePrev = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion((prev) => prev - 1);
        }
    };

    const handleSubmit = async () => {
        const unanswered = answers.filter((a) => a === null);
        if (unanswered.length > 0) {
            setError("Please answer all questions before submitting.");
            return;
        }

        try {
            setSubmitting(true);
            setError("");
            const response = await fetch(
                apiUrl(`/api/skills/${selectedSkill}/submit`),
                {
                    method: "POST",
                    headers: {
                        ...authHeaders,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ answers })
                }
            );
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "Submission failed");
            }
            setResult({
                skill: data.skill,
                assessmentScore: data.assessmentScore,
                totalQuestions: data.totalQuestions,
                proficiency: data.proficiency,
                verified: data.verified
            });
            setMode("result");
            loadMySkills();
        } catch (err) {
            setError(err.message || "Failed to submit assessment");
        } finally {
            setSubmitting(false);
        }
    };

    const progress = questions.length
        ? Math.round((currentQuestion + 1) / questions.length * 100)
        : 0;

    return (
        <div className="skill-verification-page">

            {/* ---- HEADER ---- */}
            <div className="ai-mentor-header">
                <p className="dashboard-tag">
                    MENTORX SKILL VERIFICATION
                </p>
                <h1>Verify Your Skills</h1>
                <p>
                    Take a 10-question assessment for any skill
                    to earn a verified proficiency score.
                </p>
            </div>

            {/* ---- SELECT SKILL ---- */}
            {mode === "select" && (
                <section className="skill-select-section">
                    <div className="skill-select-grid">
                        {SKILLS.map((skill) => {
                            const isVerified = verifiedSkills.some(
                                (s) => s.skill === skill.name
                            );
                            return (
                                <div
                                    key={skill.key}
                                    className="skill-card"
                                    onClick={() =>
                                        handleSkillSelect(skill.key)
                                    }
                                >
                                    <div className="skill-card-icon">
                                        {skill.icon}
                                    </div>
                                    <h3>{skill.name}</h3>
                                    {isVerified && (
                                        <span className="verified-badge">
                                            ✓ Verified{" "}
                                            {
                                                verifiedSkills.find(
                                                    (s) =>
                                                        s.skill ===
                                                        skill.name
                                                )?.proficiency
                                            }%
                                        </span>
                                    )}
                                    <button className="skill-start-btn">
                                        {isVerified
                                            ? "Retake Assessment"
                                            : "Start Assessment"}
                                    </button>
                                </div>
                            );
                        })}
                    </div>

                    {mySkills.length > 0 && (
                        <div className="verified-skills-summary">
                            <h3>Your Verified Skills</h3>
                            <div className="skill-tags">
                                {mySkills.map((s) => (
                                    <span
                                        key={s.skill}
                                        className={
                                            s.verified
                                                ? "skill-tag-verified"
                                                : "skill-tag"
                                        }
                                    >
                                        {s.skill} — {s.proficiency}%
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    <button
                        className="secondary-btn"
                        onClick={onBack}
                        style={{ marginTop: "20px" }}
                    >
                        ← Back
                    </button>
                </section>
            )}

            {/* ---- QUESTIONS ---- */}
            {mode === "questions" && (
                <section className="skill-questions-section">
                    <div className="skill-question-header">
                        <button
                            className="secondary-btn"
                            onClick={() => {
                                setMode("select");
                                setQuestions([]);
                            }}
                        >
                            ← Back
                        </button>
                        <h2>
                            {SKILLS.find((s) => s.key === selectedSkill)
                                ?.name || selectedSkill}
                        </h2>
                    </div>

                    {loading && (
                        <div className="ai-thinking">
                            <span>Loading questions...</span>
                        </div>
                    )}

                    {error && (
                        <div className="projects-message">{error}</div>
                    )}

                    {!loading && questions.length > 0 && (
                        <>
                            {/* Progress */}
                            <div className="skill-progress">
                                <div className="skill-progress-track">
                                    <div
                                        className="skill-progress-fill"
                                        style={{
                                            width: `${progress}%`
                                        }}
                                    />
                                </div>
                                <span>{progress}%</span>
                            </div>

                            <div className="skill-question-counter">
                                Question {currentQuestion + 1} of{" "}
                                {questions.length}
                            </div>

                            {/* Question */}
                            <div className="skill-question-card">
                                <h3>
                                    {
                                        questions[currentQuestion]
                                            .question
                                    }
                                </h3>
                                <div className="skill-options">
                                    {questions[
                                        currentQuestion
                                    ].options.map((option, idx) => {
                                        const letter =
                                            String.fromCharCode(
                                                65 + idx
                                            );
                                        const isSelected =
                                            answers[currentQuestion] ===
                                            idx;
                                        return (
                                            <button
                                                key={idx}
                                                className={`skill-option ${
                                                    isSelected
                                                        ? "skill-option-selected"
                                                        : ""
                                                }`}
                                                onClick={() =>
                                                    handleAnswer(
                                                        currentQuestion,
                                                        idx
                                                    )
                                                }
                                            >
                                                <span className="option-letter">
                                                    {letter}
                                                </span>
                                                <span>{option}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Navigation */}
                            <div className="skill-nav">
                                <button
                                    className="secondary-btn"
                                    onClick={handlePrev}
                                    disabled={currentQuestion === 0}
                                >
                                    ← Previous
                                </button>
                                <span>
                                    {currentQuestion + 1}/
                                    {questions.length}
                                </span>
                                {currentQuestion ===
                                questions.length - 1 ? (
                                    <button
                                        className="primary-btn"
                                        onClick={handleSubmit}
                                        disabled={submitting}
                                    >
                                        {submitting
                                            ? "Submitting..."
                                            : `Submit (${
                                                  answers.filter(
                                                      (a) => a !== null
                                                  ).length
                                              }/${questions.length})`}
                                    </button>
                                ) : (
                                    <button
                                        className="primary-btn"
                                        onClick={handleNext}
                                        disabled={
                                            answers[currentQuestion] ===
                                            null
                                        }
                                    >
                                        Next →
                                    </button>
                                )}
                            </div>
                        </>
                    )}
                </section>
            )}

            {/* ---- RESULT ---- */}
            {mode === "result" && result && (
                <section className="skill-result-section">
                    <div className="skill-result-card">
                        <div className="result-icon">
                            {result.verified ? "🎉" : "📝"}
                        </div>
                        <h2>
                            Assessment Complete
                        </h2>
                        <p>
                            {result.skill} Proficiency
                        </p>

                        <div className="result-score">
                            <strong>
                                {result.proficiency}%
                            </strong>
                            <span>Proficiency Score</span>
                        </div>

                        <div className="result-details">
                            <p>
                                {result.assessmentScore} /{" "}
                                {result.totalQuestions}{" "}
                                Correct
                            </p>
                        </div>

                        {result.verified && (
                            <div className="verified-badge-lg">
                                ✓ Skill Verified
                            </div>
                        )}

                        <button
                            className="primary-btn"
                            onClick={() => {
                                setMode("select");
                                setResult(null);
                            }}
                        >
                            Back to Skills
                        </button>
                    </div>
                </section>
            )}

            {/* ---- ERROR ---- */}
            {error && mode === "questions" && (
                <div className="projects-message">{error}</div>
            )}
        </div>
    );
}

export default SkillVerification;